import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  CreditCard,
  Banknote,
  Smartphone,
  Building,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
} from 'lucide-react';
import { Transaction, Language, PaymentMode } from '../types';
import { getTranslation } from '../translations';
import { getCategoryById } from '../constants/categories';
import { CategoryIcon } from './CategoryIcon';
import { formatCurrency, formatDateGujarati } from '../utils/formatters';

interface TransactionsListProps {
  transactions: Transaction[];
  currentMonth: string;
  language: Language;
  useGujDigits: boolean;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onQuickAdd: (amount: number, categoryId: string, desc: string, type: 'expense' | 'income') => void;
  onOpenAddModal: (type?: 'expense' | 'income') => void;
}

export const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  currentMonth,
  language,
  useGujDigits,
  onEditTransaction,
  onDeleteTransaction,
  onQuickAdd,
  onOpenAddModal,
}) => {
  const t = getTranslation(language);
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | PaymentMode>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Quick addition suggestion buttons for common Indian home daily expenses
  const quickChips = [
    { labelGu: 'શાકભાજી ₹૧૫૦', labelEn: 'Vegetables ₹150', amount: 150, categoryId: 'vegetables_fruits', desc: 'દૈનિક શાકભાજી', type: 'expense' as const },
    { labelGu: 'દૂધ ₹૬૪', labelEn: 'Milk ₹64', amount: 64, categoryId: 'milk_dairy', desc: 'અમૂલ દૂધ', type: 'expense' as const },
    { labelGu: 'ચા-નાસ્તો ₹૬૦', labelEn: 'Tea-Snacks ₹60', amount: 60, categoryId: 'dining_snacks', desc: 'સવારની ચા અને નાસ્તો', type: 'expense' as const },
    { labelGu: 'પેટ્રોલ ₹૨૦૦', labelEn: 'Petrol ₹200', amount: 200, categoryId: 'transport', desc: 'એક્ટિવામાં પેટ્રોલ', type: 'expense' as const },
    { labelGu: 'પરચૂરણ ₹૧૦૦', labelEn: 'Petty Cash ₹100', amount: 100, categoryId: 'miscellaneous', desc: 'દૈનિક પરચૂરણ ખર્ચ', type: 'expense' as const },
  ];

  // Filter transactions for current month
  const filtered = useMemo(() => {
    return transactions
      .filter((tx) => {
        // Month check
        if (!tx.date.startsWith(currentMonth)) return false;
        // Type filter
        if (filterType !== 'all' && tx.type !== filterType) return false;
        // Payment filter
        if (paymentFilter !== 'all' && tx.paymentMode !== paymentFilter) return false;
        // Search query
        if (searchQuery.trim()) {
          const cat = getCategoryById(tx.categoryId);
          const q = searchQuery.toLowerCase();
          const matchDesc = (tx.description || '').toLowerCase().includes(q);
          const matchNote = (tx.notes || '').toLowerCase().includes(q);
          const matchGuCat = cat.nameGu.toLowerCase().includes(q);
          const matchEnCat = cat.nameEn.toLowerCase().includes(q);
          if (!matchDesc && !matchNote && !matchGuCat && !matchEnCat) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.createdAt - a.createdAt);
  }, [transactions, currentMonth, filterType, paymentFilter, searchQuery]);

  // Group by date
  const groupedTransactions = useMemo(() => {
    const groups: { [date: string]: Transaction[] } = {};
    filtered.forEach((tx) => {
      if (!groups[tx.date]) groups[tx.date] = [];
      groups[tx.date].push(tx);
    });
    return groups;
  }, [filtered]);

  const getPaymentIcon = (mode: PaymentMode) => {
    switch (mode) {
      case 'cash':
        return <Banknote className="w-3.5 h-3.5 text-emerald-600" />;
      case 'upi':
        return <Smartphone className="w-3.5 h-3.5 text-indigo-600" />;
      case 'card':
        return <CreditCard className="w-3.5 h-3.5 text-amber-600" />;
      case 'bank':
        return <Building className="w-3.5 h-3.5 text-sky-600" />;
    }
  };

  const getPaymentLabel = (mode: PaymentMode) => {
    switch (mode) {
      case 'cash':
        return language === 'gu' ? 'રોકડ' : 'Cash';
      case 'upi':
        return 'UPI';
      case 'card':
        return language === 'gu' ? 'કાર્ડ' : 'Card';
      case 'bank':
        return language === 'gu' ? 'બેંક' : 'Bank';
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Quick Add Quick-Chips Bar */}
      <div className="bg-white rounded-xl p-3 border border-stone-200/80 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-stone-600">
            {language === 'gu' ? 'ઝડપી ૧-ક્લિક ખર્ચ નોંધણી:' : 'Quick 1-Click Common Expenses:'}
          </span>
          <span className="text-[11px] text-stone-400">
            {language === 'gu' ? 'ક્લિક કરતાં તરત જ રોજમેળમાં નોંધાશે' : 'Click to quickly log'}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => onQuickAdd(chip.amount, chip.categoryId, chip.desc, chip.type)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-stone-50 hover:bg-amber-50 text-stone-700 hover:text-amber-900 rounded-lg border border-stone-200 hover:border-amber-300 transition-colors"
            >
              <Plus className="w-3 h-3 text-amber-700" />
              <span>{language === 'gu' ? chip.labelGu : chip.labelEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-3 sm:p-4 border border-stone-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-stone-50 rounded-lg border border-stone-200 focus:outline-hidden focus:ring-1 focus:ring-amber-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Segmented Type Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg shrink-0">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                filterType === 'all'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.filterAll}
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                filterType === 'expense'
                  ? 'bg-rose-50 text-rose-700 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.filterExpenses}
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                filterType === 'income'
                  ? 'bg-emerald-50 text-emerald-800 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.filterIncome}
            </button>
          </div>

        </div>

        {/* Payment mode filter tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-stone-500">
          <span className="shrink-0 text-stone-400 font-medium">
            {language === 'gu' ? 'ચૂકવણી:' : 'Payment:'}
          </span>
          {(['all', 'cash', 'upi', 'bank', 'card'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setPaymentFilter(mode)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0 ${
                paymentFilter === mode
                  ? 'bg-stone-800 text-white'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {mode === 'all'
                ? language === 'gu'
                  ? 'બધા પ્રકાર'
                  : 'All Modes'
                : getPaymentLabel(mode)}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-stone-400 shrink-0">
            {filtered.length} {language === 'gu' ? 'હિસાબ નોંધાયા' : 'entries'}
          </span>
        </div>
      </div>

      {/* Transactions grouped by Date */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center border border-stone-200">
          <Receipt className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <p className="text-stone-600 font-medium text-sm">{t.noTransactions}</p>
          <p className="text-stone-400 text-xs mt-1">
            {language === 'gu'
              ? 'નવો ખર્ચ અથવા આવક ઉમેરવા ઉપરના બટન પર ક્લિક કરો.'
              : 'Click Add Expense or Add Income above to log your first record.'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => onOpenAddModal('expense')}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              + {t.addExpense}
            </button>
            <button
              onClick={() => onOpenAddModal('income')}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              + {t.addIncome}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.keys(groupedTransactions).map((dateStr) => {
            const dayList = groupedTransactions[dateStr];
            const dayTotalExpense = dayList
              .filter((x) => x.type === 'expense')
              .reduce((sum, x) => sum + x.amount, 0);
            const dayTotalIncome = dayList
              .filter((x) => x.type === 'income')
              .reduce((sum, x) => sum + x.amount, 0);

            return (
              <div key={dateStr} className="bg-white rounded-xl border border-stone-200/80 shadow-2xs overflow-hidden">
                {/* Day Header */}
                <div className="bg-stone-50/80 px-4 py-2.5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-stone-500" />
                    <span className="font-semibold text-xs sm:text-sm text-stone-800">
                      {formatDateGujarati(dateStr, language, useGujDigits)}
                    </span>
                  </div>
                  
                  {/* Day summary */}
                  <div className="flex items-center gap-3 text-xs">
                    {dayTotalIncome > 0 && (
                      <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                        <ArrowDownLeft className="w-3 h-3" />
                        +{formatCurrency(dayTotalIncome, useGujDigits)}
                      </span>
                    )}
                    {dayTotalExpense > 0 && (
                      <span className="text-rose-700 font-semibold flex items-center gap-0.5">
                        <ArrowUpRight className="w-3 h-3" />
                        -{formatCurrency(dayTotalExpense, useGujDigits)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Day Items List */}
                <div className="divide-y divide-stone-100">
                  {dayList.map((tx) => {
                    const cat = getCategoryById(tx.categoryId);
                    const isIncome = tx.type === 'income';

                    return (
                      <div
                        key={tx.id}
                        className="p-3 sm:px-4 hover:bg-stone-50/70 transition-colors flex items-center justify-between gap-3 group"
                      >
                        {/* Left: Icon & Info */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${cat.bgLight} ${cat.borderClass}`}
                          >
                            <CategoryIcon name={cat.iconName} className="w-4 h-4" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-xs sm:text-sm text-stone-900 truncate">
                                {tx.description || (language === 'gu' ? cat.nameGu : cat.nameEn)}
                              </span>
                            </div>

                            {/* Clean Typographic metadata with separator */}
                            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-0.5">
                              <span>{language === 'gu' ? cat.nameGu : cat.nameEn}</span>
                              <span aria-hidden="true" className="text-stone-300">·</span>
                              <span className="flex items-center gap-1">
                                {getPaymentIcon(tx.paymentMode)}
                                <span>{getPaymentLabel(tx.paymentMode)}</span>
                              </span>
                              {tx.notes && (
                                <>
                                  <span aria-hidden="true" className="text-stone-300">·</span>
                                  <span className="text-stone-400 truncate max-w-[150px]">{tx.notes}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right: Amount & Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="text-right">
                            <span
                              className={`text-sm sm:text-base font-bold tracking-tight ${
                                isIncome ? 'text-emerald-700' : 'text-stone-900'
                              }`}
                            >
                              {isIncome ? '+' : '-'}
                              {formatCurrency(tx.amount, useGujDigits)}
                            </span>
                          </div>

                          {/* Action Buttons (visible on hover or mobile) */}
                          <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => onEditTransaction(tx)}
                              className="p-1 text-stone-400 hover:text-amber-700 hover:bg-amber-50 rounded"
                              title={t.editBtn}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteTransaction(tx.id)}
                              className="p-1 text-stone-400 hover:text-rose-700 hover:bg-rose-50 rounded"
                              title={t.deleteBtn}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
