import { MonthData } from "../types";

export const calculateMonthStats = (monthData: MonthData) => {
  const totalBudget = monthData.monthlyPocketMoney || 0;
  const totalSpent = monthData.expenses.reduce((a, b) => a + b.amount, 0);
  const remainingBalance = totalBudget - totalSpent;
  
  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  
  const categoryStats = Object.entries(monthData.categoryBudgets).map(([name, budget]) => {
    const spent = monthData.expenses
      .filter(e => e.category === name)
      .reduce((a, b) => a + b.amount, 0);
    
    return {
      name,
      budget,
      spent,
      remaining: budget - spent,
      percentage: budget > 0 ? (spent / budget) * 100 : 0,
      overspent: spent > budget ? spent - budget : 0
    };
  });

  return {
    totalBudget,
    totalSpent,
    remainingBalance,
    spentPercentage,
    categoryStats,
    monthlySavings: totalBudget > totalSpent ? totalBudget - totalSpent : 0,
    monthlyOverspent: totalSpent > totalBudget ? totalSpent - totalBudget : 0
  };
};

export const getProgressBarColor = (percentage: number) => {
  if (percentage < 70) return "bg-emerald-500";
  if (percentage < 90) return "bg-amber-500";
  return "bg-rose-500";
};

export const getProgressBarTextColor = (percentage: number) => {
  if (percentage < 70) return "text-emerald-600";
  if (percentage < 90) return "text-amber-600";
  return "text-rose-600";
};
