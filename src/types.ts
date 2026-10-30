/**
 * Types for ઘરનો હિસાબ કિતાબ (Household Ledger & Budget Tracker)
 */

export type TransactionType = 'expense' | 'income';

export type PaymentMode = 'cash' | 'upi' | 'bank' | 'card';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  description: string;
  date: string; // YYYY-MM-DD
  paymentMode: PaymentMode;
  notes?: string;
  createdAt: number;
}

export interface CategoryInfo {
  id: string;
  nameGu: string;
  nameEn: string;
  iconName: string;
  type: TransactionType;
  bgLight: string;
  textColor: string;
  borderClass: string;
}

export interface MilkRecord {
  date: string; // YYYY-MM-DD
  morningLiters: number;
  eveningLiters: number;
  ratePerLiter: number;
  isSkipped: boolean;
  notes?: string;
}

export interface MilkSettings {
  defaultRate: number;
  defaultMorningLiters: number;
  defaultEveningLiters: number;
  milkmanName: string;
  milkmanPhone: string;
  milkBrand: string;
  monthPaidStatus: Record<string, boolean>; // '2026-10': true
}

export type KhataType = 'to_give' | 'to_receive'; // આપવાના (Payable) or લેવાના (Receivable)

export interface KhataEntry {
  id: string;
  date: string;
  amount: number;
  type: 'borrowed' | 'settled'; // લીધા / આપ્યા
  note: string;
}

export interface KhataContact {
  id: string;
  name: string;
  phone: string;
  role: string; // e.g. કરિયાણા સ્ટોર, કામવાળા બહેન, મિત્ર, સગા-સંબંધી
  type: KhataType;
  balance: number; // calculated total pending
  entries: KhataEntry[];
  createdAt: number;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
  targetDate: string;
  icon: string;
  isCompleted: boolean;
}

export interface BudgetConfig {
  monthlyLimit: number;
  categoryLimits: Record<string, number>;
}

export interface CashDenominations {
  n500: number;
  n200: number;
  n100: number;
  n50: number;
  n20: number;
  n10: number;
  coins: number;
}

export type Language = 'gu' | 'en';
