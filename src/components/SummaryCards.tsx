import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Target, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Language, BudgetConfig } from '../types';
import { getTranslation } from '../translations';
import { formatCurrency } from '../utils/formatters';

interface SummaryCardsProps {
  totalIncome: number;
  totalExpense: number;
  todayExpense: number;
  budgetConfig: BudgetConfig;
  language: Language;
  useGujDigits: boolean;
  onOpenBudgetModal: () => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalIncome,
  totalExpense,
  todayExpense,
  budgetConfig,
  language,
  useGujDigits,
  onOpenBudgetModal,
}) => {
  const t = getTranslation(language);
  const netBalance = totalIncome - totalExpense;
  const isSurplus = netBalance >= 0;

  const monthlyLimit = budgetConfig.monthlyLimit || 0;
  const budgetRemaining = Math.max(0, monthlyLimit - totalExpense);
  const budgetPercent = monthlyLimit > 0 ? Math.min(100, Math.round((totalExpense / monthlyLimit) * 100)) : 0;
  const isBudgetExceeded = monthlyLimit > 0 && totalExpense > monthlyLimit;
  const isBudgetNear = monthlyLimit > 0 && !isBudgetExceeded && budgetPercent >= 80;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      
      {/* 1. Net Balance / Current Savings */}
      <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-2xs hover:border-stone-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            {t.netSavings}
          </span>
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isSurplus ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}
          >
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span
            className={`text-2xl font-bold tracking-tight ${
              isSurplus ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {formatCurrency(netBalance, useGujDigits)}
          </span>
        </div>
        <div className="mt-2 text-[11px] text-stone-500 flex items-center gap-1.5">
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              isSurplus ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
          />
          <span>
            {isSurplus
              ? language === 'gu'
                ? 'આવકમાંથી ખર્ચ બાદ ચોખ્ખી સિલક'
                : 'Net positive savings this month'
              : language === 'gu'
              ? 'ખર્ચ આવક કરતાં વધુ છે (ખાધ)'
              : 'Deficit: expenses exceed income'}
          </span>
        </div>
      </div>

      {/* 2. Total Income (Credit) */}
      <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-2xs hover:border-stone-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            {t.totalIncome}
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-stone-900 tracking-tight">
            {formatCurrency(totalIncome, useGujDigits)}
          </span>
        </div>
        <div className="mt-2 text-[11px] text-stone-500 flex items-center gap-1">
          <span>{language === 'gu' ? 'પગાર, ભાડું અને અન્ય જમા રકમ' : 'Salary, rent & other receipts'}</span>
        </div>
      </div>

      {/* 3. Total Expense (Debit) & Today's spend */}
      <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-2xs hover:border-stone-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            {t.totalExpense}
          </span>
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-rose-700 tracking-tight">
            {formatCurrency(totalExpense, useGujDigits)}
          </span>
        </div>
        <div className="mt-2 text-[11px] text-stone-600 flex items-center justify-between pt-1 border-t border-stone-100">
          <span className="text-stone-500">{t.todayExpense}:</span>
          <span className="font-semibold text-rose-600">
            {formatCurrency(todayExpense, useGujDigits)}
          </span>
        </div>
      </div>

      {/* 4. Monthly Budget Status */}
      <div
        onClick={onOpenBudgetModal}
        className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-2xs hover:border-amber-300 cursor-pointer transition-all group"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-amber-700" />
            <span>{language === 'gu' ? 'બજેટ લક્ષ્ય' : 'Budget Target'}</span>
          </span>
          <span className="text-[11px] font-medium text-amber-800 group-hover:underline">
            {language === 'gu' ? 'સેટ કરો ✎' : 'Edit ✎'}
          </span>
        </div>

        {monthlyLimit > 0 ? (
          <>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-stone-900">
                {budgetPercent}%
              </span>
              <span className="text-xs font-medium text-stone-500">
                {language === 'gu' ? 'બાકી:' : 'Left:'} {formatCurrency(budgetRemaining, useGujDigits)}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-stone-100 h-2 rounded-full mt-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isBudgetExceeded
                    ? 'bg-rose-600'
                    : isBudgetNear
                    ? 'bg-amber-500'
                    : 'bg-emerald-600'
                }`}
                style={{ width: `${budgetPercent}%` }}
              />
            </div>

            <div className="mt-2 text-[11px] flex items-center gap-1">
              {isBudgetExceeded ? (
                <span className="text-rose-600 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  {language === 'gu' ? 'બજેટ વટાવી ગયું!' : 'Budget exceeded!'}
                </span>
              ) : isBudgetNear ? (
                <span className="text-amber-700 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  {language === 'gu' ? '૮૦% બજેટ વપરાયું' : '80% budget used'}
                </span>
              ) : (
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  {language === 'gu' ? 'ખર્ચ નિયંત્રણમાં છે' : 'Under budget limit'}
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="py-2 text-stone-400 text-xs">
            {language === 'gu' ? '+ માસિક ખર્ચ બજેટ સેટ કરો' : '+ Set monthly budget'}
          </div>
        )}
      </div>

    </div>
  );
};
