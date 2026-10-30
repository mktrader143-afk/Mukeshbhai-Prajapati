import React, { useState } from 'react';
import {
  Calendar,
  Languages,
  Download,
  Upload,
  Printer,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Plus,
  Mic,
  RotateCcw,
} from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../translations';
import { getMonthName } from '../utils/formatters';

interface HeaderProps {
  currentMonth: string; // YYYY-MM
  setCurrentMonth: (m: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  useGujDigits: boolean;
  setUseGujDigits: (val: boolean) => void;
  householdName: string;
  setHouseholdName: (name: string) => void;
  onOpenAddModal: (type?: 'expense' | 'income') => void;
  onOpenVoiceModal: () => void;
  onPrint: () => void;
  onExportCsv: () => void;
  onBackup: () => void;
  onRestore: () => void;
  onLoadSample: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMonth,
  setCurrentMonth,
  language,
  setLanguage,
  useGujDigits,
  setUseGujDigits,
  householdName,
  setHouseholdName,
  onOpenAddModal,
  onOpenVoiceModal,
  onPrint,
  onExportCsv,
  onBackup,
  onRestore,
  onLoadSample,
}) => {
  const t = getTranslation(language);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(householdName);

  const handlePrevMonth = () => {
    const [y, m] = currentMonth.split('-').map(Number);
    const prevDate = new Date(y, m - 2, 1);
    const newY = prevDate.getFullYear();
    const newM = (prevDate.getMonth() + 1).toString().padStart(2, '0');
    setCurrentMonth(`${newY}-${newM}`);
  };

  const handleNextMonth = () => {
    const [y, m] = currentMonth.split('-').map(Number);
    const nextDate = new Date(y, m, 1);
    const newY = nextDate.getFullYear();
    const newM = (nextDate.getMonth() + 1).toString().padStart(2, '0');
    setCurrentMonth(`${newY}-${newM}`);
  };

  const saveName = () => {
    if (tempName.trim()) {
      setHouseholdName(tempName.trim());
    }
    setIsEditingName(false);
  };

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs no-print">
      {/* Auspicious top accent strip */}
      <div className="bg-linear-to-r from-amber-700 via-orange-600 to-amber-800 text-amber-50 text-[11px] font-medium py-1 px-4 text-center tracking-wide flex items-center justify-between">
        <span className="hidden sm:inline">॥ શ્રી ગણેશાય નમઃ ॥ શુભ લાભ ॥</span>
        <span className="mx-auto font-semibold">
          {language === 'gu' ? 'ઘરનો સુચારૂ હિસાબ - લક્ષ્મીજીની કૃપા' : 'House Accounting & Wealth Tracker'}
        </span>
        <span className="hidden sm:inline">॥ શ્રી મહાલક્ષ્મ્યૈ નમઃ ॥</span>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Brand & Household Name */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-600 to-orange-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                હિ
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
                    {t.appTitle}
                  </h1>
                  <span className="text-stone-300">|</span>
                  {isEditingName ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="text-xs px-2 py-0.5 border border-amber-300 rounded focus:outline-hidden focus:ring-1 focus:ring-amber-500 bg-amber-50/50"
                        placeholder="ઘર / પરિવારનું નામ"
                        autoFocus
                        onBlur={saveName}
                        onKeyDown={(e) => e.key === 'Enter' && saveName()}
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setTempName(householdName);
                        setIsEditingName(true);
                      }}
                      title="પરિવારનું નામ બદલો"
                      className="text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded transition-colors"
                    >
                      {householdName} ✎
                    </button>
                  )}
                </div>
                <p className="text-[12px] text-stone-500">
                  {t.appSubtitle}
                </p>
              </div>
            </div>

            {/* Mobile language & tools shortcut */}
            <div className="flex lg:hidden items-center gap-1">
              <button
                onClick={() => setLanguage(language === 'gu' ? 'en' : 'gu')}
                className="px-2 py-1 text-xs font-semibold rounded bg-stone-100 text-stone-700 border border-stone-200"
              >
                {language === 'gu' ? 'ENG' : 'ગુજ'}
              </button>
            </div>
          </div>

          {/* Month Selector & Controls */}
          <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2">
            
            {/* Month Navigator */}
            <div className="flex items-center bg-stone-100 rounded-lg p-1 border border-stone-200 shadow-2xs">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 hover:bg-white rounded text-stone-700 hover:text-stone-900 transition-colors"
                title="પાછલો મહિનો"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1.5 px-3 font-semibold text-xs sm:text-sm text-stone-800 min-w-[130px] justify-center">
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                <span>{getMonthName(currentMonth, language)}</span>
              </div>
              <button
                onClick={handleNextMonth}
                className="p-1.5 hover:bg-white rounded text-stone-700 hover:text-stone-900 transition-colors"
                title="આગલો મહિનો"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex items-center gap-1.5">
              {/* Voice / Quick Add */}
              <button
                onClick={onOpenVoiceModal}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-medium rounded-lg border border-amber-200 transition-colors shadow-2xs"
                title={t.quickAdd}
              >
                <Mic className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden sm:inline">{language === 'gu' ? 'બોલીને લખો' : 'Voice'}</span>
              </button>

              {/* Add Expense Button */}
              <button
                onClick={() => onOpenAddModal('expense')}
                className="flex items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.addExpense}</span>
              </button>

              {/* Add Income Button */}
              <button
                onClick={() => onOpenAddModal('income')}
                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.addIncome}</span>
              </button>
            </div>

            {/* Tools Dropdown / Buttons */}
            <div className="hidden lg:flex items-center gap-1 pl-2 border-l border-stone-200">
              {/* Digit toggle */}
              <button
                onClick={() => setUseGujDigits(!useGujDigits)}
                title={useGujDigits ? t.useEnglishNumerals : t.useGujaratiNumerals}
                className={`px-2 py-1 text-xs font-medium rounded border transition-colors ${
                  useGujDigits
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {useGujDigits ? '૧ ૨ ૩' : '1 2 3'}
              </button>

              {/* Language Switch */}
              <button
                onClick={() => setLanguage(language === 'gu' ? 'en' : 'gu')}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 transition-colors"
              >
                <Languages className="w-3.5 h-3.5 text-stone-500" />
                <span>{language === 'gu' ? 'English' : 'ગુજરાતી'}</span>
              </button>

              {/* Print Receipt / Ledger */}
              <button
                onClick={onPrint}
                title={t.exportReport}
                className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded border border-transparent hover:border-stone-200 transition-colors"
              >
                <Printer className="w-4 h-4" />
              </button>

              {/* CSV Export */}
              <button
                onClick={onExportCsv}
                title={t.exportCsv}
                className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded border border-transparent hover:border-stone-200 transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>

              {/* Backup */}
              <button
                onClick={onBackup}
                title={t.backupData}
                className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded border border-transparent hover:border-stone-200 transition-colors"
              >
                <Upload className="w-4 h-4" />
              </button>

              {/* Load sample data */}
              <button
                onClick={onLoadSample}
                title={t.loadSample}
                className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 rounded border border-amber-200"
              >
                <RotateCcw className="w-3 h-3 text-amber-700" />
                <span>{language === 'gu' ? 'નમૂનો' : 'Sample'}</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
