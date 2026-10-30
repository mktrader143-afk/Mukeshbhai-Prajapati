import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  BookOpen,
  Droplet,
  Users,
  Target,
  Banknote,
  BarChart2,
  Plus,
  Mic,
  RotateCcw,
  Check,
} from 'lucide-react';
import {
  Transaction,
  MilkRecord,
  MilkSettings,
  KhataContact,
  SavingsGoal,
  BudgetConfig,
  Language,
} from './types';
import {
  INITIAL_TRANSACTIONS,
  INITIAL_MILK_SETTINGS,
  generateInitialMilkRecords,
  INITIAL_KHATA_CONTACTS,
  INITIAL_SAVINGS_GOALS,
  INITIAL_BUDGET,
} from './mockData';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { TransactionsList } from './components/TransactionsList';
import { AddTransactionModal } from './components/AddTransactionModal';
import { MilkDiary } from './components/MilkDiary';
import { KhataBahi } from './components/KhataBahi';
import { BudgetAndGoals } from './components/BudgetAndGoals';
import { CashCounter } from './components/CashCounter';
import { ReportsView } from './components/ReportsView';
import { VoiceQuickAdd } from './components/VoiceQuickAdd';
import { getTranslation } from './translations';
import { generateCsvData } from './utils/formatters';

type TabType = 'ledger' | 'milk' | 'khata' | 'budget' | 'cash' | 'reports';

