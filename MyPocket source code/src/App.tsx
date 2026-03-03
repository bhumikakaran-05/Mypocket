import { useState, useEffect } from "react";
import { format, subMonths, parseISO } from "date-fns";
import { 
  Plus, 
  Settings, 
  BarChart2, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PiggyBank,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AppData, MonthData, Expense, DEFAULT_CATEGORIES } from "./types";
import { getInitialData, saveData, getMonthData, updateMonthData } from "./storage/storage";
import { calculateMonthStats, getProgressBarColor, getProgressBarTextColor } from "./utils/calculations";
import MonthSelector from "./components/MonthSelector";
import AddExpense from "./components/AddExpense";
import CategoryManager from "./components/CategoryManager";
import YearSummary from "./components/YearSummary";
import ResetConfirmationModal from "./components/ResetConfirmationModal";
import PocketMoneyModal from "./components/PocketMoneyModal";

export default function App() {
  const [data, setData] = useState<AppData>(getInitialData());
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), "yyyy-MM"));
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showYearSummary, setShowYearSummary] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showPocketMoneyModal, setShowPocketMoneyModal] = useState(false);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const monthData = getMonthData(data, currentMonth);
  const stats = calculateMonthStats(monthData);

  const handleMonthChange = (newMonth: string) => {
    if (!data.months[newMonth]) {
      const prevMonth = format(subMonths(parseISO(`${newMonth}-01`), 1), "yyyy-MM");
      const prevData = data.months[prevMonth];
      
      if (prevData) {
        if (confirm("Use previous month categories and pocket money?")) {
          const newMonthData: MonthData = {
            monthlyPocketMoney: prevData.monthlyPocketMoney,
            categoryBudgets: { ...prevData.categoryBudgets },
            expenses: []
          };
          setData(prev => updateMonthData(prev, newMonth, newMonthData));
        } else {
          const newMonthData: MonthData = {
            monthlyPocketMoney: 0,
            categoryBudgets: { ...DEFAULT_CATEGORIES },
            expenses: []
          };
          setData(prev => updateMonthData(prev, newMonth, newMonthData));
        }
      } else {
        const newMonthData: MonthData = {
          monthlyPocketMoney: 0,
          categoryBudgets: { ...DEFAULT_CATEGORIES },
          expenses: []
        };
        setData(prev => updateMonthData(prev, newMonth, newMonthData));
      }
    }
    setCurrentMonth(newMonth);
  };

  const handleUpdatePocketMoney = (amount: number) => {
    const newMonthData = {
      ...monthData,
      monthlyPocketMoney: amount
    };
    setData(prev => updateMonthData(prev, currentMonth, newMonthData));
  };

  const handleResetData = () => {
    const newData = {
      months: {},
      savings: { totalSaved: 0, yearlySaved: {} }
    };
    setData(newData);
    saveData(newData);
    setShowResetConfirm(false);
    setShowCategoryManager(false);
  };

  const handleAddExpense = (expense: Expense) => {
    const newMonthData = {
      ...monthData,
      expenses: [...monthData.expenses, expense]
    };
    setData(prev => updateMonthData(prev, currentMonth, newMonthData));
  };

  const handleUpdateMonth = (newMonthData: MonthData) => {
    setData(prev => updateMonthData(prev, currentMonth, newMonthData));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-emerald-600 tracking-tight">MyPocket</h1>
            <p className="text-slate-500 font-medium">Smart Expense Tracker</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowYearSummary(true)}
              className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <BarChart2 size={24} />
            </button>
            <button 
              onClick={() => setShowCategoryManager(true)}
              className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <Settings size={24} />
            </button>
          </div>
        </header>

        <MonthSelector currentMonth={currentMonth} onMonthChange={handleMonthChange} />

        {/* Top Stats Section */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <div className="bg-emerald-600 text-white p-6 rounded-[2.5rem] shadow-xl shadow-emerald-200 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <p className="text-emerald-100 text-sm font-bold uppercase tracking-widest mb-1">Monthly Pocket Money</p>
                  <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setShowPocketMoneyModal(true)}>
                    <h2 className="text-4xl font-black">₹{stats.totalBudget.toLocaleString()}</h2>
                    <Settings size={16} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                  <Wallet size={24} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-1">Total Spent</p>
                  <p className="text-xl font-bold">₹{stats.totalSpent.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-1">Remaining</p>
                  <p className="text-xl font-bold">₹{stats.remainingBalance.toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                  <span>Usage</span>
                  <span>{Math.round(stats.spentPercentage)}%</span>
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(stats.spentPercentage, 100)}%` }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
              </div>
            </div>
            {/* Decorative circles */}
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full" />
            <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full" />
          </div>
        </div>

        {/* Savings Card */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-6 relative overflow-hidden">
            <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600 relative z-10">
              <PiggyBank size={32} />
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4 relative z-10">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Monthly Savings</p>
                <p className={`text-xl font-black ${stats.monthlySavings > 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                  ₹{stats.monthlySavings.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Overspent</p>
                <p className={`text-xl font-black ${stats.monthlyOverspent > 0 ? 'text-rose-500' : 'text-slate-800'}`}>
                  ₹{stats.monthlyOverspent.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Cards */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-lg font-bold text-slate-800">Categories</h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stats.categoryStats.length} Total</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.categoryStats.map((cat) => (
              <motion.div 
                layout
                key={cat.name}
                className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 hover:border-emerald-200 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{cat.name}</h4>
                    <p className="text-xs font-medium text-slate-400">Budget: ₹{cat.budget.toLocaleString()}</p>
                  </div>
                  {cat.overspent > 0 && (
                    <div className="bg-rose-50 text-rose-600 p-1.5 rounded-lg flex items-center gap-1">
                      <AlertCircle size={14} />
                      <span className="text-[10px] font-bold uppercase">Overspent</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-end mb-2">
                  <p className="text-lg font-black text-slate-700">₹{cat.spent.toLocaleString()}</p>
                  <p className={`text-xs font-bold ${getProgressBarTextColor(cat.percentage)}`}>
                    {cat.remaining < 0 ? `Over ₹${Math.abs(cat.remaining)}` : `₹${cat.remaining} left`}
                  </p>
                </div>

                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(cat.percentage, 100)}%` }}
                    className={`h-full rounded-full ${getProgressBarColor(cat.percentage)}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Floating Action Button */}
        <button 
          onClick={() => setShowAddExpense(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-emerald-600 text-white rounded-full shadow-2xl shadow-emerald-300 flex items-center justify-center hover:bg-emerald-700 hover:scale-110 active:scale-95 transition-all z-40"
        >
          <Plus size={32} />
        </button>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddExpense && (
          <motion.div key="add-expense-wrapper">
            <AddExpense 
              monthData={monthData} 
              onAdd={handleAddExpense} 
              onClose={() => setShowAddExpense(false)} 
            />
          </motion.div>
        )}
        {showCategoryManager && (
          <motion.div key="category-manager-wrapper">
            <CategoryManager 
              monthData={monthData} 
              onUpdate={handleUpdateMonth} 
              onClose={() => setShowCategoryManager(false)} 
              onResetAll={() => setShowResetConfirm(true)}
            />
          </motion.div>
        )}
        {showYearSummary && (
          <motion.div key="year-summary-wrapper">
            <YearSummary 
              data={data} 
              onClose={() => setShowYearSummary(false)} 
            />
          </motion.div>
        )}
        {showResetConfirm && (
          <motion.div key="reset-confirm-wrapper">
            <ResetConfirmationModal 
              isOpen={showResetConfirm}
              onConfirm={handleResetData}
              onCancel={() => setShowResetConfirm(false)}
            />
          </motion.div>
        )}
        {showPocketMoneyModal && (
          <motion.div key="pocket-money-wrapper">
            <PocketMoneyModal 
              currentAmount={stats.totalBudget}
              onSave={handleUpdatePocketMoney}
              onClose={() => setShowPocketMoneyModal(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
