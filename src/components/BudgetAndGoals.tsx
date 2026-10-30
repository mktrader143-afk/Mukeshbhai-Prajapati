import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Target,
  Sparkles,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Coins,
  Shield,
  Heart,
  Edit2,
  Trash2,
  X,
} from 'lucide-react';
import { BudgetConfig, SavingsGoal, Language, Transaction } from '../types';
import { getTranslation } from '../translations';
import { formatCurrency } from '../utils/formatters';
import { EXPENSE_CATEGORIES } from '../constants/categories';

interface BudgetAndGoalsProps {
  budgetConfig: BudgetConfig;
  onUpdateBudget: (config: BudgetConfig) => void;
  savingsGoals: SavingsGoal[];
  onAddGoal: (goal: Omit<SavingsGoal, 'id' | 'isCompleted'>) => void;
  onAddSavingsToGoal: (goalId: string, amount: number) => void;
  onDeleteGoal: (goalId: string) => void;
  transactions: Transaction[];
  currentMonth: string;
  language: Language;
  useGujDigits: boolean;
}

export const BudgetAndGoals: React.FC<BudgetAndGoalsProps> = ({
  budgetConfig,
  onUpdateBudget,
  savingsGoals,
  onAddGoal,
  onAddSavingsToGoal,
  onDeleteGoal,
  transactions,
  currentMonth,
  language,
  useGujDigits,
}) => {
  const t = getTranslation(language);

  // Budget Edit state
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [monthlyLimitInput, setMonthlyLimitInput] = useState(budgetConfig.monthlyLimit.toString());

  // Add Goal Modal state
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalSaved, setGoalSaved] = useState('');
  const [goalDate, setGoalDate] = useState('2026-12-31');
  const [goalIcon, setGoalIcon] = useState('Sparkles');

  // Add Savings Modal
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [depositAmount, setDepositAmount] = useState('');

  // Calculate actual spending for current month
  const currentMonthExpenses = transactions.filter(
    (tx) => tx.type === 'expense' && tx.date.startsWith(currentMonth)
  );

  const totalSpent = currentMonthExpenses.reduce((sum, tx) => sum + tx.amount, 0);
  const monthlyLimit = budgetConfig.monthlyLimit || 0;
  const budgetPercent = monthlyLimit > 0 ? Math.min(100, Math.round((totalSpent / monthlyLimit) * 100)) : 0;
  const isBudgetExceeded = monthlyLimit > 0 && totalSpent > monthlyLimit;

  // Category-wise spending
  const categorySpending: Record<string, number> = {};
  currentMonthExpenses.forEach((tx) => {
    categorySpending[tx.categoryId] = (categorySpending[tx.categoryId] || 0) + tx.amount;
  });

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(monthlyLimitInput);
    if (!isNaN(parsed) && parsed >= 0) {
      onUpdateBudget({
        ...budgetConfig,
        monthlyLimit: parsed,
      });
      setIsEditingBudget(false);
    }
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(goalTarget);
    if (!goalTitle.trim() || isNaN(target) || target <= 0) return;

    onAddGoal({
      title: goalTitle.trim(),
      targetAmount: target,
      savedAmount: parseFloat(goalSaved) || 0,
      targetDate: goalDate,
      icon: goalIcon,
    });

    setGoalTitle('');
    setGoalTarget('');
    setGoalSaved('');
    setShowAddGoalModal(false);
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal) return;
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) return;

    const newTotal = selectedGoal.savedAmount + amount;
    if (newTotal >= selectedGoal.targetAmount) {
      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // fallback
      }
    }

    onAddSavingsToGoal(selectedGoal.id, amount);
    setDepositAmount('');
    setSelectedGoal(null);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Monthly Budget Section */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-700" />
              <span>{t.budgetTitle}</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">{t.budgetSubtitle}</p>
          </div>

          <button
            onClick={() => {
              setMonthlyLimitInput(budgetConfig.monthlyLimit.toString());
              setIsEditingBudget(!isEditingBudget);
            }}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-amber-300 text-amber-900 bg-amber-50 hover:bg-amber-100 transition-colors w-fit"
          >
            <Edit2 className="w-3.5 h-3.5 text-amber-700" />
            <span>{isEditingBudget ? t.cancelBtn : t.setBudget}</span>
          </button>
        </div>

        {/* Edit Budget Form */}
        {isEditingBudget && (
          <form onSubmit={handleSaveBudget} className="mb-4 p-4 bg-amber-50/50 rounded-xl border border-amber-200">
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              {t.monthlyBudgetLabel}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={monthlyLimitInput}
                onChange={(e) => setMonthlyLimitInput(e.target.value)}
                className="px-3 py-2 text-sm bg-white rounded-lg border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 max-w-xs font-bold"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg shadow-xs"
              >
                {t.saveBtn}
              </button>
            </div>
          </form>
        )}

        {/* Budget Progress Bar & Numbers */}
        <div className="space-y-3">
          <div className="flex items-baseline justify-between text-xs">
            <span className="text-stone-500 font-medium">
              {language === 'gu' ? 'કુલ ખર્ચાયેલ:' : 'Spent:'}{' '}
              <strong className="text-stone-900 text-sm">
                {formatCurrency(totalSpent, useGujDigits)}
              </strong>
            </span>
            <span className="text-stone-500 font-medium">
              {language === 'gu' ? 'મર્યાદા:' : 'Limit:'}{' '}
              <strong className="text-stone-900 text-sm">
                {formatCurrency(monthlyLimit, useGujDigits)}
              </strong>
            </span>
          </div>

          <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isBudgetExceeded
                  ? 'bg-rose-600'
                  : budgetPercent >= 80
                  ? 'bg-amber-500'
                  : 'bg-emerald-600'
              }`}
              style={{ width: `${budgetPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span
              className={`font-semibold flex items-center gap-1 ${
                isBudgetExceeded
                  ? 'text-rose-600'
                  : budgetPercent >= 80
                  ? 'text-amber-700'
                  : 'text-emerald-700'
              }`}
            >
              {isBudgetExceeded ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{t.budgetStatusDanger}</span>
                </>
              ) : budgetPercent >= 80 ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{t.budgetStatusWarning}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t.budgetStatusSafe}</span>
                </>
              )}
            </span>

            <span className="text-stone-500">
              {language === 'gu' ? 'બાકી સિલક:' : 'Remaining:'}{' '}
              <strong className="text-stone-800 font-bold">
                {formatCurrency(Math.max(0, monthlyLimit - totalSpent), useGujDigits)}
              </strong>
            </span>
          </div>
        </div>

        {/* Top categories breakdown against budgets */}
        <div className="mt-5 pt-4 border-t border-stone-100">
          <span className="text-xs font-semibold text-stone-700 block mb-3">
            {language === 'gu' ? 'મુખ્ય શ્રેણીવાર ખર્ચની સ્થિતિ:' : 'Key Categories Spending:'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {EXPENSE_CATEGORIES.slice(0, 6).map((cat) => {
              const spent = categorySpending[cat.id] || 0;
              const limit = budgetConfig.categoryLimits?.[cat.id] || 0;
              return (
                <div key={cat.id} className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/70 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-stone-800">
                      {language === 'gu' ? cat.nameGu : cat.nameEn}
                    </span>
                    <span className="font-bold text-stone-900">
                      {formatCurrency(spent, useGujDigits)}
                    </span>
                  </div>
                  {limit > 0 && (
                    <div className="text-[11px] text-stone-400">
                      {language === 'gu' ? 'મર્યાદા:' : 'Limit:'} {formatCurrency(limit, useGujDigits)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Family Savings Goals Section */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-700" />
              <span>{t.savingsGoals}</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {language === 'gu'
                ? 'સોનું, તહેવારો, યાત્રા કે અણધાર્યા ખર્ચ માટે અગાઉથી કરેલી બચત'
                : 'Save ahead for festivals, gold, travel or emergency fund'}
            </p>
          </div>

          <button
            onClick={() => setShowAddGoalModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addGoal}</span>
          </button>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {savingsGoals.map((goal) => {
            const isCompleted = goal.savedAmount >= goal.targetAmount;
            const pct = Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));

            return (
              <div
                key={goal.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-amber-50/70 border-amber-300'
                    : 'bg-white border-stone-200 hover:border-amber-300 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                        <Coins className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-sm text-stone-900">{goal.title}</h4>
                    </div>

                    <button
                      onClick={() => onDeleteGoal(goal.id)}
                      className="text-stone-300 hover:text-rose-600 p-1 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1.5 my-3">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="font-bold text-stone-900 text-base">
                        {formatCurrency(goal.savedAmount, useGujDigits)}
                      </span>
                      <span className="text-stone-500">
                        / {formatCurrency(goal.targetAmount, useGujDigits)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted ? 'bg-amber-500' : 'bg-emerald-600'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-500 pt-0.5">
                      <span>{pct}% {language === 'gu' ? 'પૂર્ણ' : 'Completed'}</span>
                      <span>{goal.targetDate}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  {isCompleted ? (
                    <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                      <span>{t.congratulations}</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedGoal(goal);
                        setDepositAmount('');
                      }}
                      className="w-full py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-200 transition-colors text-center"
                    >
                      + {t.addSavings}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Goal Modal */}
      {showAddGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="font-bold text-stone-900 text-base">{t.addGoal}</h3>
              <button
                onClick={() => setShowAddGoalModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t.goalTitle} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="દા.ત., દિવાળી ખરીદી, સોનાનો સિક્કો"
                  required
                  autoFocus
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t.targetAmount} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                    placeholder="25000"
                    required
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t.savedSoFar}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={goalSaved}
                    onChange={(e) => setGoalSaved(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {language === 'gu' ? 'લક્ષ્ય તારીખ' : 'Target Date'}
                </label>
                <input
                  type="date"
                  value={goalDate}
                  onChange={(e) => setGoalDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddGoalModal(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-xl shadow-xs"
                >
                  {t.saveBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deposit to Goal Modal */}
      {selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-stone-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="font-bold text-stone-900 text-sm">
                + {t.addSavings}: {selectedGoal.title}
              </h3>
              <button
                onClick={() => setSelectedGoal(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDeposit} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t.amount} (₹) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="500"
                  required
                  autoFocus
                  className="w-full px-3 py-2 text-lg font-bold bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex gap-1.5 flex-wrap">
                {[500, 1000, 2000, 5000].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setDepositAmount(v.toString())}
                    className="px-2.5 py-1 text-xs rounded bg-stone-100 hover:bg-amber-100 text-stone-700 font-medium"
                  >
                    +₹{v}
                  </button>
                ))}
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedGoal(null)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs"
                >
                  {language === 'gu' ? 'બચતમાં જમા કરો' : 'Deposit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