export default function App() {
  // Persistence state
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('ghar_transactions');
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [milkRecords, setMilkRecords] = useState<MilkRecord[]>(() => {
    try {
      const saved = localStorage.getItem('ghar_milk_records');
      return saved ? JSON.parse(saved) : generateInitialMilkRecords();
    } catch {
      return generateInitialMilkRecords();
    }
  });

  const [milkSettings, setMilkSettings] = useState<MilkSettings>(() => {
    try {
      const saved = localStorage.getItem('ghar_milk_settings');
      return saved ? JSON.parse(saved) : INITIAL_MILK_SETTINGS;
    } catch {
      return INITIAL_MILK_SETTINGS;
    }
  });

  const [khataContacts, setKhataContacts] = useState<KhataContact[]>(() => {
    try {
      const saved = localStorage.getItem('ghar_khata_contacts');
      return saved ? JSON.parse(saved) : INITIAL_KHATA_CONTACTS;
    } catch {
      return INITIAL_KHATA_CONTACTS;
    }
  });

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => {
    try {
      const saved = localStorage.getItem('ghar_savings_goals');
      return saved ? JSON.parse(saved) : INITIAL_SAVINGS_GOALS;
    } catch {
      return INITIAL_SAVINGS_GOALS;
    }
  });

  const [budgetConfig, setBudgetConfig] = useState<BudgetConfig>(() => {
    try {
      const saved = localStorage.getItem('ghar_budget_config');
      return saved ? JSON.parse(saved) : INITIAL_BUDGET;
    } catch {
      return INITIAL_BUDGET;
    }
  });

  const [householdName, setHouseholdName] = useState<string>(() => {
    return localStorage.getItem('ghar_household_name') || 'અમારું ઘર';
  });

  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('ghar_language') as Language) || 'gu';
  });

  const [useGujDigits, setUseGujDigits] = useState<boolean>(() => {
    return localStorage.getItem('ghar_use_guj_digits') === 'true';
  });

  const [currentMonth, setCurrentMonth] = useState<string>('2026-10');
  const [activeTab, setActiveTab] = useState<TabType>('ledger');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [initialModalType, setInitialModalType] = useState<'expense' | 'income'>('expense');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // File input ref for restore
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save to LocalStorage effects
  useEffect(() => {
    localStorage.setItem('ghar_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('ghar_milk_records', JSON.stringify(milkRecords));
  }, [milkRecords]);

  useEffect(() => {
    localStorage.setItem('ghar_milk_settings', JSON.stringify(milkSettings));
  }, [milkSettings]);

  useEffect(() => {
    localStorage.setItem('ghar_khata_contacts', JSON.stringify(khataContacts));
  }, [khataContacts]);

  useEffect(() => {
    localStorage.setItem('ghar_savings_goals', JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  useEffect(() => {
    localStorage.setItem('ghar_budget_config', JSON.stringify(budgetConfig));
  }, [budgetConfig]);

  useEffect(() => {
    localStorage.setItem('ghar_household_name', householdName);
  }, [householdName]);

  useEffect(() => {
    localStorage.setItem('ghar_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('ghar_use_guj_digits', useGujDigits ? 'true' : 'false');
  }, [useGujDigits]);

  const t = getTranslation(language);

  // Aggregated Month Metrics
  const currentMonthTransactions = useMemo(() => {
    return transactions.filter((tx) => tx.date.startsWith(currentMonth));
  }, [transactions, currentMonth]);

  const totalIncome = useMemo(() => {
    return currentMonthTransactions
      .filter((tx) => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [currentMonthTransactions]);

  const totalExpense = useMemo(() => {
    return currentMonthTransactions
      .filter((tx) => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [currentMonthTransactions]);

  const todayExpense = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return transactions
      .filter((tx) => tx.type === 'expense' && tx.date === today)
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions]);

  // Transaction Handlers
  const handleSaveTransaction = (
    data: Omit<Transaction, 'id' | 'createdAt'>,
    existingId?: string
  ) => {
    if (existingId) {
      setTransactions((prev) =>
        prev.map((item) =>
          item.id === existingId
            ? { ...item, ...data }
            : item
        )
      );
    } else {
      const newTx: Transaction = {
        ...data,
        id: 't-' + Date.now(),
        createdAt: Date.now(),
      };
      setTransactions((prev) => [newTx, ...prev]);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    if (
      window.confirm(
        language === 'gu'
          ? 'શું તમે આ હિસાબ ખરેખર કાઢી નાખવા માંગો છો?'
          : 'Are you sure you want to delete this transaction?'
      )
    ) {
      setTransactions((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsAddModalOpen(true);
  };

  const handleOpenAddModal = (type: 'expense' | 'income' = 'expense') => {
    setEditingTransaction(null);
    setInitialModalType(type);
    setIsAddModalOpen(true);
  };

  const handleQuickChipAdd = (
    amount: number,
    categoryId: string,
    description: string,
    type: 'expense' | 'income'
  ) => {
    const newTx: Transaction = {
      id: 't-' + Date.now(),
      type,
      amount,
      categoryId,
      description,
      date: new Date().toISOString().split('T')[0],
      paymentMode: 'cash',
      createdAt: Date.now(),
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // Milk Handlers
  const handleUpdateMilkRecord = (record: MilkRecord) => {
    setMilkRecords((prev) => {
      const exists = prev.some((r) => r.date === record.date);
      if (exists) {
        return prev.map((r) => (r.date === record.date ? record : r));
      }
      return [...prev, record];
    });
  };

  // Khata Handlers
  const handleAddKhataContact = (
    contactData: Omit<KhataContact, 'id' | 'createdAt' | 'entries'>,
    initialAmount: number = 0
  ) => {
    const newContact: KhataContact = {
      ...contactData,
      id: 'k-' + Date.now(),
      balance: initialAmount,
      createdAt: Date.now(),
      entries:
        initialAmount > 0
          ? [
              {
                id: 'ke-' + Date.now(),
                date: new Date().toISOString().split('T')[0],
                amount: initialAmount,
                type: 'borrowed',
                note: language === 'gu' ? 'શરૂઆતની બાકી રકમ' : 'Initial balance',
              },
            ]
          : [],
    };
    setKhataContacts((prev) => [newContact, ...prev]);
  };

  const handleAddKhataEntry = (contactId: string, entryData: Omit<Transaction, 'id'> | any) => {
    setKhataContacts((prev) =>
      prev.map((c) => {
        if (c.id !== contactId) return c;
        const newEntry = {
          ...entryData,
          id: 'ke-' + Date.now(),
        };
        const delta = entryData.type === 'settled' ? -entryData.amount : entryData.amount;
        const newBalance = Math.max(0, c.balance + delta);
        return {
          ...c,
          balance: newBalance,
          entries: [...(c.entries || []), newEntry],
        };
      })
    );
  };

  const handleSettleFullKhata = (contactId: string) => {
    setKhataContacts((prev) =>
      prev.map((c) => {
        if (c.id !== contactId) return c;
        const settleEntry = {
          id: 'ke-' + Date.now(),
          date: new Date().toISOString().split('T')[0],
          amount: c.balance,
          type: 'settled' as const,
          note: language === 'gu' ? 'સંપૂર્ણ હિસાબ ચુકતે કર્યો' : 'Full settlement',
        };
        return {
          ...c,
          balance: 0,
          entries: [...(c.entries || []), settleEntry],
        };
      })
    );
  };

  const handleDeleteKhataContact = (contactId: string) => {
    if (
      window.confirm(
        language === 'gu'
          ? 'શું તમે આ ખાતું કાઢી નાખવા માંગો છો?'
          : 'Are you sure you want to delete this account?'
      )
    ) {
      setKhataContacts((prev) => prev.filter((c) => c.id !== contactId));
    }
  };

  // Savings Goal Handlers
  const handleAddGoal = (goalData: Omit<SavingsGoal, 'id' | 'isCompleted'>) => {
    const newGoal: SavingsGoal = {
      ...goalData,
      id: 'g-' + Date.now(),
      isCompleted: goalData.savedAmount >= goalData.targetAmount,
    };
    setSavingsGoals((prev) => [...prev, newGoal]);
  };

  const handleAddSavingsToGoal = (goalId: string, amount: number) => {
    setSavingsGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const updatedSaved = g.savedAmount + amount;
        return {
          ...g,
          savedAmount: updatedSaved,
          isCompleted: updatedSaved >= g.targetAmount,
        };
      })
    );
  };

  const handleDeleteGoal = (goalId: string) => {
    setSavingsGoals((prev) => prev.filter((g) => g.id !== goalId));
  };

  // Export CSV Handler
  const handleExportCsv = () => {
    const csvStr = generateCsvData(currentMonthTransactions, language);
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Ghar_Hisab_${currentMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Backup JSON
  const handleBackup = () => {
    const dataToExport = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      householdName,
      transactions,
      milkRecords,
      milkSettings,
      khataContacts,
      savingsGoals,
      budgetConfig,
    };
    const jsonStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ghar_no_hisab_backup_${currentMonth}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Restore JSON
  const handleTriggerRestore = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.transactions) setTransactions(parsed.transactions);
        if (parsed.milkRecords) setMilkRecords(parsed.milkRecords);
        if (parsed.milkSettings) setMilkSettings(parsed.milkSettings);
        if (parsed.khataContacts) setKhataContacts(parsed.khataContacts);
        if (parsed.savingsGoals) setSavingsGoals(parsed.savingsGoals);
        if (parsed.budgetConfig) setBudgetConfig(parsed.budgetConfig);
        if (parsed.householdName) setHouseholdName(parsed.householdName);
        alert(
          language === 'gu'
            ? 'તમારો હિસાબ સફળતાપૂર્વક પાછો આવી ગયો છે!'
            : 'Backup successfully restored!'
        );
      } catch {
        alert(
          language === 'gu'
            ? 'ફાઇલ વાંચવામાં ભૂલ આવી. કૃપા કરીને સાચી JSON ફાઇલ પસંદ કરો.'
            : 'Error reading file. Please select a valid JSON backup file.'
        );
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Load Sample Data
  const handleLoadSample = () => {
    if (
      window.confirm(
        language === 'gu'
          ? 'શું તમે નમૂનાનો હિસાબ ડેટા લોડ કરવા માંગો છો?'
          : 'Do you want to load realistic sample household data?'
      )
    ) {
      setTransactions(INITIAL_TRANSACTIONS);
      setMilkRecords(generateInitialMilkRecords());
      setMilkSettings(INITIAL_MILK_SETTINGS);
      setKhataContacts(INITIAL_KHATA_CONTACTS);
      setSavingsGoals(INITIAL_SAVINGS_GOALS);
      setBudgetConfig(INITIAL_BUDGET);
      setHouseholdName('પટેલ પરિવાર હિસાબ');
      setCurrentMonth('2026-10');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const tabs = [
    { id: 'ledger' as const, labelGu: 'રોજમેળ', labelEn: 'Daily Ledger', icon: BookOpen },
    { id: 'milk' as const, labelGu: 'દૂધ ડાયરી', labelEn: 'Milk Diary', icon: Droplet },
    { id: 'khata' as const, labelGu: 'ઉધાર-જમા', labelEn: 'Khata Bahi', icon: Users },
    { id: 'budget' as const, labelGu: 'બજેટ અને બચત', labelEn: 'Budget & Goals', icon: Target },
    { id: 'cash' as const, labelGu: 'નોટ ગણતરી', labelEn: 'Cash Counter', icon: Banknote },
    { id: 'reports' as const, labelGu: 'અહેવાલ / પ્રિન્ટ', labelEn: 'Reports & Print', icon: BarChart2 },
  ];

  return (
    <div className="min-h-screen bg-stone-50/60 text-stone-900 pb-16 selection:bg-amber-200">
      
      {/* Hidden file input for restore */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      {/* Main App Header */}
      <Header
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        language={language}
        setLanguage={setLanguage}
        useGujDigits={useGujDigits}
        setUseGujDigits={setUseGujDigits}
        householdName={householdName}
        setHouseholdName={setHouseholdName}
        onOpenAddModal={handleOpenAddModal}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        onPrint={handlePrint}
        onExportCsv={handleExportCsv}
        onBackup={handleBackup}
        onRestore={handleTriggerRestore}
        onLoadSample={handleLoadSample}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-5">
        
        {/* High-Level Financial Health Summary Cards */}
        <SummaryCards
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          todayExpense={todayExpense}
          budgetConfig={budgetConfig}
          language={language}
          useGujDigits={useGujDigits}
          onOpenBudgetModal={() => setActiveTab('budget')}
        />

        {/* Tab Navigation Navigation Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 border-b border-stone-200 no-print">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                  isActive
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-100' : 'text-stone-400'}`} />
                <span>{language === 'gu' ? tab.labelGu : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Active Tab View */}
        {activeTab === 'ledger' && (
          <TransactionsList
            transactions={transactions}
            currentMonth={currentMonth}
            language={language}
            useGujDigits={useGujDigits}
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onQuickAdd={handleQuickChipAdd}
            onOpenAddModal={handleOpenAddModal}
          />
        )}

        {activeTab === 'milk' && (
          <MilkDiary
            currentMonth={currentMonth}
            records={milkRecords}
            settings={milkSettings}
            onUpdateRecord={handleUpdateMilkRecord}
            onUpdateSettings={setMilkSettings}
            language={language}
            useGujDigits={useGujDigits}
          />
        )}

        {activeTab === 'khata' && (
          <KhataBahi
            contacts={khataContacts}
            onAddContact={handleAddKhataContact}
            onAddEntry={handleAddKhataEntry}
            onSettleFull={handleSettleFullKhata}
            onDeleteContact={handleDeleteKhataContact}
            language={language}
            useGujDigits={useGujDigits}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetAndGoals
            budgetConfig={budgetConfig}
            onUpdateBudget={setBudgetConfig}
            savingsGoals={savingsGoals}
            onAddGoal={handleAddGoal}
            onAddSavingsToGoal={handleAddSavingsToGoal}
            onDeleteGoal={handleDeleteGoal}
            transactions={transactions}
            currentMonth={currentMonth}
            language={language}
            useGujDigits={useGujDigits}
          />
        )}

        {activeTab === 'cash' && (
          <CashCounter
            language={language}
            useGujDigits={useGujDigits}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            transactions={transactions}
            milkRecords={milkRecords}
            milkSettings={milkSettings}
            currentMonth={currentMonth}
            householdName={householdName}
            language={language}
            useGujDigits={useGujDigits}
            onPrint={handlePrint}
            onExportCsv={handleExportCsv}
          />
        )}

      </main>

      {/* Floating Action Buttons on Mobile */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-40 sm:hidden no-print">
        <button
          onClick={() => setIsVoiceModalOpen(true)}
          className="w-12 h-12 rounded-full bg-amber-600 text-white shadow-lg flex items-center justify-center"
          title={t.quickAdd}
        >
          <Mic className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleOpenAddModal('expense')}
          className="w-14 h-14 rounded-full bg-rose-600 text-white shadow-xl flex items-center justify-center font-bold text-2xl"
          title={t.addExpense}
        >
          +
        </button>
      </div>

      {/* Add / Edit Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
        editTransaction={editingTransaction}
        initialType={initialModalType}
        language={language}
      />

      {/* Voice / Quick Text Entry Modal */}
      <VoiceQuickAdd
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSave={(newTx) => {
          handleSaveTransaction(newTx);
          setIsVoiceModalOpen(false);
        }}
        language={language}
        useGujDigits={useGujDigits}
      />

    </div>
  );
}
