import { useState, FormEvent } from "react";
import { X, Save, IndianRupee } from "lucide-react";

interface PocketMoneyModalProps {
  currentAmount: number;
  onSave: (amount: number) => void;
  onClose: () => void;
}

export default function PocketMoneyModal({ currentAmount, onSave, onClose }: PocketMoneyModalProps) {
  const [amount, setAmount] = useState(currentAmount > 0 ? currentAmount.toString() : "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      alert("Please enter a valid amount");
      return;
    }
    onSave(parsedAmount);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="p-6 border-bottom border-slate-100 flex justify-between items-center bg-emerald-600 text-white">
          <h2 className="text-xl font-bold">Set Pocket Money</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <IndianRupee size={16} /> Monthly Allowance
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
            <p className="text-xs text-slate-400">This is your total budget for the month.</p>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 active:scale-95"
          >
            <Save size={20} /> Save Budget
          </button>
        </form>
      </div>
    </div>
  );
}
