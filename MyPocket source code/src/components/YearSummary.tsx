import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { AppData } from "../types";
import { ChevronLeft, TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react";
import { format, parseISO } from "date-fns";

interface YearSummaryProps {
  data: AppData;
  onClose: () => void;
}

export default function YearSummary({ data, onClose }: YearSummaryProps) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  
  const years = Array.from(new Set(Object.keys(data.months).map(m => m.split("-")[0])));
  if (!years.includes(selectedYear)) years.push(selectedYear);
  years.sort((a, b) => b.localeCompare(a));

  const yearMonths = Object.entries(data.months)
    .filter(([key]) => key.startsWith(selectedYear))
    .sort(([a], [b]) => a.localeCompare(b));

  const chartData = yearMonths.map(([key, monthData]) => {
    const spent = monthData.expenses.reduce((a, b) => a + b.amount, 0);
    const budget = monthData.monthlyPocketMoney || 0;
    return {
      month: format(parseISO(`${key}-01`), "MMM"),
      spent,
      budget,
      isOverspent: spent > budget
    };
  });

  const yearlyStats = yearMonths.reduce((acc, [_, monthData]) => {
    const budget = monthData.monthlyPocketMoney || 0;
    const spent = monthData.expenses.reduce((a, b) => a + b.amount, 0);
    
    acc.budget += budget;
    acc.spent += spent;
    if (budget > spent) acc.savings += (budget - spent);
    else acc.overspent += (spent - budget);
    
    return acc;
  }, { budget: 0, spent: 0, savings: 0, overspent: 0 });

  return (
    <div className="fixed inset-0 bg-slate-50 z-50 overflow-y-auto">
      <div className="max-w-2xl mx-auto min-h-screen pb-12">
        <header className="sticky top-0 bg-emerald-600 text-white p-6 flex items-center gap-4 shadow-lg z-10">
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Year Summary</h1>
        </header>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-emerald-50">
            <span className="text-slate-500 font-medium">Select Year</span>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-emerald-50 text-emerald-700 font-bold px-4 py-2 rounded-xl focus:outline-none"
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                <Wallet size={16} /> Total Budget
              </div>
              <p className="text-xl font-bold text-slate-800">₹{yearlyStats.budget.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                <TrendingDown size={16} /> Total Spent
              </div>
              <p className="text-xl font-bold text-slate-800">₹{yearlyStats.spent.toLocaleString()}</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-600 text-sm mb-1">
                <PiggyBank size={16} /> Year Savings
              </div>
              <p className="text-xl font-bold text-emerald-700">₹{yearlyStats.savings.toLocaleString()}</p>
            </div>
            <div className="bg-rose-50 p-4 rounded-3xl border border-rose-100">
              <div className="flex items-center gap-2 text-rose-600 text-sm mb-1">
                <TrendingUp size={16} /> Year Overspent
              </div>
              <p className="text-xl font-bold text-rose-700">₹{yearlyStats.overspent.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Monthly Spending</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="spent" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.isOverspent ? '#f43f5e' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center gap-6 text-sm font-medium">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-600">Within Budget</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="text-slate-600">Overspent</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
