export interface Expense {
  id: string;
  amount: number;
  category: string;
  note?: string;
  date: string; // ISO string
}

export interface MonthData {
  monthlyPocketMoney: number;
  categoryBudgets: Record<string, number>;
  expenses: Expense[];
}

export interface SavingsData {
  totalSaved: number;
  yearlySaved: Record<string, number>; // key: "YYYY"
}

export interface AppData {
  months: Record<string, MonthData>; // key: "YYYY-MM"
  savings: SavingsData;
}

export const DEFAULT_CATEGORIES = {
  "Food": 0,
  "Travel": 0,
  "Entertainment": 0,
  "Rent": 0,
  "WiFi Bill": 0,
  "Mobile Recharge": 0,
  "Room Maintenance": 0,
  "Gas Cylinder Bill": 0,
  "Electricity Bill": 0
};
