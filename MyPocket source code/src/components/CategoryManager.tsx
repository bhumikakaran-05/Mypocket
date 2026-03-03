import { useState } from "react";
import { Plus, Trash2, Edit2, X, Check } from "lucide-react";
import { MonthData } from "../types";

interface CategoryManagerProps {
  monthData: MonthData;
  onUpdate: (newData: MonthData) => void;
  onClose: () => void;
  onResetAll: () => void;
}

export default function CategoryManager({ monthData, onUpdate, onClose, onResetAll }: CategoryManagerProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryBudget, setNewCategoryBudget] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editBudget, setEditBudget] = useState("");

  const handleAdd = () => {
    const trimmedName = newCategoryName.trim();
    if (!trimmedName || !newCategoryBudget) return;
    if (monthData.categoryBudgets[trimmedName]) {
      alert("Category already exists!");
      return;
    }

    const budget = parseFloat(newCategoryBudget);
    if (isNaN(budget) || budget < 0) return;

    onUpdate({
      ...monthData,
      categoryBudgets: {
        ...monthData.categoryBudgets,
        [trimmedName]: budget
      }
    });
    setNewCategoryName("");
    setNewCategoryBudget("");
  };

  const handleDelete = (name: string) => {
    const hasExpenses = monthData.expenses.some(e => e.category === name);
    if (hasExpenses) {
      if (!confirm(`Deleting "${name}" will also affect its expenses. Continue?`)) {
        return;
      }
    }

    const newBudgets = { ...monthData.categoryBudgets };
    delete newBudgets[name];

    onUpdate({
      ...monthData,
      categoryBudgets: newBudgets,
      expenses: monthData.expenses.filter(e => e.category !== name)
    });
  };

  const handleStartEdit = (name: string, budget: number) => {
    setEditingCategory(name);
    setEditBudget(budget.toString());
  };

  const handleSaveEdit = (name: string) => {
    const budget = parseFloat(editBudget);
    if (isNaN(budget) || budget < 0) return;

    onUpdate({
      ...monthData,
      categoryBudgets: {
        ...monthData.categoryBudgets,
        [name]: budget
      }
    });
    setEditingCategory(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-bottom border-slate-100 flex justify-between items-center bg-emerald-600 text-white">
          <h2 className="text-xl font-bold">Manage Categories</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4 mb-8">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Add New Category</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="number"
                placeholder="Budget"
                value={newCategoryBudget}
                onChange={(e) => setNewCategoryBudget(e.target.value)}
                className="w-24 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleAdd}
                className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
              >
                <Plus size={24} />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Existing Categories</h3>
            {Object.entries(monthData.categoryBudgets).map(([name, budget]) => (
              <div key={name} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                {editingCategory === name ? (
                  <div className="flex-1 flex gap-2 items-center">
                    <span className="font-medium text-slate-700 flex-1">{name}</span>
                    <input
                      type="number"
                      value={editBudget}
                      onChange={(e) => setEditBudget(e.target.value)}
                      className="w-24 px-2 py-1 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      autoFocus
                    />
                    <button onClick={() => handleSaveEdit(name)} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg">
                      <Check size={20} />
                    </button>
                    <button onClick={() => setEditingCategory(null)} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg">
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <p className="font-medium text-slate-700">{name}</p>
                      <p className="text-sm text-slate-500">Budget: ₹{budget.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => handleStartEdit(name, budget)}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(name)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 pt-6 border-t border-slate-100">
            <button
              onClick={onResetAll}
              className="w-full py-4 px-6 rounded-2xl border-2 border-rose-100 text-rose-500 font-bold hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={20} /> Reset All App Data
            </button>
            <p className="text-center text-xs text-slate-400 mt-2">Warning: This will delete all months and savings.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
