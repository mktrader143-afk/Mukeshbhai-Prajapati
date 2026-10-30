import { Language } from './types';

export const TRANSLATIONS = {
  gu: {
    appTitle: 'ઘરનો હિસાબ કિતાબ',
    appSubtitle: 'રોજિંદો ખર્ચ, દૂધ ડાયરી અને ઉધાર-જમા ખાતાવહી',
    tagline: 'શુભ શરૂઆત - લક્ષ્મીજીની કૃપા અને ઘરનું સુચારૂ આયોજન',
    
    // Tabs
    tabLedger: 'રોજમેળ (હિસાબ)',
    tabMilk: 'દૂધ ડાયરી',
    tabKhata: 'ઉધાર-જમા ખાતાવહી',
    tabBudget: 'બજેટ અને બચત',
    tabCashCounter: 'નોટ ગણતરી',
    tabReports: 'અહેવાલ અને એનાલિટિક્સ',

    // Summary Cards
    netSavings: 'ચાલુ મહિનાની સિલક (બચત)',
    totalIncome: 'કુલ આવક (જમા)',
    totalExpense: 'કુલ ખર્ચ (ઉધાર)',
    todayExpense: 'આજનો ખર્ચ',
    thisMonth: 'આ મહિનો',
    budgetRemaining: 'બાકી બજેટ',
    budgetUsed: 'બજેટ વપરાશ',

    // Actions
    addExpense: 'ખર્ચ ઉમેરો (-)',
    addIncome: 'આવક ઉમેરો (+)',
    quickAdd: 'ઝડપી એન્ટ્રી (વોઇસ/લખાણ)',
    exportReport: 'પીડીએફ / પ્રિન્ટ',
    exportCsv: 'એક્સેલ ડાઉનલોડ (CSV)',
    backupData: 'બેકઅપ લો',
    restoreData: 'બેકઅપ પાછું લાવો',
    resetData: 'નવો હિસાબ',
    loadSample: 'નમૂનાનો હિસાબ ભરો',
    filterAll: 'બધું જ',
    filterExpenses: 'માત્ર ખર્ચ',
    filterIncome: 'માત્ર આવક',
    searchPlaceholder: 'વિગત અથવા કેટેગરી શોધો...',
    dateRange: 'સમયગાળો',
    allTime: 'બધા સમયનો',
    thisWeek: 'આ અઠવાડિયે',
    lastMonth: 'ગયેલ મહિનો',

    // Modal
    modalAddTitle: 'નવો હિસાબ નોંધો',
    modalEditTitle: 'હિસાબમાં ફેરફાર કરો',
    amount: 'રકમ (રૂપિયા ₹)',
    category: 'કેટેગરી પસંદ કરો',
    description: 'વિગત / નોંધ (દા.ત. શાકભાજી, અમૂલ દૂધ)',
    date: 'તારીખ',
    paymentMode: 'ચૂકવણીનો પ્રકાર',
    modeCash: 'રોકડ (Cash)',
    modeUpi: 'Google Pay / PhonePe / UPI',
    modeBank: 'બેંક ટ્રાન્સફર / ચેક',
    modeCard: 'ડેબિટ / ક્રેડિટ કાર્ડ',
    saveBtn: 'સાચવો (Save)',
    cancelBtn: 'રદ કરો',
    deleteBtn: 'કાઢી નાખો',
    editBtn: 'સુધારો',

    // Milk Diary
    milkTitle: 'દૈનિક દૂધ ડાયરી',
    milkSubtitle: 'રોજિંદા દૂધના હિસાબ અને મહિનાના બિલની ચોક્કસ નોંધ',
    morningMilk: 'સવારે (લિટર)',
    eveningMilk: 'સાંજે (લિટર)',
    ratePerLiter: 'ભાવ પ્રતિ લિટર (₹)',
    totalLiters: 'કુલ લિટર દૂધ',
    totalMilkCost: 'દૂધનું કુલ બિલ',
    skipMilkDay: 'આજે દૂધ નથી લીધું (રજા)',
    milkSettings: 'દૂધવાળાની વિગત અને ભાવ સેટ કરો',
    milkmanName: 'દૂધવાળા ભાઈનું નામ',
    milkmanPhone: 'મોબાઈલ નંબર',
    dairyBrand: 'ડેરી / બ્રાન્ડ (દા.ત. અમૂલ ગોલ્ડ / ગાયનું દૂધ)',
    shareWhatsApp: 'દૂધવાળાને WhatsApp પર બિલ મોકલો',
    markMonthPaid: 'મહિનાનું બિલ ચૂકવાઈ ગયું',
    monthPaid: 'ચૂકવાઈ ગયું ✓',
    monthPending: 'ચૂકવવાનું બાકી !',
    milkDaySaved: 'દૂધની એન્ટ્રી સેવ થઈ ગઈ',

    // Khata Bahi
    khataTitle: 'ઉધાર - જમા ખાતાવહી (લેતી - દેતી)',
    khataSubtitle: 'કોને પૈસા આપવાના છે અને કોની પાસેથી લેવાના છે તેની ડાયરી',
    addContact: 'નવું ખાતું ઉમેરો',
    toGive: 'આપવાના બાકી (Payable)',
    toReceive: 'લેવાના બાકી (Receivable)',
    contactName: 'વ્યક્તિ અથવા દુકાનદારનું નામ',
    contactRole: 'સંબંધ / પ્રકાર (દા.ત. કરિયાણાવાળા, કામવાળી બહેન, મિત્ર)',
    contactPhone: 'મોબાઈલ નંબર',
    initialBalance: 'શરૂઆતની બાકી રકમ (₹)',
    settleAmount: 'રકમ ચૂકવો / જમા કરો',
    settleFull: 'હિસાબ પૂરો કરો (ચુકતે)',
    history: 'લેતી-દેતી ઇતિહાસ',
    pendingTotal: 'કુલ બાકી રકમ',

    // Budget & Goals
    budgetTitle: 'માસિક બજેટ અને બચત લક્ષ્ય',
    budgetSubtitle: 'ઘરખર્ચ પર નિયંત્રણ રાખો અને પરિવારના સપના પૂરા કરો',
    setBudget: 'મહિનાનું ખર્ચ બજેટ નક્કી કરો',
    monthlyBudgetLabel: 'આ મહિનાનું કુલ બજેટ (₹)',
    budgetStatusSafe: 'સરસ! તમારો ખર્ચ નિયંત્રણમાં છે.',
    budgetStatusWarning: 'સાવધાન! બજેટનો ૮૦% કરતાં વધુ ખર્ચ થઈ ગયો છે.',
    budgetStatusDanger: 'ધ્યાન આપો! માસિક બજેટ મર્યાદા વટાવી ગઈ છે.',
    savingsGoals: 'પરિવારના બચત લક્ષ્યો',
    addGoal: 'નવું બચત લક્ષ્ય ઉમેરો',
    goalTitle: 'લક્ષ્યનું નામ (દા.ત. દિવાળી શોપિંગ, સોનું, પ્રવાસ)',
    targetAmount: 'લક્ષ્ય રકમ (₹)',
    savedSoFar: 'હાલ સુધી બચાવેલ રકમ (₹)',
    addSavings: 'બચત ઉમેરો',
    congratulations: 'અભિનંદન! લક્ષ્ય પૂર્ણ થયું! 🎉',

    // Cash Counter
    cashTitle: 'ચલણી નોટ ગણતરી કેલ્ક્યુલેટર',
    cashSubtitle: 'ઘરમાં રહેલી રોકડ રકમ (કેશ બોક્સ) ગણવા માટેનું દેશી સાધન',
    notes: 'નોટો',
    count: 'સંખ્યા',
    totalCash: 'કુલ રોકડ રકમ',
    clearCash: 'સાફ કરો',
    copyCashTotal: 'હિસાબ કોપી કરો',

    // Gujarati Numeral Switch
    useGujaratiNumerals: 'ગુજરાતી આંકડા (૧, ૨, ૩)',
    useEnglishNumerals: 'અંગ્રેજી આંકડા (1, 2, 3)',

    // Voice Quick Add
    voiceQuickTitle: 'બોલીને કે ટૂંકમાં ઝડપી હિસાબ લખો',
    voiceQuickHint: 'ઉદાહરણ: "શાકભાજી ૧૫૦", "કરિયાણું ૧૨૦૦ રોકડ", "દૂધ ૬૪"',
    voiceStart: 'માઈક ચાલુ કરો',
    voiceListening: 'સાંભળી રહ્યું છે... બોલો...',
    voiceStop: 'બંધ કરો',
    voiceAddBtn: 'ઝડપી ઉમેરો',

    // Empty states
    noTransactions: 'આ મહિનામાં હજી કોઈ હિસાબ નોંધાયેલ નથી.',
    noContacts: 'કોઈ ખાતું નોંધાયેલ નથી. "નવું ખાતું ઉમેરો" પર ક્લિક કરો.',
  },
  en: {
    appTitle: 'Ghar No Hisab Kitab',
    appSubtitle: 'Household Daily Ledger, Milk Diary & Budget Manager',
    tagline: 'Simple, trusted home financial tracking for Indian families',

    // Tabs
    tabLedger: 'Daily Ledger',
    tabMilk: 'Milk Diary',
    tabKhata: 'Khata Bahi (Udhar-Jama)',
    tabBudget: 'Budget & Savings',
    tabCashCounter: 'Cash Counter',
    tabReports: 'Reports & Analytics',

    // Summary Cards
    netSavings: 'Current Month Balance',
    totalIncome: 'Total Income (Credit)',
    totalExpense: 'Total Expenses (Debit)',
    todayExpense: "Today's Expense",
    thisMonth: 'This Month',
    budgetRemaining: 'Remaining Budget',
    budgetUsed: 'Budget Used',

    // Actions
    addExpense: 'Add Expense (-)',
    addIncome: 'Add Income (+)',
    quickAdd: 'Voice / Quick Entry',
    exportReport: 'Print / PDF Receipt',
    exportCsv: 'Export Excel (CSV)',
    backupData: 'Backup Data',
    restoreData: 'Restore Backup',
    resetData: 'New Ledger',
    loadSample: 'Load Sample Data',
    filterAll: 'All Records',
    filterExpenses: 'Expenses Only',
    filterIncome: 'Income Only',
    searchPlaceholder: 'Search notes or categories...',
    dateRange: 'Time Period',
    allTime: 'All Time',
    thisWeek: 'This Week',
    lastMonth: 'Last Month',

    // Modal
    modalAddTitle: 'Add Transaction',
    modalEditTitle: 'Edit Transaction',
    amount: 'Amount (₹)',
    category: 'Select Category',
    description: 'Description / Note (e.g. Vegetables, Amul Milk)',
    date: 'Date',
    paymentMode: 'Payment Mode',
    modeCash: 'Cash',
    modeUpi: 'UPI (GPay / PhonePe / Paytm)',
    modeBank: 'Bank Transfer / Cheque',
    modeCard: 'Debit / Credit Card',
    saveBtn: 'Save Entry',
    cancelBtn: 'Cancel',
    deleteBtn: 'Delete',
    editBtn: 'Edit',

    // Milk Diary
    milkTitle: 'Daily Milk Diary',
    milkSubtitle: 'Track morning & evening milk deliveries, price, and monthly dairy bills',
    morningMilk: 'Morning (Liters)',
    eveningMilk: 'Evening (Liters)',
    ratePerLiter: 'Rate per Liter (₹)',
    totalLiters: 'Total Liters Delivered',
    totalMilkCost: 'Total Milk Bill',
    skipMilkDay: 'No Milk Delivered Today (Skip)',
    milkSettings: 'Milkman & Price Settings',
    milkmanName: "Milkman's Name",
    milkmanPhone: 'Phone Number',
    dairyBrand: 'Dairy / Milk Brand (e.g. Amul Gold)',
    shareWhatsApp: 'Share Monthly Bill on WhatsApp',
    markMonthPaid: 'Mark Bill as Paid',
    monthPaid: 'Bill Paid ✓',
    monthPending: 'Payment Pending !',
    milkDaySaved: 'Milk entry saved',

    // Khata Bahi
    khataTitle: 'Khata Bahi (Lent & Borrowed Ledger)',
    khataSubtitle: 'Track payables to local vendors, domestic staff, relatives, or friends',
    addContact: 'Add New Account',
    toGive: 'To Pay (Payable)',
    toReceive: 'To Receive (Receivable)',
    contactName: 'Person / Shopkeeper Name',
    contactRole: 'Role / Type (e.g. Grocery Shop, Maid, Friend)',
    contactPhone: 'Phone Number',
    initialBalance: 'Initial Pending Amount (₹)',
    settleAmount: 'Make Payment / Settle',
    settleFull: 'Clear All Dues (Settled)',
    history: 'Transaction History',
    pendingTotal: 'Total Pending',

    // Budget & Goals
    budgetTitle: 'Monthly Budget & Family Savings Goals',
    budgetSubtitle: 'Keep home expenses under control and save for family milestones',
    setBudget: 'Set Monthly Expense Limit',
    monthlyBudgetLabel: 'Monthly Spending Budget (₹)',
    budgetStatusSafe: 'Great! Your spending is well within budget.',
    budgetStatusWarning: 'Caution! You have crossed 80% of your monthly limit.',
    budgetStatusDanger: 'Alert! You have exceeded your monthly budget.',
    savingsGoals: 'Family Savings Goals',
    addGoal: 'Add New Savings Goal',
    goalTitle: 'Goal Name (e.g. Diwali Shopping, Gold, Family Trip)',
    targetAmount: 'Target Amount (₹)',
    savedSoFar: 'Saved Amount (₹)',
    addSavings: 'Add Savings',
    congratulations: 'Congratulations! Target Achieved! 🎉',

    // Cash Counter
    cashTitle: 'Cash Denomination Calculator',
    cashSubtitle: 'Easily count physical cash and tally your home cash drawer',
    notes: 'Denomination',
    count: 'Count',
    totalCash: 'Total Physical Cash',
    clearCash: 'Reset Counter',
    copyCashTotal: 'Copy Cash Breakdown',

    // Gujarati Numeral Switch
    useGujaratiNumerals: 'Gujarati Digits (૧, ૨, ૩)',
    useEnglishNumerals: 'English Digits (1, 2, 3)',

    // Voice Quick Add
    voiceQuickTitle: 'Quick Voice or Text Entry',
    voiceQuickHint: 'e.g. "Vegetables 150", "Groceries 1200 cash", "Milk 64"',
    voiceStart: 'Start Voice Input',
    voiceListening: 'Listening... please speak...',
    voiceStop: 'Stop',
    voiceAddBtn: 'Quick Add',

    // Empty states
    noTransactions: 'No records found for this period.',
    noContacts: 'No accounts yet. Click "Add New Account" to start.',
  },
};

export function getTranslation(lang: Language) {
  return TRANSLATIONS[lang] || TRANSLATIONS.gu;
}
