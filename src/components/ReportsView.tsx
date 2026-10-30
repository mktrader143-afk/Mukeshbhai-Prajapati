import React, { useMemo } from 'react';
import { Printer, Download, BarChart2, PieChart, Calendar, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Transaction, MilkRecord, MilkSettings, Language } from '../types';
import { getTranslation } from '../translations';
import { formatCurrency, formatDateGujarati, getMonthName } from '../utils/formatters';
import { getCategoryById, EXPENSE_CATEGORIES } from '../constants/categories';
import { CategoryIcon } from './CategoryIcon';

interface ReportsViewProps {
  transactions: Transaction[];
  milkRecords: MilkRecord[];
  milkSettings: MilkSettings;
  currentMonth: string;
  householdName: string;
  language: Language;
  useGujDigits: boolean;
  onPrint: () => void;
  onExportCsv: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  transactions,
  milkRecords,
  milkSettings,
  currentMonth,
  householdName,
  language,
  useGujDigits,
  onPrint,
  onExportCsv,
}) => {
  const t = getTranslation(language);

  // Month transactions
  const monthTransactions = useMemo(() => {
    return transactions.filter((t) => t.date.startsWith(currentMonth));
  }, [transactions, currentMonth]);

  const totalIncome = useMemo(() => {
    return monthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [monthTransactions]);

  const totalExpense = useMemo(() => {
    return monthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [monthTransactions]);

  const netBalance = totalIncome - totalExpense;

  // Category breakdown for expenses
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    monthTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        stats[t.categoryId] = (stats[t.categoryId] || 0) + t.amount;
      });

    return Object.entries(stats)
      .map(([catId, amount]) => {
        const cat = getCategoryById(catId);
        const percent = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
        return {
          catId,
          cat,
          amount,
          percent,
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [monthTransactions, totalExpense]);

  // Payment method breakdown
  const paymentStats = useMemo(() => {
    const stats: Record<string, number> = {
      cash: 0,
      upi: 0,
      bank: 0,
      card: 0,
    };
    monthTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        stats[t.paymentMode] = (stats[t.paymentMode] || 0) + t.amount;
      });
    return stats;
  }, [monthTransactions]);

  // Daily histogram
  const dailySpending = useMemo(() => {
    const days: Record<string, number> = {};
    monthTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const day = t.date.split('-')[2];
        days[day] = (days[day] || 0) + t.amount;
      });

    const maxDayVal = Math.max(...Object.values(days), 1);
    return { days, maxDayVal };
  }, [monthTransactions]);

  return (
    <div className="space-y-6">
      
      {/* Action Bar (Print / CSV) */}
      <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div>
          <h3 className="font-bold text-stone-900 text-sm sm:text-base">
            {language === 'gu' ? 'માસિક હિસાબ અહેવાલ અને સ્ટેટમેન્ટ' : 'Monthly Statement & Analytics'}
          </h3>
          <p className="text-xs text-stone-500">
            {getMonthName(currentMonth, language)} - {householdName}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.exportReport}</span>
          </button>
          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.exportCsv}</span>
          </button>
        </div>
      </div>

      {/* Printable Statement Card */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs print-card">
        
        {/* Printable Letterhead Header */}
        <div className="text-center pb-4 border-b border-stone-200 mb-6">
          <span className="text-[11px] font-semibold tracking-widest text-amber-800 uppercase block">
            ॥ શ્રી ગણેશાય નમઃ ॥
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mt-1">
            {householdName} - {t.appTitle}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {language === 'gu' ? 'માસિક આવક-જાવક અને સિલક પત્રક' : 'Monthly Income-Expense Statement'} :{' '}
            <strong className="text-stone-700">{getMonthName(currentMonth, language)}</strong>
          </p>
        </div>

        {/* Financial Highlights */}
        <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-stone-50 rounded-xl border border-stone-200 text-center">
          <div>
            <span className="text-[11px] font-semibold text-emerald-800 uppercase block">
              {t.totalIncome}
            </span>
            <span className="text-base sm:text-xl font-bold text-emerald-700">
              +{formatCurrency(totalIncome, useGujDigits)}
            </span>
          </div>
          <div className="border-x border-stone-200">
            <span className="text-[11px] font-semibold text-rose-700 uppercase block">
              {t.totalExpense}
            </span>
            <span className="text-base sm:text-xl font-bold text-rose-700">
              -{formatCurrency(totalExpense, useGujDigits)}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-stone-600 uppercase block">
              {t.netSavings}
            </span>
            <span
              className={`text-base sm:text-xl font-bold ${
                netBalance >= 0 ? 'text-stone-900' : 'text-rose-600'
              }`}
            >
              {formatCurrency(netBalance, useGujDigits)}
            </span>
          </div>
        </div>

        {/* Visual Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          
          {/* Top Spending Categories */}
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-stone-800 mb-3 flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-amber-700" />
              <span>{language === 'gu' ? 'મુખ્ય ખર્ચ શ્રેણીઓ:' : 'Top Expense Categories:'}</span>
            </h4>

            {categoryStats.length === 0 ? (
              <p className="text-xs text-stone-400 italic">{t.noTransactions}</p>
            ) : (
              <div className="space-y-2.5">
                {categoryStats.slice(0, 8).map((item) => (
                  <div key={item.catId} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-stone-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                        {language === 'gu' ? item.cat.nameGu : item.cat.nameEn}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-stone-400 text-[11px]">{item.percent}%</span>
                        <span className="font-bold text-stone-900">
                          {formatCurrency(item.amount, useGujDigits)}
                        </span>
                      </div>
                    </div>
                    {/* Bar */}
                    <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-600 h-full rounded-full"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Mode Distribution */}
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-stone-800 mb-3 flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-amber-700" />
              <span>{language === 'gu' ? 'ચૂકવણીના માધ્યમ અનુસાર ખર્ચ:' : 'Payment Mode Breakdown:'}</span>
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[11px] text-stone-500 block">
                  {language === 'gu' ? 'રોકડ (Cash)' : 'Cash'}
                </span>
                <span className="text-sm sm:text-base font-bold text-stone-900">
                  {formatCurrency(paymentStats.cash, useGujDigits)}
                </span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[11px] text-stone-500 block">
                  UPI / GPay
                </span>
                <span className="text-sm sm:text-base font-bold text-stone-900">
                  {formatCurrency(paymentStats.upi, useGujDigits)}
                </span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[11px] text-stone-500 block">
                  {language === 'gu' ? 'બેંક / ચેક' : 'Bank Transfer'}
                </span>
                <span className="text-sm sm:text-base font-bold text-stone-900">
                  {formatCurrency(paymentStats.bank, useGujDigits)}
                </span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[11px] text-stone-500 block">
                  {language === 'gu' ? 'ડેબિટ/ક્રેડિટ કાર્ડ' : 'Cards'}
                </span>
                <span className="text-sm sm:text-base font-bold text-stone-900">
                  {formatCurrency(paymentStats.card, useGujDigits)}
                </span>
              </div>
            </div>

            {/* Daily spending mini-chart */}
            <div className="mt-4 pt-3 border-t border-stone-100">
              <span className="text-[11px] font-semibold text-stone-500 block mb-2">
                {language === 'gu' ? 'તારીખવાર ખર્ચ વલણ (Daily Activity):' : 'Daily Spending Histogram:'}
              </span>
              <div className="flex items-end gap-1 h-16 w-full pt-2">
                {Array.from({ length: 30 }).map((_, i) => {
                  const dayStr = (i + 1).toString().padStart(2, '0');
                  const amt = dailySpending.days[dayStr] || 0;
                  const heightPercent = amt > 0 ? Math.max(10, Math.round((amt / dailySpending.maxDayVal) * 100)) : 4;

                  return (
                    <div
                      key={dayStr}
                      className="flex-1 flex flex-col items-center group relative"
                      title={`${dayStr} તારીખ: ₹${amt}`}
                    >
                      <div
                        className={`w-full rounded-t-xs transition-all ${
                          amt > 0 ? 'bg-amber-600 hover:bg-amber-700' : 'bg-stone-100'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>૧ તારીખ</span>
                <span>૧૫ તારીખ</span>
                <span>૩૦ તારીખ</span>
              </div>
            </div>
          </div>

        </div>

        {/* Itemized Table for Print/PDF */}
        <div className="mt-6 pt-4 border-t border-stone-200">
          <h4 className="font-bold text-xs sm:text-sm text-stone-800 mb-2">
            {language === 'gu' ? 'તમામ એન્ટ્રીઓની યાદી (રોજમેળ પત્રક):' : 'Complete Ledger Entries:'}
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-stone-200">
              <thead className="bg-stone-100 text-stone-700 font-semibold border-b border-stone-200">
                <tr>
                  <th className="p-2 border-r border-stone-200">{t.date}</th>
                  <th className="p-2 border-r border-stone-200">{t.category}</th>
                  <th className="p-2 border-r border-stone-200">{t.description}</th>
                  <th className="p-2 border-r border-stone-200">{t.paymentMode}</th>
                  <th className="p-2 text-right">{t.amount}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {monthTransactions.map((tx) => {
                  const cat = getCategoryById(tx.categoryId);
                  return (
                    <tr key={tx.id} className="hover:bg-stone-50">
                      <td className="p-2 border-r border-stone-100 whitespace-nowrap">{tx.date}</td>
                      <td className="p-2 border-r border-stone-100">
                        {language === 'gu' ? cat.nameGu : cat.nameEn}
                      </td>
                      <td className="p-2 border-r border-stone-100">
                        {tx.description}
                        {tx.notes && <span className="text-stone-400 block text-[10px]">{tx.notes}</span>}
                      </td>
                      <td className="p-2 border-r border-stone-100 uppercase text-[11px]">
                        {tx.paymentMode}
                      </td>
                      <td
                        className={`p-2 text-right font-bold whitespace-nowrap ${
                          tx.type === 'income' ? 'text-emerald-700' : 'text-stone-900'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : '-'}
                        {formatCurrency(tx.amount, useGujDigits)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Print Footer / Signature Area */}
        <div className="mt-8 pt-4 border-t border-stone-200 flex justify-between text-xs text-stone-500">
          <div>
            <p>{language === 'gu' ? 'તૈયાર કરનાર: ઘરના મુખિયા' : 'Prepared By: Head of Household'}</p>
          </div>
          <div className="text-right">
            <p>{language === 'gu' ? 'તારીખ અને સહી: ________________' : 'Date & Signature: ________________'}</p>
          </div>
        </div>

      </div>

    </div>
  );
};
