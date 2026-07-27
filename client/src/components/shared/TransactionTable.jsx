import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { categoryColors } from '../../constants';
import { formatCurrency as globalFormatCurrency } from '../../utils/format';

const PAGE_SIZE = 8;

function formatCurrency(value) {
  return globalFormatCurrency(Math.abs(value));
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function TransactionTable({ transactions, showSearch = false, maxRows }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = transactions.filter(
    (t) =>
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      t.merchant.toLowerCase().includes(search.toLowerCase())
  );

  const limit = maxRows || PAGE_SIZE;
  const total = Math.ceil(filtered.length / limit);
  const paged = maxRows ? filtered.slice(0, maxRows) : filtered.slice((page - 1) * limit, page * limit);

  return (
    <div>
      {showSearch && (
        <div className="relative mb-4">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search transactions..."
            className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/40 transition-colors"
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['Transaction', 'Category', 'Date', 'Amount'].map((h) => (
                <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3 px-1">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((t, i) => (
              <motion.tr
                key={t.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group"
              >
                <td className="py-3.5 px-1">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      t.type === 'income' ? 'bg-emerald-500/15' : 'bg-white/[0.05]'
                    }`}>
                      {t.type === 'income'
                        ? <ArrowUpRight size={15} className="text-emerald-400" />
                        : <ArrowDownLeft size={15} className="text-slate-400" />
                      }
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{t.description}</p>
                      <p className="text-xs text-slate-500">{t.merchant}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: categoryColors[t.category] || '#64748b' }}
                    />
                    <span className="text-xs text-slate-400">{t.category}</span>
                  </div>
                </td>
                <td className="py-3.5 px-1">
                  <span className="text-xs text-slate-500">{formatDate(t.date)}</span>
                </td>
                <td className="py-3.5 px-1 text-right">
                  <span className={`text-sm font-semibold tabular-nums ${
                    t.type === 'income' ? 'text-emerald-400' : 'text-slate-200'
                  }`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!maxRows && total > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-slate-500">
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-7 h-7 text-xs rounded-lg transition-all ${
                  p === page
                    ? 'bg-emerald-500/20 text-emerald-400 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(total, page + 1))}
              disabled={page === total}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 transition-all"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {paged.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <p className="text-lg mb-1">🔍</p>
          <p className="text-sm">No transactions found</p>
        </div>
      )}
    </div>
  );
}
