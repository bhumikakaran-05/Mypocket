import { useState, FormEvent } from "react";
import { X, Save, IndianRupee, Tag, FileText } from "lucide-react";
import { MonthData, Expense } from "../types";

interface AddExpenseProps {
  monthData: MonthData;
  onAdd: (expense: Expense) => void;
  onClose: () => void;
}

export default function AddExpense({ monthData, onAdd, onClose }: AddExpenseProps) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(Object.keys(monthData.categoryBudgets)[0] || "");
  const [note, setNote] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Please enter a valid amount greater than 0");
      return;
    }

    if (!category) {
      alert("Please select a category");
      return;
    }

    const newExpense: Expense = {
      id: crypto.randomUUID(),
      amount: parsedAmount,
      category,
      note: note.trim() || undefined,
      date: new Date().toISOString()
    };

    onAdd(newExpense);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-bottom border-slate-100 flex justify-between items-center bg-emerald-600 text-white">
          <h2 className="text-xl font-bold">Add Expense</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <IndianRupee size={16} /> Amount
            </label>
            <input
              type="number"
              step="0.01"
              required
              autoFocus
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full text-3xl font-bold px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Tag size={16} /> Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 appearance-none"
            >
              {Object.keys(monthData.categoryBudgets).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <FileText size={16} /> Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What was this for?"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 h-24 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 active:scale-95"
          >
            <Save size={20} /> Save Expense
          </button>
        </form>
      </div>
    </div>
  );
}
