import React, { useState, useMemo } from 'react';
import {
  Droplet,
  Check,
  X,
  Share2,
  Settings,
  Calendar,
  AlertCircle,
  Plus,
  Minus,
  CheckCircle2,
} from 'lucide-react';
import { MilkRecord, MilkSettings, Language } from '../types';
import { getTranslation } from '../translations';
import { formatCurrency, formatDateGujarati, generateMilkWhatsAppMessage } from '../utils/formatters';

interface MilkDiaryProps {
  currentMonth: string; // YYYY-MM
  records: MilkRecord[];
  settings: MilkSettings;
  onUpdateRecord: (record: MilkRecord) => void;
  onUpdateSettings: (settings: MilkSettings) => void;
  language: Language;
  useGujDigits: boolean;
}

export const MilkDiary: React.FC<MilkDiaryProps> = ({
  currentMonth,
  records,
  settings,
  onUpdateRecord,
  onUpdateSettings,
  language,
  useGujDigits,
}) => {
  const t = getTranslation(language);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [tempSettings, setTempSettings] = useState<MilkSettings>(settings);

  // Filter records for this month
  const monthRecords = useMemo(() => {
    return records.filter((r) => r.date.startsWith(currentMonth));
  }, [records, currentMonth]);

  // Aggregate stats
  const stats = useMemo(() => {
    let totalMorning = 0;
    let totalEvening = 0;
    let totalLiters = 0;
    let totalCost = 0;
    let skippedDays = 0;
    let deliveredDays = 0;

    monthRecords.forEach((r) => {
      if (r.isSkipped) {
        skippedDays++;
      } else {
        deliveredDays++;
        const m = r.morningLiters || 0;
        const e = r.eveningLiters || 0;
        const dayLiters = m + e;
        totalMorning += m;
        totalEvening += e;
        totalLiters += dayLiters;
        totalCost += dayLiters * (r.ratePerLiter || settings.defaultRate);
      }
    });

    return {
      totalMorning,
      totalEvening,
      totalLiters,
      totalCost: Math.round(totalCost),
      skippedDays,
      deliveredDays,
    };
  }, [monthRecords, settings.defaultRate]);

  const isMonthPaid = !!settings.monthPaidStatus?.[currentMonth];

  const handleTogglePaid = () => {
    const updated = {
      ...settings,
      monthPaidStatus: {
        ...(settings.monthPaidStatus || {}),
        [currentMonth]: !isMonthPaid,
      },
    };
    onUpdateSettings(updated);
  };

  const handleToggleSkip = (record: MilkRecord) => {
    const updated: MilkRecord = {
      ...record,
      isSkipped: !record.isSkipped,
      morningLiters: !record.isSkipped ? 0 : settings.defaultMorningLiters,
      eveningLiters: !record.isSkipped ? 0 : settings.defaultEveningLiters,
    };
    onUpdateRecord(updated);
  };

  const handleAdjustQuantity = (record: MilkRecord, time: 'morning' | 'evening', delta: number) => {
    if (record.isSkipped) return;
    const current = time === 'morning' ? record.morningLiters : record.eveningLiters;
    const nextVal = Math.max(0, parseFloat((current + delta).toFixed(1)));
    const updated: MilkRecord = {
      ...record,
      [time === 'morning' ? 'morningLiters' : 'eveningLiters']: nextVal,
    };
    onUpdateRecord(updated);
  };

  const handleWhatsAppShare = () => {
    const msg = generateMilkWhatsAppMessage(currentMonth, monthRecords, settings, language);
    const phone = (settings.milkmanPhone || '').replace(/\D/g, '');
    const url = phone
      ? `https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(tempSettings);
    setShowSettingsModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Overview Card */}
      <div className="bg-linear-to-r from-sky-900 to-indigo-950 text-white rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-sky-200 font-semibold">
                {t.milkTitle}
              </span>
              <span className="text-sky-300/40">·</span>
              <span className="text-xs text-sky-100 font-medium">
                {settings.milkBrand || 'અમૂલ ગોલ્ડ'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
              {formatCurrency(stats.totalCost, useGujDigits)}
            </h2>
            <p className="text-xs text-sky-200 mt-1">
              {language === 'gu'
                ? `કુલ ${stats.totalLiters.toFixed(1)} લિટર દૂધ (ભાવ: ₹${settings.defaultRate}/લિટર)`
                : `Total ${stats.totalLiters.toFixed(1)} Liters (Rate: ₹${settings.defaultRate}/L)`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Paid status button */}
            <button
              onClick={handleTogglePaid}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                isMonthPaid
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-white/10 hover:bg-white/20 text-sky-100 border border-white/20'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isMonthPaid ? t.monthPaid : t.monthPending}</span>
            </button>

            {/* WhatsApp Share Button */}
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-xs"
              title={t.shareWhatsApp}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{language === 'gu' ? 'WhatsApp બિલ' : 'WhatsApp'}</span>
            </button>

            {/* Settings button */}
            <button
              onClick={() => {
                setTempSettings(settings);
                setShowSettingsModal(true);
              }}
              className="p-2 text-sky-200 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20"
              title={t.milkSettings}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Breakdown bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 pt-4 border-t border-sky-800/60 text-xs text-sky-100">
          <div>
            <span className="text-sky-300 block text-[11px]">{t.morningMilk}</span>
            <span className="font-bold text-sm">{stats.totalMorning.toFixed(1)} L</span>
          </div>
          <div>
            <span className="text-sky-300 block text-[11px]">{t.eveningMilk}</span>
            <span className="font-bold text-sm">{stats.totalEvening.toFixed(1)} L</span>
          </div>
          <div>
            <span className="text-sky-300 block text-[11px]">{language === 'gu' ? 'લીધેલ દિવસો' : 'Delivered'}</span>
            <span className="font-bold text-sm">{stats.deliveredDays} {language === 'gu' ? 'દિવસ' : 'Days'}</span>
          </div>
          <div>
            <span className="text-sky-300 block text-[11px]">{language === 'gu' ? 'દૂધ બંધ (રજા)' : 'Skipped'}</span>
            <span className="font-bold text-sm text-amber-300">{stats.skippedDays} {language === 'gu' ? 'દિવસ' : 'Days'}</span>
          </div>
        </div>
      </div>

      {/* Milkman details card */}
      <div className="bg-white rounded-xl p-3 border border-stone-200/80 shadow-2xs flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
            🥛
          </div>
          <div>
            <span className="font-semibold text-stone-900">{settings.milkmanName || 'દૂધવાળા ભાઈ'}</span>
            <span className="text-stone-400 mx-1">·</span>
            <span className="text-stone-500">{settings.milkBrand}</span>
            {settings.milkmanPhone && (
              <>
                <span className="text-stone-400 mx-1">·</span>
                <span className="text-stone-600 font-mono">📱 {settings.milkmanPhone}</span>
              </>
            )}
          </div>
        </div>
        <button
          onClick={() => {
            setTempSettings(settings);
            setShowSettingsModal(true);
          }}
          className="text-sky-700 hover:underline font-medium"
        >
          {language === 'gu' ? 'ભાવ બદલો ✎' : 'Edit Rate ✎'}
        </button>
      </div>

      {/* Daily Records List */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="bg-stone-50 px-4 py-3 border-b border-stone-200 flex items-center justify-between">
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wide">
            {language === 'gu' ? 'તારીખવાર દૂધ નોંધણી' : 'Daily Milk Log'}
          </span>
          <span className="text-[11px] text-stone-500">
            {language === 'gu'
              ? '+/- થી લિટર વધારો/ઘટાડો, રજા હોય તો "બંધ" ક્લિક કરો'
              : 'Adjust liters with +/- or toggle skip if no delivery'}
          </span>
        </div>

        <div className="divide-y divide-stone-100 max-h-[600px] overflow-y-auto">
          {monthRecords.map((r) => {
            const dayLiters = r.isSkipped ? 0 : (r.morningLiters || 0) + (r.eveningLiters || 0);
            const dayCost = dayLiters * (r.ratePerLiter || settings.defaultRate);

            return (
              <div
                key={r.date}
                className={`p-3 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                  r.isSkipped ? 'bg-stone-50/60 opacity-75' : 'hover:bg-sky-50/30'
                }`}
              >
                {/* Date & Status */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${
                      r.isSkipped
                        ? 'bg-stone-200 text-stone-500'
                        : 'bg-sky-50 text-sky-700 border border-sky-200'
                    }`}
                  >
                    {r.date.split('-')[2]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-semibold text-stone-900">
                        {formatDateGujarati(r.date, language, useGujDigits)}
                      </span>
                      {r.isSkipped && (
                        <span className="text-[11px] font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                          {language === 'gu' ? 'દૂધ બંધ (રજા)' : 'Skipped'}
                        </span>
                      )}
                    </div>
                    {r.notes && (
                      <p className="text-[11px] text-stone-500 italic mt-0.5">{r.notes}</p>
                    )}
                  </div>
                </div>

                {/* Liters Controls & Amount */}
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                  
                  {/* Morning & Evening adjust */}
                  {!r.isSkipped ? (
                    <div className="flex items-center gap-3 text-xs">
                      {/* Morning */}
                      <div className="flex items-center gap-1.5 bg-stone-100 rounded-lg p-1 border border-stone-200">
                        <span className="text-[11px] text-stone-500 pl-1">{language === 'gu' ? 'સવારે:' : 'M:'}</span>
                        <button
                          onClick={() => handleAdjustQuantity(r, 'morning', -0.5)}
                          className="w-5 h-5 flex items-center justify-center rounded bg-white hover:bg-stone-200 text-stone-700 font-bold"
                        >
                          -
                        </button>
                        <span className="font-bold w-7 text-center">{r.morningLiters}L</span>
                        <button
                          onClick={() => handleAdjustQuantity(r, 'morning', 0.5)}
                          className="w-5 h-5 flex items-center justify-center rounded bg-white hover:bg-stone-200 text-stone-700 font-bold"
                        >
                          +
                        </button>
                      </div>

                      {/* Evening */}
                      <div className="flex items-center gap-1.5 bg-stone-100 rounded-lg p-1 border border-stone-200">
                        <span className="text-[11px] text-stone-500 pl-1">{language === 'gu' ? 'સાંજે:' : 'E:'}</span>
                        <button
                          onClick={() => handleAdjustQuantity(r, 'evening', -0.5)}
                          className="w-5 h-5 flex items-center justify-center rounded bg-white hover:bg-stone-200 text-stone-700 font-bold"
                        >
                          -
                        </button>
                        <span className="font-bold w-7 text-center">{r.eveningLiters}L</span>
                        <button
                          onClick={() => handleAdjustQuantity(r, 'evening', 0.5)}
                          className="w-5 h-5 flex items-center justify-center rounded bg-white hover:bg-stone-200 text-stone-700 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-stone-400 italic">
                      {language === 'gu' ? 'આ દિવસે દૂધ નથી લીધું' : 'No milk taken'}
                    </span>
                  )}

                  {/* Day total amount */}
                  <div className="text-right min-w-[70px]">
                    <span className="font-bold text-xs sm:text-sm text-stone-900 block">
                      {formatCurrency(dayCost, useGujDigits)}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {dayLiters} L
                    </span>
                  </div>

                  {/* Skip toggle button */}
                  <button
                    onClick={() => handleToggleSkip(r)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors shrink-0 ${
                      r.isSkipped
                        ? 'bg-sky-50 text-sky-700 border-sky-300 hover:bg-sky-100'
                        : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-rose-50 hover:text-rose-700'
                    }`}
                  >
                    {r.isSkipped
                      ? language === 'gu' ? 'ચાલુ કરો' : 'Resume'
                      : language === 'gu' ? 'રજા' : 'Skip'}
                  </button>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="font-bold text-stone-900 text-base">{t.milkSettings}</h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t.milkmanName}
                </label>
                <input
                  type="text"
                  value={tempSettings.milkmanName}
                  onChange={(e) => setTempSettings({ ...tempSettings, milkmanName: e.target.value })}
                  placeholder="દા.ત., ભરતભાઈ દૂધવાળા"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t.milkmanPhone}
                </label>
                <input
                  type="tel"
                  value={tempSettings.milkmanPhone}
                  onChange={(e) => setTempSettings({ ...tempSettings, milkmanPhone: e.target.value })}
                  placeholder="દા.ત., 9825012345"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t.dairyBrand}
                </label>
                <input
                  type="text"
                  value={tempSettings.milkBrand}
                  onChange={(e) => setTempSettings({ ...tempSettings, milkBrand: e.target.value })}
                  placeholder="દા.ત., અમૂલ ગોલ્ડ / ગાયનું દૂધ"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t.ratePerLiter}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={tempSettings.defaultRate}
                    onChange={(e) =>
                      setTempSettings({ ...tempSettings, defaultRate: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'gu' ? 'રોજ સવારે (L)' : 'Morn (L)'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={tempSettings.defaultMorningLiters}
                    onChange={(e) =>
                      setTempSettings({
                        ...tempSettings,
                        defaultMorningLiters: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'gu' ? 'રોજ સાંજે (L)' : 'Eve (L)'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={tempSettings.defaultEveningLiters}
                    onChange={(e) =>
                      setTempSettings({
                        ...tempSettings,
                        defaultEveningLiters: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
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
    </div>
  );
};
