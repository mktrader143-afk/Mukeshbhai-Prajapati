import { Transaction, MilkRecord, MilkSettings, Language } from '../types';
import { ALL_CATEGORIES, getCategoryById } from '../constants/categories';

const GUJARATI_DIGITS = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];

export function toGujaratiDigits(num: number | string): string {
  const str = num.toString();
  return str.replace(/\d/g, (d) => GUJARATI_DIGITS[parseInt(d, 10)]);
}

export function formatCurrency(amount: number, useGujDigits: boolean = false): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  // Indian currency numbering format
  const formattedStandard = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 1,
  }).format(absAmount);

  const prefix = isNegative ? '-₹ ' : '₹ ';

  if (useGujDigits) {
    return prefix + toGujaratiDigits(formattedStandard);
  }
  return prefix + formattedStandard;
}

const GUJARATI_MONTHS = [
  'જાન્યુઆરી',
  'ફેબ્રુઆરી',
  'માર્ચ',
  'એપ્રિલ',
  'મે',
  'જૂન',
  'જુલાઈ',
  'ઓગસ્ટ',
  'સપ્ટેમ્બર',
  'ઓક્ટોબર',
  'નવેમ્બર',
  'ડિસેમ્બર',
];

export function formatDateGujarati(dateStr: string, lang: Language = 'gu', useGujDigits: boolean = false): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const monthIdx = parseInt(month, 10) - 1;
  const dayNum = parseInt(day, 10);
  
  if (lang === 'gu') {
    const d = useGujDigits ? toGujaratiDigits(dayNum) : dayNum;
    const y = useGujDigits ? toGujaratiDigits(year) : year;
    return `${d} ${GUJARATI_MONTHS[monthIdx]} ${y}`;
  } else {
    const dateObj = new Date(parseInt(year, 10), monthIdx, dayNum);
    return dateObj.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}

