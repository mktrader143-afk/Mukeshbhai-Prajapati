import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Sparkles, X, Check, ArrowRight } from 'lucide-react';
import { Language, Transaction } from '../types';
import { getTranslation } from '../translations';
import { parseQuickEntryText, formatCurrency } from '../utils/formatters';
import { getCategoryById } from '../constants/categories';
import { CategoryIcon } from './CategoryIcon';

interface VoiceQuickAddProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  language: Language;
  useGujDigits: boolean;
}

export const VoiceQuickAdd: React.FC<VoiceQuickAddProps> = ({
  isOpen,
  onClose,
  onSave,
  language,
  useGujDigits,
}) => {
  const t = getTranslation(language);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);

  useEffect(() => {
    // Check speech recognition support
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  if (!isOpen) return null;

  // Real-time parsing of input
  const parsed = parseQuickEntryText(inputText);
  const matchedCategory = getCategoryById(parsed.categoryId);

  const startListening = () => {
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMsg(
        language === 'gu'
          ? 'તમારા બ્રાઉઝરમાં માઇક્રોફોન સ્પીચ ઉપલબ્ધ નથી. કૃપા કરીને નીચે ટાઇપ કરો.'
          : 'Speech recognition is not supported in this browser. Please type below.'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'gu' ? 'gu-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg('');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setErrorMsg(
          language === 'gu'
            ? 'અવાજ પકડવામાં ભૂલ આવી, કૃપા કરીને ફરી પ્રયાસ કરો અથવા ટાઇપ કરો.'
            : 'Could not catch voice. Please try again or type manually.'
        );
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleConfirmSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsed.amount <= 0) {
      setErrorMsg(
        language === 'gu'
          ? 'કૃપા કરીને રકમ સાથે લખો (દા.ત., શાકભાજી ૧૫૦)'
          : 'Please include an amount (e.g. Vegetables 150)'
      );
      return;
    }

    onSave({
      type: parsed.type,
      amount: parsed.amount,
      categoryId: parsed.categoryId,
      description: parsed.description,
      date: new Date().toISOString().split('T')[0],
      paymentMode: 'cash',
      notes: 'ઝડપી વોઇસ/ટેક્સ્ટ એન્ટ્રી દ્વારા નોંધાયેલ',
    });

    setInputText('');
    onClose();
  };

  const examplePhrases = [
    { gu: 'શાકભાજી ૧૫૦', en: 'Vegetables 150' },
    { gu: 'દૂધ ૬૪', en: 'Milk 64' },
    { gu: 'કરિયાણું ૧૨૦૦', en: 'Grocery 1200' },
    { gu: 'પેટ્રોલ ૫૦૦', en: 'Petrol 500' },
    { gu: 'પગાર ૪૫૦૦૦', en: 'Salary 45000' },
    { gu: 'નાસ્તો ૮૦', en: 'Breakfast 80' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-xl overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Mic className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                {t.voiceQuickTitle}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleConfirmSave} className="p-5 space-y-4">
          <p className="text-xs text-stone-500">{t.voiceQuickHint}</p>

          {/* Voice Input Button & Text Input */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setErrorMsg('');
                }}
                placeholder={
                  language === 'gu'
                    ? 'દા.ત., શાકભાજી ૨૫૦ અથવા પેટ્રોલ ૫૦૦...'
                    : 'e.g., Vegetables 250 or Petrol 500...'
                }
                autoFocus
                className="w-full px-3 py-2.5 text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>

            {speechSupported && (
              <button
                type="button"
                onClick={startListening}
                className={`p-2.5 rounded-xl transition-all shadow-xs shrink-0 ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
                title={isListening ? t.voiceListening : t.voiceStart}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )}
          </div>

          {isListening && (
            <div className="p-2.5 bg-rose-50 rounded-lg border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              <span>{t.voiceListening}</span>
            </div>
          )}

          {errorMsg && (
            <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>
          )}

          {/* Quick Examples */}
          <div>
            <span className="text-[11px] text-stone-400 block mb-1.5">
              {language === 'gu' ? 'ક્લિક કરીને અજમાવો:' : 'Try clicking:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {examplePhrases.map((ex, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInputText(language === 'gu' ? ex.gu : ex.en)}
                  className="px-2 py-0.5 text-xs rounded bg-stone-100 hover:bg-amber-100 text-stone-700 transition-colors"
                >
                  {language === 'gu' ? ex.gu : ex.en}
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview Card */}
          {inputText && parsed.amount > 0 && (
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block">
                {language === 'gu' ? 'ઓળખાયેલ હિસાબ:' : 'Detected Record:'}
              </span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center border ${matchedCategory.bgLight} ${matchedCategory.borderClass}`}
                  >
                    <CategoryIcon name={matchedCategory.iconName} className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-xs text-stone-900">
                      {parsed.description}
                    </h5>
                    <span className="text-[11px] text-stone-500">
                      {language === 'gu' ? matchedCategory.nameGu : matchedCategory.nameEn} ·{' '}
                      {parsed.type === 'income'
                        ? language === 'gu' ? 'આવક' : 'Income'
                        : language === 'gu' ? 'ખર્ચ' : 'Expense'}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-base font-bold ${
                    parsed.type === 'income' ? 'text-emerald-700' : 'text-stone-900'
                  }`}
                >
                  {parsed.type === 'income' ? '+' : '-'}
                  {formatCurrency(parsed.amount, useGujDigits)}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
            >
              {t.cancelBtn}
            </button>
            <button
              type="submit"
              disabled={parsed.amount <= 0}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-white shadow-xs transition-colors ${
                parsed.amount > 0
                  ? 'bg-amber-700 hover:bg-amber-800'
                  : 'bg-stone-300 cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{t.voiceAddBtn}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
