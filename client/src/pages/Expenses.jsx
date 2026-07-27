import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import Card from '../components/ui/Card';
import { categories, categoryColors, paymentMethods } from '../constants';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input, { Select } from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import TransactionTable from '../components/shared/TransactionTable';
import api from '../services/api';
import { formatCurrency as gFormatCurrency } from '../utils/format';

function formatCurrency(v) {
  return gFormatCurrency(Math.abs(v));
}

const empty = { description: '', category: categories[0], amount: '', type: 'expense', date: new Date().toISOString().split('T')[0], merchant: '', paymentMethod: 'UPI', notes: '' };

export default function Expenses() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(empty);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/expenses');
      const list = Array.isArray(res.data) ? res.data : [];
      const mappedData = list.map(t => ({
        ...t,
        id: t._id,
        amount: Number(t.amount)
      }));
      setData(mappedData);
    } catch (error) {
      console.error('Failed to load expenses', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = data.filter((t) => {
    const desc = t.description || '';
    const merch = t.merchant || '';
    const matchSearch = desc.toLowerCase().includes(search.toLowerCase()) ||
      merch.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'All' || t.category === filterCat;
    const matchType = filterType === 'All' || t.type === filterType;
    return matchSearch && matchCat && matchType;
  });

  const totalIncome = filtered.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
  const totalExpense = filtered.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);

  const openAdd = () => { setForm(empty); setEditItem(null); setShowModal(true); };
  const openEdit = (item) => {
    setEditItem(item);
    setForm({ 
      ...item, 
      date: new Date(item.date).toISOString().split('T')[0],
      amount: String(item.amount) 
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        ...form,
        amount: parseFloat(form.amount)
      };

      if (editItem) {
        const res = await api.put(`/expenses/${editItem.id}`, payload);
        const d = res && res.data ? res.data : {};
        setData(data.map(t =>
          t.id === editItem.id
            ? { ...t, ...d, id: d._id || editItem.id, amount: Number(d.amount || t.amount) }
            : t
        ));
      } else {
        const res = await api.post('/expenses', payload);
        const d = res && res.data ? res.data : payload;
        setData([{ ...d, id: d._id || Date.now(), amount: Number(d.amount || 0) }, ...data]);
      }
      setShowModal(false);
    } catch (error) {
      console.error('Failed to save transaction', error);
      alert(error.response?.data?.message || 'Failed to save transaction');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      setData(data.filter(t => t.id !== id));
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete transaction', error);
      alert('Failed to delete transaction');
    }
  };

  if (loading && data.length === 0) {
    return <div className="text-white text-center py-10">Loading Transactions...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Transactions', value: filtered.length, suffix: '', color: 'text-slate-200', bg: 'bg-white/[0.04]' },
          { label: 'Total Income', value: formatCurrency(totalIncome), color: 'text-emerald-400', bg: 'bg-emerald-500/[0.06]' },
          { label: 'Total Expenses', value: formatCurrency(totalExpense), color: 'text-rose-400', bg: 'bg-rose-500/[0.06]' },
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

      {/* Filters + Table */}
      <Card animate>
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transactions..."
              className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/40 transition-colors"
            />
          </div>

          {/* Category filter */}
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/40 transition-colors"
          >
            <option value="All">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Type filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/40 transition-colors"
          >
            <option value="All">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <Button variant="primary" size="md" icon={Plus} onClick={openAdd}>
            Add Transaction
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Transaction', 'Category', 'Date', 'Type', 'Amount', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3 px-2 last:text-right">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((t, i) => (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="py-3.5 px-2">
                      <div>
                        <p className="text-sm font-medium text-slate-200">{t.description}</p>
                        <p className="text-xs text-slate-500">{t.merchant}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryColors[t.category] || '#64748b' }} />
                        <span className="text-xs text-slate-400">{t.category}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-2">
                      <span className="text-xs text-slate-500">
                        {new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="py-3.5 px-2">
                      <Badge variant={t.type === 'income' ? 'income' : 'expense'} dot>
                        {t.type}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-2">
                      <span className={`text-sm font-semibold tabular-nums ${t.type === 'income' ? 'text-emerald-400' : 'text-slate-200'}`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </span>
                    </td>
                    <td className="py-3.5 px-2">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(t)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteId(t.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/[0.08] transition-all"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              <p className="text-2xl mb-2">🔍</p>
              <p className="text-sm">No transactions found</p>
            </div>
          )}
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editItem ? 'Edit Transaction' : 'Add Transaction'}
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>
              {editItem ? 'Save Changes' : 'Add Transaction'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Description"
            placeholder="e.g. Groceries from DMart"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <Input
            label="Merchant"
            placeholder="e.g. Swiggy, Amazon India"
            value={form.merchant}
            onChange={(e) => setForm({ ...form, merchant: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Amount (₹)"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />
            <Input
              label="Date"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </Select>
            <Select
              label="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Payment Method"
              value={form.paymentMethod}
              onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
            >
              {paymentMethods.map(p => <option key={p} value={p}>{p}</option>)}
            </Select>
            <Input
              label="Notes"
              placeholder="Optional notes..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Transaction"
        size="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" size="sm" onClick={() => handleDelete(deleteId)}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-slate-400">
          Are you sure you want to delete this transaction? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