export function getMonthName(yearMonth: string, lang: Language = 'gu'): string {
  const [year, month] = yearMonth.split('-');
  const monthIdx = parseInt(month, 10) - 1;
  if (lang === 'gu') {
    return `${GUJARATI_MONTHS[monthIdx]} ${year}`;
  }
  const dateObj = new Date(parseInt(year, 10), monthIdx, 1);
  return dateObj.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

export function generateCsvData(transactions: Transaction[], lang: Language = 'gu'): string {
  const headers =
    lang === 'gu'
      ? ['તારીખ', 'પ્રકાર', 'કેટેગરી', 'વિગત', 'ચૂકવણી પદ્ધતિ', 'રકમ (₹)']
      : ['Date', 'Type', 'Category', 'Description', 'Payment Mode', 'Amount (₹)'];

  const rows = transactions.map((t) => {
    const cat = getCategoryById(t.categoryId);
    const catName = lang === 'gu' ? cat.nameGu : cat.nameEn;
    const typeName =
      t.type === 'income'
        ? lang === 'gu'
          ? 'આવક'
          : 'Income'
        : lang === 'gu'
        ? 'ખર્ચ'
        : 'Expense';
    const cleanDesc = (t.description || '').replace(/"/g, '""');
    return [
      t.date,
      typeName,
      `"${catName}"`,
      `"${cleanDesc}"`,
      t.paymentMode.toUpperCase(),
      t.type === 'income' ? t.amount : -t.amount,
    ];
  });

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  return csvContent;
}

export function generateMilkWhatsAppMessage(
  monthYear: string,
  records: MilkRecord[],
  settings: MilkSettings,
  lang: Language = 'gu'
): string {
  const [year, month] = monthYear.split('-');
  const monthIdx = parseInt(month, 10) - 1;
  const monthName = lang === 'gu' ? `${GUJARATI_MONTHS[monthIdx]} ${year}` : `${month}/${year}`;

  let totalLiters = 0;
  let totalCost = 0;
  let skippedDays = 0;

  records.forEach((r) => {
    if (r.isSkipped) {
      skippedDays++;
    } else {
      const dayLiters = (r.morningLiters || 0) + (r.eveningLiters || 0);
      totalLiters += dayLiters;
      totalCost += dayLiters * (r.ratePerLiter || settings.defaultRate);
    }
  });

  if (lang === 'gu') {
    return `🙏 નમસ્તે ${settings.milkmanName || 'દૂધવાળા ભાઈ'},
🗓️ મહિનો: ${monthName}
🥛 ડેરી: ${settings.milkBrand || 'અમૂલ'}
📊 કુલ દૂધ: ${totalLiters.toFixed(1)} લિટર
💰 ભાવ: ₹${settings.defaultRate}/લિટર
❌ રજા (ન લીધેલ દિવસો): ${skippedDays} દિવસ
💵 કુલ બિલ: ₹${Math.round(totalCost)}

આ હિસાબ 'ઘરનો હિસાબ કિતાબ' એપ પરથી મોકલેલ છે. કૃપા કરીને ચકાસી લેશો. આભાર!`;
  } else {
    return `Hello ${settings.milkmanName || 'Milk Provider'},
Month: ${monthName}
Brand: ${settings.milkBrand}
Total Milk: ${totalLiters.toFixed(1)} Liters
Rate: ₹${settings.defaultRate}/L
Skipped Days: ${skippedDays}
Total Amount: ₹${Math.round(totalCost)}

Sent via Ghar No Hisab Kitab App.`;
  }
}

/**
 * Parses free-form text or speech input to extract amount and guess category
 * Handles both Gujarati and English words/digits
 */
export function parseQuickEntryText(text: string): {
  amount: number;
  categoryId: string;
  type: 'expense' | 'income';
  description: string;
} {
  const clean = text.trim();
  // Convert any Gujarati digits to Arabic digits
  let normalized = clean;
  GUJARATI_DIGITS.forEach((gDigit, idx) => {
    normalized = normalized.split(gDigit).join(idx.toString());
  });

  // Extract number
  const numMatch = normalized.match(/(\d+(\.\d+)?)/);
  const amount = numMatch ? parseFloat(numMatch[1]) : 0;

  const lower = normalized.toLowerCase();

  // Check income keywords
  if (
    lower.includes('પગાર') ||
    lower.includes('salary') ||
    lower.includes('આવક') ||
    lower.includes('ઇન્કમ')
  ) {
    return {
      amount,
      categoryId: 'salary',
      type: 'income',
      description: clean || 'માસિક પગાર',
    };
  }

  if (lower.includes('ભાડું મળ્યું') || lower.includes('rent income')) {
    return {
      amount,
      categoryId: 'rent_income',
      type: 'income',
      description: clean || 'ભાડું મળ્યું',
    };
  }

  if (lower.includes('ચાંદલો') || lower.includes('શુકન') || lower.includes('gift')) {
    return {
      amount,
      categoryId: 'gift_shagun',
      type: 'income',
      description: clean || 'ચાંદલો / ભેટ',
    };
  }

  // Check expense keywords
  if (lower.includes('શાક') || lower.includes('શાકભાજી') || lower.includes('ફળ') || lower.includes('vegetable')) {
    return {
      amount,
      categoryId: 'vegetables_fruits',
      type: 'expense',
      description: clean || 'શાકભાજી',
    };
  }

  if (lower.includes('દૂધ') || lower.includes('છાશ') || lower.includes('દહીં') || lower.includes('પનીર') || lower.includes('milk')) {
    return {
      amount,
      categoryId: 'milk_dairy',
      type: 'expense',
      description: clean || 'દૂધ / ડેરી',
    };
  }

  if (lower.includes('કરિયાણું') || lower.includes('રાશન') || lower.includes('તેલ') || lower.includes('અનાજ') || lower.includes('grocery')) {
    return {
      amount,
      categoryId: 'groceries',
      type: 'expense',
      description: clean || 'કરિયાણું',
    };
  }

  if (lower.includes('લાઈટ') || lower.includes('ગેસ') || lower.includes('સિલિન્ડર') || lower.includes('બિલ') || lower.includes('electricity') || lower.includes('gas')) {
    return {
      amount,
      categoryId: 'utilities',
      type: 'expense',
      description: clean || 'લાઈટ / ગેસ બિલ',
    };
  }

  if (lower.includes('દવા') || lower.includes('ડોક્ટર') || lower.includes('ગોળી') || lower.includes('મેડિકલ') || lower.includes('medicine')) {
    return {
      amount,
      categoryId: 'medical',
      type: 'expense',
      description: clean || 'દવા / ડોક્ટર',
    };
  }

  if (lower.includes('પેટ્રોલ') || lower.includes('ડીઝલ') || lower.includes('રિક્ષા') || lower.includes('petrol') || lower.includes('fuel')) {
    return {
      amount,
      categoryId: 'transport',
      type: 'expense',
      description: clean || 'પેટ્રોલ / મુસાફરી',
    };
  }

  if (lower.includes('રિચાર્જ') || lower.includes('વાઇફાઇ') || lower.includes('નેટ') || lower.includes('recharge')) {
    return {
      amount,
      categoryId: 'recharge',
      type: 'expense',
      description: clean || 'મોબાઇલ રિચાર્જ',
    };
  }

  if (lower.includes('નાસ્તો') || lower.includes('ચા') || lower.includes('ગાંઠિયા') || lower.includes('હોટેલ') || lower.includes('નાસ્તા')) {
    return {
      amount,
      categoryId: 'dining_snacks',
      type: 'expense',
      description: clean || 'ચા-નાસ્તો',
    };
  }

  if (lower.includes('ભાડું') || lower.includes('મેન્ટેનન્સ') || lower.includes('rent')) {
    return {
      amount,
      categoryId: 'rent_maintenance',
      type: 'expense',
      description: clean || 'મકાન ભાડું',
    };
  }

  if (lower.includes('કામવાળી') || lower.includes('સફાઈ') || lower.includes('maid')) {
    return {
      amount,
      categoryId: 'maid_servant',
      type: 'expense',
      description: clean || 'કામવાળા બહેન',
    };
  }

  return {
    amount,
    categoryId: 'miscellaneous',
    type: 'expense',
    description: clean || 'પરચૂરણ ખર્ચ',
  };
}
