import React, { useState } from 'react';
import { Banknote, RotateCcw, Copy, Check, Coins } from 'lucide-react';
import { CashDenominations, Language } from '../types';
import { getTranslation } from '../translations';
import { formatCurrency, toGujaratiDigits } from '../utils/formatters';

interface CashCounterProps {
  language: Language;
  useGujDigits: boolean;
}

export const CashCounter: React.FC<CashCounterProps> = ({ language, useGujDigits }) => {
  const t = getTranslation(language);

  const [counts, setCounts] = useState<CashDenominations>({
    n500: 0,
    n200: 0,
    n100: 0,
    n50: 0,
    n20: 0,
    n10: 0,
    coins: 0,
  });

  const [copied, setCopied] = useState(false);

  const denominations = [
    { key: 'n500' as const, value: 500, label: '₹ ૫૦૦', color: 'bg-stone-100 text-stone-800' },
    { key: 'n200' as const, value: 200, label: '₹ ૨૦૦', color: 'bg-amber-50 text-amber-900' },
    { key: 'n100' as const, value: 100, label: '₹ ૧૦૦', color: 'bg-purple-50 text-purple-900' },
    { key: 'n50' as const, value: 50, label: '₹ ૫૦', color: 'bg-cyan-50 text-cyan-900' },
    { key: 'n20' as const, value: 20, label: '₹ ૨૦', color: 'bg-orange-50 text-orange-900' },
    { key: 'n10' as const, value: 10, label: '₹ ૧૦', color: 'bg-amber-100 text-amber-950' },
    { key: 'coins' as const, value: 1, label: language === 'gu' ? 'સિક્કા' : 'Coins', color: 'bg-slate-100 text-slate-800' },
  ];

  const handleCountChange = (key: keyof CashDenominations, valStr: string) => {
    const val = parseInt(valStr, 10);
    setCounts((prev) => ({
      ...prev,
      [key]: isNaN(val) || val < 0 ? 0 : val,
    }));
  };

  const handleAdjust = (key: keyof CashDenominations, delta: number) => {
    setCounts((prev) => ({
      ...prev,
      [key]: Math.max(0, prev[key] + delta),
    }));
  };

  const resetAll = () => {
    setCounts({
      n500: 0,
      n200: 0,
      n100: 0,
      n50: 0,
      n20: 0,
      n10: 0,
      coins: 0,
    });
  };

  const grandTotal =
    counts.n500 * 500 +
    counts.n200 * 200 +
    counts.n100 * 100 +
    counts.n50 * 50 +
    counts.n20 * 20 +
    counts.n10 * 10 +
    counts.coins * 1;

  const totalNotesCount =
    counts.n500 + counts.n200 + counts.n100 + counts.n50 + counts.n20 + counts.n10;

  const handleCopyBreakdown = () => {
    const lines = [
      language === 'gu' ? '॥ રોકડ નોટ ગણતરી હિસાબ ॥' : 'Cash Denomination Breakdown',
      `₹500 x ${counts.n500} = ₹${counts.n500 * 500}`,
      `₹200 x ${counts.n200} = ₹${counts.n200 * 200}`,
      `₹100 x ${counts.n100} = ₹${counts.n100 * 100}`,
      `₹50 x ${counts.n50} = ₹${counts.n50 * 50}`,
      `₹20 x ${counts.n20} = ₹${counts.n20 * 20}`,
      `₹10 x ${counts.n10} = ₹${counts.n10 * 10}`,
      `${language === 'gu' ? 'સિક્કા' : 'Coins'} = ₹${counts.coins}`,
      '--------------------------',
      `${language === 'gu' ? 'કુલ રોકડ' : 'Total Cash'}: ₹${grandTotal}`,
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Top Total Display Card */}
      <div className="bg-linear-to-br from-stone-900 to-stone-800 text-white rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
              {t.totalCash}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-white">
              {formatCurrency(grandTotal, useGujDigits)}
            </h2>
            <p className="text-xs text-stone-300 mt-1">
              {language === 'gu'
                ? `કુલ નોટો: ${totalNotesCount} | સિક્કા: ₹${counts.coins}`
                : `Total Notes: ${totalNotesCount} | Coins: ₹${counts.coins}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyBreakdown}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-lg transition-colors shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (language === 'gu' ? 'કોપી થયું!' : 'Copied!') : t.copyCashTotal}</span>
            </button>

            <button
              onClick={resetAll}
              className="p-2 text-stone-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              title={t.clearCash}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Denominations List */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs divide-y divide-stone-100 overflow-hidden">
        {denominations.map((denom) => {
          const count = counts[denom.key];
          const subTotal = count * denom.value;

          return (
            <div
              key={denom.key}
              className="p-3.5 px-4 flex items-center justify-between gap-3 hover:bg-stone-50/70 transition-colors"
            >
              {/* Denomination badge */}
              <div className="flex items-center gap-3 min-w-[100px]">
                <div
                  className={`px-2.5 py-1 rounded-md font-bold text-xs sm:text-sm border border-stone-200 ${denom.color}`}
                >
                  {denom.label}
                </div>
                <span className="text-xs text-stone-400">×</span>
              </div>

              {/* Counter Input & Steppers */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAdjust(denom.key, -1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  value={count === 0 ? '' : count}
                  onChange={(e) => handleCountChange(denom.key, e.target.value)}
                  placeholder="0"
                  className="w-16 sm:w-20 px-2 py-1 text-center font-bold text-sm sm:text-base bg-stone-50 rounded-lg border border-stone-200 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => handleAdjust(denom.key, 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm"
                >
                  +
                </button>
              </div>

              {/* Subtotal */}
              <div className="text-right min-w-[90px]">
                <span className="font-bold text-sm sm:text-base text-stone-900 block">
                  {formatCurrency(subTotal, useGujDigits)}
                </span>
                <span className="text-[10px] text-stone-400">
                  {count} {language === 'gu' ? 'નોટ' : 'notes'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
