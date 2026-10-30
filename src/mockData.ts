import {
  Transaction,
  MilkRecord,
  MilkSettings,
  KhataContact,
  SavingsGoal,
  BudgetConfig,
} from './types';

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 't-1',
    type: 'income',
    amount: 52000,
    categoryId: 'salary',
    description: 'માસિક પગાર (ઓક્ટોબર)',
    date: '2026-10-01',
    paymentMode: 'bank',
    notes: 'કંપનીમાંથી જમા થયો',
    createdAt: Date.now() - 29 * 86400000,
  },
  {
    id: 't-2',
    type: 'income',
    amount: 11000,
    categoryId: 'rent_income',
    description: 'દુકાનનું માસિક ભાડું મળ્યું',
    date: '2026-10-05',
    paymentMode: 'upi',
    notes: 'Google Pay દ્વારા મળ્યા',
    createdAt: Date.now() - 25 * 86400000,
  },
  {
    id: 't-3',
    type: 'expense',
    amount: 5400,
    categoryId: 'groceries',
    description: 'કરિયાણું અને ઘરનો રાશન (ડી-માર્ટ)',
    date: '2026-10-03',
    paymentMode: 'card',
    notes: 'તેલ, કઠોળ, ચોખા, સાબુ વગેરે',
    createdAt: Date.now() - 27 * 86400000,
  },
  {
    id: 't-4',
    type: 'expense',
    amount: 1850,
    categoryId: 'utilities',
    description: 'ટોરેન્ટ પાવર લાઈટ બિલ',
    date: '2026-10-06',
    paymentMode: 'upi',
    notes: 'GPay દ્વારા ઓનલાઇન ભર્યું',
    createdAt: Date.now() - 24 * 86400000,
  },
  {
    id: 't-5',
    type: 'expense',
    amount: 865,
    categoryId: 'utilities',
    description: 'ઇન્ડેન ગેસ સિલિન્ડર બુકિંગ',
    date: '2026-10-09',
    paymentMode: 'cash',
    notes: 'ડિલિવરી સમયે રોકડા આપ્યા',
    createdAt: Date.now() - 21 * 86400000,
  },
  {
    id: 't-6',
    type: 'expense',
    amount: 2500,
    categoryId: 'maid_servant',
    description: 'કામવાળા બહેનનો ઓક્ટોબર પગાર',
    date: '2026-10-05',
    paymentMode: 'cash',
    notes: 'વાસણ-કચરા-પોતા માસિક ચુકવણી',
    createdAt: Date.now() - 25 * 86400000,
  },
  {
    id: 't-7',
    type: 'expense',
    amount: 3200,
    categoryId: 'education',
    description: 'બાળકોની શાળા ક્વાર્ટર ફી અને પુસ્તકો',
    date: '2026-10-10',
    paymentMode: 'bank',
    notes: 'સ્કૂલ પોર્ટલ પર ચુકવણી',
    createdAt: Date.now() - 20 * 86400000,
  },
  {
    id: 't-8',
    type: 'expense',
    amount: 280,
    categoryId: 'vegetables_fruits',
    description: 'શાકમાર્કેટમાંથી શાકભાજી અને લીંબુ-કોથમરી',
    date: '2026-10-12',
    paymentMode: 'cash',
    createdAt: Date.now() - 18 * 86400000,
  },
  {
    id: 't-9',
    type: 'expense',
    amount: 1200,
    categoryId: 'transport',
    description: 'ગાડીમાં પેટ્રોલ પુરાવ્યું',
    date: '2026-10-14',
    paymentMode: 'upi',
    createdAt: Date.now() - 16 * 86400000,
  },
  {
    id: 't-10',
    type: 'expense',
    amount: 699,
    categoryId: 'recharge',
    description: 'જિયો ફાઈબર વાઇફાઇ અને મોબાઈલ રિચાર્જ',
    date: '2026-10-16',
    paymentMode: 'upi',
    createdAt: Date.now() - 14 * 86400000,
  },
  {
    id: 't-11',
    type: 'expense',
    amount: 760,
    categoryId: 'medical',
    description: 'બા-બાપુજીની નિયમિત બીપી/ડાયાબિટીસ દવા',
    date: '2026-10-19',
    paymentMode: 'cash',
    createdAt: Date.now() - 11 * 86400000,
  },
  {
    id: 't-12',
    type: 'expense',
    amount: 320,
    categoryId: 'dining_snacks',
    description: 'રવિવાર સવારના ફાફડા-જલેબી અને ચા',
    date: '2026-10-25',
    paymentMode: 'upi',
    createdAt: Date.now() - 5 * 86400000,
  },
  {
    id: 't-13',
    type: 'expense',
    amount: 450,
    categoryId: 'vegetables_fruits',
    description: 'ફળો (સફરજન, કેળાં, દાડમ)',
    date: '2026-10-27',
    paymentMode: 'cash',
    createdAt: Date.now() - 3 * 86400000,
  },
  {
    id: 't-14',
    type: 'expense',
    amount: 2200,
    categoryId: 'clothing_shopping',
    description: 'દિવાળી માટે પૂજાના નવા કપડાં',
    date: '2026-10-29',
    paymentMode: 'card',
    createdAt: Date.now() - 1 * 86400000,
  },
];

