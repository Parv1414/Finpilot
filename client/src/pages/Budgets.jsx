import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import Button from '../components/ui/Button';
import Input, { Select } from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import ProgressBar from '../components/shared/ProgressBar';
import api from '../services/api';
import { categories, categoryColors } from '../constants';

const empty = { category: categories[0], limit: '', spent: '0', icon: '💰' };
const icons = ['🍽️', '🛍️', '🚗', '🎬', '💪', '⚡', '✈️', '📺', '🏥', '📚', '💻', '🎮'];

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(empty);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/budgets');
      const list = Array.isArray(res.data) ? res.data : [];
      const mappedData = list.map(b => ({
        ...b,
        id: b._id,
        limit: Number(b.limit),
        spent: Number(b.spent),
        color: categoryColors[b.category] || '#10b981'
      }));
      setBudgets(mappedData);
    } catch (error) {
      console.error('Failed to load budgets', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalLimit = budgets.reduce((a, b) => a + b.limit, 0);
  const totalSpent = budgets.reduce((a, b) => a + b.spent, 0);
  const overBudget = budgets.filter(b => b.spent > b.limit).length;

  const openAdd = () => { setForm(empty); setEditItem(null); setShowModal(true); };
  const openEdit = (item) => {
    setEditItem(item);
    setForm({ category: item.category, limit: String(item.limit), spent: String(item.spent), icon: item.icon });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (!form.limit || parseFloat(form.limit) <= 0) {
        alert('Please enter a valid budget limit');
        setSaving(false);
        return;
      }
      const color = categoryColors[form.category] || '#10b981';
      const payload = {
        category: form.category,
        limit: parseFloat(form.limit),
        spent: parseFloat(form.spent || 0),
        icon: form.icon,
        month: new Date().toISOString().substring(0, 7),
      };

      if (editItem) {
        const res = await api.put(`/budgets/${editItem.id}`, payload);
        const d = res && res.data ? res.data : {};
        setBudgets(budgets.map(b =>
          b.id === editItem.id
            ? { ...b, ...d, id: d._id || editItem.id, limit: Number(d.limit || b.limit), spent: Number(d.spent || b.spent), color }
            : b
        ));
      } else {
        const res = await api.post('/budgets', payload);
        const d = res && res.data ? res.data : payload;
        setBudgets([...budgets, { ...d, id: d._id || Date.now(), limit: Number(d.limit || 0), spent: Number(d.spent || 0), color }]);
      }
      setShowModal(false);
    } catch (error) {
      console.error('Failed to save budget', error);
      alert(error.response?.data?.message || 'Failed to save budget');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/budgets/${id}`);
      setBudgets(budgets.filter(b => b.id !== id));
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete budget', error);
      alert('Failed to delete budget');
    }
  };

  if (loading && budgets.length === 0) {
    return <div className="text-white text-center py-10">Loading Budgets...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Budget', value: `₹${totalLimit.toLocaleString('en-IN')}`, color: 'text-slate-200', bg: 'bg-white/[0.03]' },
          { label: 'Total Spent', value: `₹${totalSpent.toLocaleString('en-IN')}`, color: 'text-rose-400', bg: 'bg-rose-500/[0.05]' },
          { label: overBudget > 0 ? `${overBudget} Over Budget` : 'All On Track', value: `₹${(totalLimit - totalSpent).toLocaleString('en-IN')} left`, color: overBudget > 0 ? 'text-amber-400' : 'text-emerald-400', bg: overBudget > 0 ? 'bg-amber-500/[0.05]' : 'bg-emerald-500/[0.05]' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`glass rounded-2xl p-5 border border-white/[0.07] ${s.bg}`}
          >
            <p className="text-xs text-slate-500 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-200">Monthly Budgets</h2>
          <p className="text-sm text-slate-500">Track your spending limits by category</p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={openAdd}>
          Add Budget
        </Button>
      </div>

      {/* Budget Cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {budgets.map((budget, i) => {
          const isOver = budget.spent > budget.limit;
          const remaining = budget.limit - budget.spent;

          return (
            <motion.div
              key={budget.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`glass rounded-2xl p-5 border transition-all hover:-translate-y-0.5 duration-300 group ${
                isOver ? 'border-rose-500/25 bg-rose-500/[0.03]' : 'border-white/[0.07]'
              }`}
            >
              {/* Top */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ backgroundColor: `${budget.color}20`, border: `1px solid ${budget.color}30` }}
                  >
                    {budget.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{budget.category}</p>
                    <p className="text-xs text-slate-500">₹{budget.limit.toLocaleString('en-IN')}/mo</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(budget)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all">
                    <Edit2 size={12} />
                  </button>
                  <button onClick={() => setDeleteId(budget.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/[0.08] transition-all">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              {/* Progress */}
              <ProgressBar value={budget.spent} max={budget.limit} color={budget.color} size="md" />

              {/* Bottom */}
              <div className="flex items-center justify-between mt-3">
                <div>
                  <p className="text-xs text-slate-500">Spent</p>
                  <p className="text-sm font-semibold text-slate-200">₹{budget.spent.toLocaleString('en-IN')}</p>
                </div>
                {isOver ? (
                  <div className="flex items-center gap-1 text-xs text-rose-400 font-medium">
                    <AlertTriangle size={11} />
                    ₹{(budget.spent - budget.limit).toLocaleString('en-IN')} over
                  </div>
                ) : (
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Left</p>
                    <p className="text-sm font-semibold text-emerald-400">₹{remaining.toLocaleString('en-IN')}</p>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editItem ? 'Edit Budget' : 'Add Budget'}
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>
              {editItem ? 'Save Changes' : 'Add Budget'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Budget Limit (₹)" type="number" min="0" placeholder="10000" value={form.limit} onChange={(e) => setForm({ ...form, limit: e.target.value })} required />
            <Input label="Already Spent (₹)" type="number" min="0" placeholder="0" value={form.spent} onChange={(e) => setForm({ ...form, spent: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">Icon</label>
            <div className="flex flex-wrap gap-2">
              {icons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setForm({ ...form, icon })}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                    form.icon === icon ? 'bg-emerald-500/20 border border-emerald-500/40' : 'bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.08]'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Budget" size="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" size="sm" onClick={() => handleDelete(deleteId)}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-slate-400">Are you sure you want to remove this budget?</p>
      </Modal>
    </div>
  );
}
