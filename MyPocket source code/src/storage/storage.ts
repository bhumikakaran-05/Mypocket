import { AppData, MonthData, DEFAULT_CATEGORIES } from "../types";

const STORAGE_KEY = "mypocket_data";

export const getInitialData = (): AppData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse stored data", e);
    }
  }
  return {
    months: {},
    savings: {
      totalSaved: 0,
      yearlySaved: {}
    }
  };
};

export const saveData = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getMonthData = (data: AppData, monthKey: string): MonthData => {
  return data.months[monthKey] || {
    monthlyPocketMoney: 0,
    categoryBudgets: { ...DEFAULT_CATEGORIES },
    expenses: []
  };
};

export const updateMonthData = (data: AppData, monthKey: string, monthData: MonthData): AppData => {
  const newData = {
    ...data,
    months: {
      ...data.months,
      [monthKey]: monthData
    }
  };
  
  // Recalculate savings
  return recalculateSavings(newData);
};

export const recalculateSavings = (data: AppData): AppData => {
  let totalSaved = 0;
  const yearlySaved: Record<string, number> = {};
  const currentMonthKey = new Date().getFullYear() + "-" + String(new Date().getMonth() + 1).padStart(2, '0');

  Object.entries(data.months).forEach(([monthKey, monthData]) => {
    const year = monthKey.split("-")[0];
    const pocketMoney = monthData.monthlyPocketMoney || 0;
    const totalSpent = monthData.expenses.reduce((a, b) => a + b.amount, 0);
    
    const monthlySavings = pocketMoney - totalSpent;
    
    // Reverted to simple past month check as requested
    if (monthKey < currentMonthKey) {
      totalSaved += monthlySavings;
    }
    
    yearlySaved[year] = (yearlySaved[year] || 0) + monthlySavings;
  });

  return {
    ...data,
    savings: {
      totalSaved,
      yearlySaved
    }
  };
};

export const clearAllData = (): AppData => {
  localStorage.removeItem(STORAGE_KEY);
  return {
    months: {},
    savings: {
      totalSaved: 0,
      yearlySaved: {}
    }
  };
};
