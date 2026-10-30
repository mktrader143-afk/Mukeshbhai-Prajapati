import React, { useState, useEffect } from 'react';
import { X, Check, Calendar, Tag, FileText, CreditCard, PlusCircle } from 'lucide-react';
import { Transaction, TransactionType, PaymentMode, Language } from '../types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories';
import { CategoryIcon } from './CategoryIcon';
import { getTranslation } from '../translations';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: Omit<Transaction, 'id' | 'createdAt'>, existingId?: string) => void;
  editTransaction?: Transaction | null;
  initialType?: TransactionType;
  language: Language;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editTransaction,
  initialType = 'expense',
  language,
}) => {
  const t = getTranslation(language);

  const [type, setType] = useState<TransactionType>(initialType);
  const [amount, setAmount] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('food_dining');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('cash');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (editTransaction) {
      setType(editTransaction.type);
      setAmount(editTransaction.amount.toString());
      setCategoryId(editTransaction.categoryId);
      setDate(editTransaction.date);
      setDescription(editTransaction.description || '');
      setNotes(editTransaction.notes || '');
      setPaymentMode(editTransaction.paymentMode || 'cash');
    } else {
      setType(initialType);
      setAmount('');
      setCategoryId(initialType === 'expense' ? 'food_dining' : 'salary');
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      setNotes('');
      setPaymentMode('cash');
    }
    setError('');
  }, [editTransaction, initialType, isOpen]);

  if (!isOpen) return null;

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError(
        language === 'gu'
          ? 'કૃપા કરીને માન્ય રકમ દાખલ કરો (૦ કરતાં વધુ).'
          : 'Please enter a valid amount greater than 0.'
      );
      return;
    }

    onSave(
      {
        type,
        amount: numAmount,
        categoryId,
        date,
        description: description.trim(),
        notes: notes.trim(),
        paymentMode,
      },
      editTransaction?.id
    );

    onClose();
  };

  const addQuickAmount = (val: number) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + val).toString());
    setError('');
  };

  // Quick description suggestions based on selected category
  const getSuggestions = () => {
    if (categoryId === 'food_dining') {
      return ['બપોરનું જમવાનું / થાળી', 'સવારની ચા-નાસ્તો', 'સાંજનું ડિનર', 'ફાફડા-જલેબી'];
    }
    if (categoryId === 'transport') {
      return ['રીક્ષા / ઓટો ભાડું', 'પેટ્રોલ પુરાવ્યું', 'બસ / ટ્રેન ટિકિટ', 'કેબ (Uber/Ola)'];
    }
    if (categoryId === 'entertainment') {
      return ['સિનેમા મુવી ટિકિટ', 'પોપકોર્ન / સ્નેક્સ', 'પિકનિક / ગાર્ડન એન્ટ્રી', 'ઓટીટી સબ્સ્ક્રિપ્શન'];
    }
    if (categoryId === 'groceries') {
      return ['કરિયાણાની ખરીદી', 'ઘઉંનો લોટ', 'તેલ અને મસાલા', 'ડી-માર્ટ રાશન'];
    }
    return [];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-xl overflow-hidden my-auto animate-in fade-in duration-200">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900">
              {editTransaction
                ? t.modalEditTitle
                : type === 'expense'
                ? language === 'gu'
                  ? 'વ્યક્તિગત ખર્ચ નોંધો'
                  : 'Add Personal Expense'
                : language === 'gu'
                ? 'આવક નોંધો'
                : 'Add Income'}
            </h2>
            <p className="text-xs text-stone-500">
              {language === 'gu'
                ? 'રકમ, તારીખ, શ્રેણી અને વૈકલ્પિક નોંધ દાખલ કરો'
                : 'Enter amount, date, category and optional note'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Expense vs Income Type Switcher */}
          {!editTransaction && (
            <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setType('expense');
                  setCategoryId('food_dining');
                }}
                className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  type === 'expense'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                - {t.addExpense}
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('income');
                  setCategoryId('salary');
                }}
                className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  type === 'income'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                + {t.addIncome}
              </button>
            </div>
          )}

          {/* 1. Amount Field (રકમ) */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              {t.amount} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 font-bold text-base">
                ₹
              </span>
              <input
                type="number"
                step="any"
                min="0"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                placeholder="0.00"
                autoFocus
                className="w-full pl-8 pr-4 py-2.5 text-xl font-bold bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white text-stone-900 transition-all"
              />
            </div>

            {/* Quick amount addition buttons */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className="text-[11px] text-stone-400 mr-1">
                {language === 'gu' ? 'ઝડપી ઉમેરો:' : 'Quick:'}
              </span>
              {[50, 100, 200, 500, 1000, 2000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => addQuickAmount(val)}
                  className="px-2 py-0.5 text-xs font-medium bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 rounded-md transition-colors"
                >
                  +{val}
                </button>
              ))}
            </div>

            {error && <p className="text-xs text-rose-600 mt-1.5 font-medium">{error}</p>}
          </div>

          {/* 2. Date Field (તારીખ) */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-stone-500" />
              <span>{t.date} <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white text-stone-800 font-medium"
            />
          </div>

          {/* 3. Category Field (શ્રેણી - દા.ત., ભોજન, પરિવહન, મનોરંજન) */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-stone-500" />
              <span>{t.category} (શ્રેણી) <span className="text-rose-500">*</span></span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 border border-stone-200 rounded-xl bg-stone-50/50">
              {categories.map((cat) => {
                const isSelected = categoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg text-left transition-all text-xs font-medium border ${
                      isSelected
                        ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-2xs font-semibold'
                        : 'bg-white border-stone-200/80 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-amber-600 text-white' : cat.bgLight
                      }`}
                    >
                      <CategoryIcon name={cat.iconName} className="w-3.5 h-3.5" />
                    </div>
                    <span className="truncate">
                      {language === 'gu' ? cat.nameGu : cat.nameEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Description / Item Title (વિગત / શીર્ષક) */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-stone-500" />
              <span>
                {language === 'gu' ? 'ખર્ચની વિગત / શીર્ષક' : 'Expense Title / Description'}
              </span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                categoryId === 'food_dining'
                  ? language === 'gu' ? 'દા.ત., બપોરનું ભોજન / નાસ્તો' : 'e.g., Lunch / Dinner'
                  : categoryId === 'transport'
                  ? language === 'gu' ? 'દા.ત., રીક્ષા ભાડું / પેટ્રોલ' : 'e.g., Auto fare / Fuel'
                  : categoryId === 'entertainment'
                  ? language === 'gu' ? 'દા.ત., સિનેમા મુવી ટિકિટ' : 'e.g., Movie tickets'
                  : language === 'gu' ? 'દા.ત., ખરીદી, કરિયાણું' : 'e.g., Details'
              }
              className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white text-stone-800"
            />

            {/* Quick suggested chips */}
            {getSuggestions().length > 0 && (
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                {getSuggestions().map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setDescription(sug)}
                    className="text-[11px] px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 5. Optional Note (વૈકલ્પિક નોંધ) */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              {language === 'gu' ? 'વૈકલ્પિક નોંધ (Optional Note)' : 'Optional Note'}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                language === 'gu'
                  ? 'ખાસ વિગત, સ્થળ, કે દુકાનદારની નોંધ લખો (વૈકલ્પિક)...'
                  : 'Add any specific notes, bill info or reminders (optional)...'
              }
              className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white text-stone-800 resize-none"
            />
          </div>

          {/* 6. Payment Mode (ચૂકવણીનો પ્રકાર) */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-stone-500" />
              <span>{t.paymentMode}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'cash' as const, labelGu: 'રોકડ (Cash)', labelEn: 'Cash' },
                { id: 'upi' as const, labelGu: 'UPI / GPay', labelEn: 'UPI' },
                { id: 'bank' as const, labelGu: 'બેંક / ચેક', labelEn: 'Bank' },
                { id: 'card' as const, labelGu: 'કાર્ડ (Card)', labelEn: 'Card' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMode(m.id)}
                  className={`py-1.5 px-2 text-xs font-medium rounded-lg border text-center transition-all ${
                    paymentMode === m.id
                      ? 'bg-amber-50 border-amber-500 text-amber-900 font-semibold'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {language === 'gu' ? m.labelGu : m.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium rounded-xl text-stone-600 hover:bg-stone-100 transition-colors"
            >
              {t.cancelBtn}
            </button>
            <button
              type="submit"
              className={`flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl text-white shadow-xs transition-colors ${
                type === 'expense'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-emerald-700 hover:bg-emerald-800'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{t.saveBtn}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