export const INITIAL_MILK_SETTINGS: MilkSettings = {
  defaultRate: 64, // ₹64/liter (Amul Gold standard)
  defaultMorningLiters: 1.0,
  defaultEveningLiters: 0.5,
  milkmanName: 'ભરતભાઈ દૂધવાળા',
  milkmanPhone: '9825012345',
  milkBrand: 'અમૂલ ગોલ્ડ (Amul Gold)',
  monthPaidStatus: {
    '2026-09': true,
    '2026-10': false,
  },
};

export function generateInitialMilkRecords(): MilkRecord[] {
  const records: MilkRecord[] = [];
  // Generate 30 days for October 2026
  for (let day = 1; day <= 30; day++) {
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const date = `2026-10-${dayStr}`;
    const isSkipped = day === 8 || day === 21; // Skipped two days
    const morningLiters = isSkipped ? 0 : day === 15 ? 2.0 : 1.0; // Extra morning on day 15 for guests
    const eveningLiters = isSkipped ? 0 : 0.5;

    records.push({
      date,
      morningLiters,
      eveningLiters,
      ratePerLiter: 64,
      isSkipped,
      notes: day === 15 ? 'ઘરે મહેમાન હોવાથી ૧ લિટર વધુ લીધું' : isSkipped ? 'બહારગામ હોવાથી દૂધ બંધ હતું' : '',
    });
  }
  return records;
}

export const INITIAL_KHATA_CONTACTS: KhataContact[] = [
  {
    id: 'k-1',
    name: 'મહાદેવ કિરાણા સ્ટોર (રમણભાઈ)',
    phone: '9879011223',
    role: 'કરિયાણાવાળા ભાઈ',
    type: 'to_give',
    balance: 850,
    createdAt: Date.now() - 15 * 86400000,
    entries: [
      {
        id: 'ke-1',
        date: '2026-10-18',
        amount: 850,
        type: 'borrowed',
        note: 'ઘઉંનો લોટ અને તેલનું બાકી બિલ',
      },
    ],
  },
  {
    id: 'k-2',
    name: 'જિગ્નેશ પટેલ (મિત્ર)',
    phone: '9426033445',
    role: 'મિત્ર / અંગત',
    type: 'to_receive',
    balance: 2000,
    createdAt: Date.now() - 20 * 86400000,
    entries: [
      {
        id: 'ke-2',
        date: '2026-10-10',
        amount: 3000,
        type: 'borrowed',
        note: 'જરૂરિયાત વખતે આપ્યા હતા',
      },
      {
        id: 'ke-3',
        date: '2026-10-24',
        amount: 1000,
        type: 'settled',
        note: 'Google Pay થી જમા કર્યા',
      },
    ],
  },
  {
    id: 'k-3',
    name: 'શારદાબેન (સફાઈ કામ)',
    phone: '9904077889',
    role: 'કામવાળા બહેન',
    type: 'to_receive',
    balance: 500,
    createdAt: Date.now() - 10 * 86400000,
    entries: [
      {
        id: 'ke-4',
        date: '2026-10-20',
        amount: 500,
        type: 'borrowed',
        note: 'દિવાળી પૂર્વે એડવાન્સ ઉપાડ લીધો',
      },
    ],
  },
];

export const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'g-1',
    title: 'દિવાળી બોનસ અને ખરીદી ફંડ',
    targetAmount: 25000,
    savedAmount: 21500,
    targetDate: '2026-11-05',
    icon: 'Sparkles',
    isCompleted: false,
  },
  {
    id: 'g-2',
    title: 'સોમનાથ - દ્વારકા પરિવાર યાત્રા',
    targetAmount: 18000,
    savedAmount: 18000,
    targetDate: '2026-12-25',
    icon: 'Compass',
    isCompleted: true,
  },
  {
    id: 'g-3',
    title: 'સોનાનો સિક્કો (ધનતેરસ પૂજન)',
    targetAmount: 45000,
    savedAmount: 32000,
    targetDate: '2026-11-08',
    icon: 'Coins',
    isCompleted: false,
  },
];

export const INITIAL_BUDGET: BudgetConfig = {
  monthlyLimit: 30000,
  categoryLimits: {
    groceries: 7000,
    vegetables_fruits: 3000,
    milk_dairy: 2800,
    utilities: 3000,
    education: 4000,
    transport: 2500,
    dining_snacks: 1500,
  },
};
