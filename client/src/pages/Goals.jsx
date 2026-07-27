import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Trophy, Calendar } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import api from '../services/api';

const empty = { name: '', description: '', target: '', current: '', deadline: '', icon: '🎯', color: '#10b981' };
const icons = ['🎯', '🛡️', '🌴', '💻', '🏠', '📈', '🚀', '💍', '🎓', '🚗', '✈️', '🏖️'];
const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#f43f5e', '#06b6d4', '#ec4899', '#84cc16'];

function CircleProgress({ value, max, color, size = 120, strokeWidth = 10 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);
  const offset = circumference - pct * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease', filter: `drop-shadow(0 0 6px ${color}80)` }}
      />
    </svg>
  );
}

function daysLeft(deadline) {
  const d = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
  return d;
}

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(empty);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/goals');
      const list = Array.isArray(res.data) ? res.data : [];
      const mappedData = list.map(g => ({
        ...g,
        id: g._id,
        name: g.title,
        target: Number(g.targetAmount),
        current: Number(g.currentAmount),
      }));
      setGoals(mappedData);
    } catch (error) {
      console.error('Failed to load goals', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalTarget = goals.reduce((a, g) => a + g.target, 0);
  const totalSaved = goals.reduce((a, g) => a + g.current, 0);
  const completed = goals.filter(g => g.current >= g.target).length;

  const openAdd = () => { setForm(empty); setEditItem(null); setShowModal(true); };
  const openEdit = (item) => {
    setEditItem(item);
    setForm({ 
      name: item.name, 
      description: item.description, 
      target: String(item.target), 
      current: String(item.current), 
      deadline: new Date(item.deadline).toISOString().split('T')[0], 
      icon: item.icon, 
      color: item.color 
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        title: form.name,
        description: form.description,
        targetAmount: parseFloat(form.target),
        currentAmount: parseFloat(form.current || 0),
        deadline: form.deadline,
        icon: form.icon,
        color: form.color,
      };

      if (editItem) {
        const res = await api.put(`/goals/${editItem.id}`, payload);
        const d = res && res.data ? res.data : {};
        const updated = {
          ...d,
          id: d._id || editItem.id,
          name: d.title || form.name,
          target: Number(d.targetAmount || form.target || 0),
          current: Number(d.currentAmount || form.current || 0),
        };
        setGoals(goals.map(g => g.id === editItem.id ? updated : g));
      } else {
        const res = await api.post('/goals', payload);
        const d = res && res.data ? res.data : payload;
        const created = {
          ...d,
          id: d._id || Date.now(),
          name: d.title || form.name,
          target: Number(d.targetAmount || form.target || 0),
          current: Number(d.currentAmount || form.current || 0),
        };
        setGoals([...goals, created]);
      }
      setShowModal(false);
    } catch (error) {
      console.error('Failed to save goal', error);
      alert(error.response?.data?.message || 'Failed to save goal');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/goals/${id}`);
      setGoals(goals.filter(g => g.id !== id));
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete goal', error);
      alert('Failed to delete goal');
    }
  };

  if (loading && goals.length === 0) {
    return <div className="text-white text-center py-10">Loading Goals...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Goals', value: goals.length, suffix: ' goals', color: 'text-slate-200' },
          { label: 'Total Saved', value: `₹${totalSaved.toLocaleString('en-IN')}`, color: 'text-emerald-400' },
          { label: 'Completed', value: `${completed} / ${goals.length}`, color: 'text-violet-400' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-2xl p-5 border border-white/[0.07]"
          >
            <p className="text-xs text-slate-500 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-200">Savings Goals</h2>
          <p className="text-sm text-slate-500">Track your progress toward financial milestones</p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={openAdd}>
          Add Goal
        </Button>
      </div>

      {/* Goal Cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {goals.map((goal, i) => {
          const pct = Math.min((goal.current / goal.target) * 100, 100);
          const days = daysLeft(goal.deadline);
          const isDone = goal.current >= goal.target;

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`glass rounded-2xl p-6 border transition-all hover:-translate-y-1 duration-300 group ${
                isDone ? 'border-emerald-500/25 bg-emerald-500/[0.03]' : 'border-white/[0.07]'
              }`}
            >
              {isDone && (
                <div className="flex items-center gap-1.5 mb-3 text-xs text-emerald-400 font-semibold">
                  <Trophy size={12} /> Goal Achieved! 🎉
                </div>
              )}

              {/* Content */}
              <div className="flex items-start gap-4">
                {/* Circle Progress */}
                <div className="relative shrink-0">
                  <CircleProgress value={goal.current} max={goal.target} color={goal.color} size={88} strokeWidth={8} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg">{goal.icon}</span>
                    <span className="text-[10px] font-bold text-slate-300">{pct.toFixed(0)}%</span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-semibold text-slate-200 leading-tight">{goal.name}</h3>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0">
                      <button onClick={() => openEdit(goal)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all">
                        <Edit2 size={11} />
                      </button>
                      <button onClick={() => setDeleteId(goal.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/[0.08] transition-all">
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{goal.description}</p>
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Saved</span>
                      <span className="text-slate-300 font-semibold">₹{goal.current.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Target</span>
                      <span className="text-slate-300 font-semibold">₹{goal.target.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs mt-1" style={{ color: goal.color }}>
                      <Calendar size={10} />
                      {days > 0 ? `${days} days left` : isDone ? 'Achieved!' : `${Math.abs(days)} days overdue`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="mt-4 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, delay: i * 0.1 + 0.3 }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${goal.color}, ${goal.color}99)`,
                    boxShadow: `0 0 8px ${goal.color}50`,
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editItem ? 'Edit Goal' : 'Add Savings Goal'}
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>{editItem ? 'Save Changes' : 'Add Goal'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Goal Name" placeholder="e.g. Emergency Fund" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Description" placeholder="Brief description of your goal" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Target Amount (₹)" type="number" min="0" placeholder="500000" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} required />
            <Input label="Current Savings (₹)" type="number" min="0" placeholder="0" value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} />
          </div>
          <Input label="Target Date" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} required />
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">Icon</label>
            <div className="flex flex-wrap gap-2">
              {icons.map((ic) => (
                <button key={ic} type="button" onClick={() => setForm({ ...form, icon: ic })}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${form.icon === ic ? 'bg-emerald-500/20 border border-emerald-500/40' : 'bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.08]'}`}>
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">Color</label>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                  className={`w-7 h-7 rounded-full transition-all ${form.color === c ? 'ring-2 ring-white/40 ring-offset-2 ring-offset-[#161625] scale-110' : ''}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Goal" size="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" size="sm" onClick={() => handleDelete(deleteId)}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-slate-400">Are you sure you want to delete this savings goal?</p>
      </Modal>
    </div>
  );
}
