import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, PieChart, Download } from 'lucide-react';
import Card, { CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import IncomeExpenseChart from '../components/charts/IncomeExpenseChart';
import SpendingTrendChart from '../components/charts/SpendingTrendChart';
import CategoryBreakdownChart from '../components/charts/CategoryBreakdownChart';
import ExpensePieChart from '../components/charts/ExpensePieChart';
import api from '../services/api';

export default function Reports() {
  const [range, setRange] = useState('6M');
  const [reportData, setReportData] = useState({ monthly: [], categoryBreakdown: [], spendingTrend: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const months = range === '3M' ? 3 : range === '6M' ? 6 : range === '1Y' ? 12 : 6;
        const res = await api.get(`/reports?months=${months}`);
        setReportData(res.data);
      } catch {
        setReportData({ monthly: [], categoryBreakdown: [], spendingTrend: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [range]);

  const { monthly = [], categoryBreakdown = [], spendingTrend = [] } = reportData;

  const avgIncome = monthly.length > 0 ? monthly.reduce((a, b) => a + b.income, 0) / monthly.length : 0;
  const avgExpenses = monthly.length > 0 ? monthly.reduce((a, b) => a + b.expenses, 0) / monthly.length : 0;
  const avgSavingsRate = monthly.length > 0
    ? monthly.reduce((a, b) => a + (b.savings / b.income) * 100, 0) / monthly.length
    : 0;
  const totalSavedYTD = monthly.reduce((a, b) => a + b.savings, 0);

  const currentMonth = monthly[monthly.length - 1];
  const prevMonth = monthly[monthly.length - 2];
  const incomeChange = currentMonth && prevMonth ? (((currentMonth.income - prevMonth.income) / prevMonth.income) * 100).toFixed(1) : '0';
  const expenseChange = currentMonth && prevMonth ? (((currentMonth.expenses - prevMonth.expenses) / prevMonth.expenses) * 100).toFixed(1) : '0';
  const savingsRate = currentMonth ? ((currentMonth.savings / currentMonth.income) * 100).toFixed(1) : '0';

  const kpis = [
    { label: 'Avg. Monthly Income', value: `₹${Math.round(avgIncome).toLocaleString('en-IN')}`, color: 'text-emerald-400' },
    { label: 'Avg. Monthly Expenses', value: `₹${Math.round(avgExpenses).toLocaleString('en-IN')}`, color: 'text-rose-400' },
    { label: 'Avg. Savings Rate', value: `${avgSavingsRate.toFixed(1)}%`, color: 'text-blue-400' },
    { label: 'Total Saved YTD', value: `₹${Math.round(totalSavedYTD).toLocaleString('en-IN')}`, color: 'text-violet-400' },
  ];

  if (loading) {
    return <div className="text-white text-center py-10">Loading Reports...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-200">Financial Reports</h2>
          <p className="text-sm text-slate-500">Monthly analytics and spending breakdown</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/[0.04] border border-white/[0.07] rounded-xl p-1 gap-1">
            {['3M', '6M', '1Y'].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                  range === r ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/25' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <Button variant="secondary" size="sm" icon={Download}>
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="glass rounded-2xl p-5 border border-white/[0.07]"
          >
            <p className="text-xs text-slate-500 mb-1.5">{k.label}</p>
            <p className={`text-xl font-bold font-display ${k.color}`}>{k.value}</p>
          </motion.div>
        ))}
      </div>

      {currentMonth && (
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: 'Income Change', value: `${+incomeChange >= 0 ? '+' : ''}${incomeChange}%`, pos: +incomeChange >= 0, icon: TrendingUp },
            { label: 'Expense Change', value: `${+expenseChange >= 0 ? '+' : ''}${expenseChange}%`, pos: +expenseChange < 0, icon: TrendingUp },
            { label: 'Current Savings Rate', value: `${savingsRate}%`, pos: true, icon: PieChart },
          ].map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 + 0.2 }}
              className={`glass rounded-2xl p-5 border ${m.pos ? 'border-emerald-500/15 bg-emerald-500/[0.03]' : 'border-rose-500/15 bg-rose-500/[0.03]'}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <m.icon size={14} className={m.pos ? 'text-emerald-400' : 'text-rose-400'} />
                <p className="text-xs text-slate-500">{m.label}</p>
              </div>
              <p className={`text-2xl font-bold font-display ${m.pos ? 'text-emerald-400' : 'text-rose-400'}`}>{m.value}</p>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-5">
        <Card animate>
          <CardHeader>
            <CardTitle icon={BarChart3}>Income vs Expenses</CardTitle>
            <span className="text-xs text-slate-500">Monthly comparison</span>
          </CardHeader>
          <IncomeExpenseChart data={monthly} />
        </Card>
        <Card animate>
          <CardHeader>
            <CardTitle icon={TrendingUp}>Spending Trend</CardTitle>
            <span className="text-xs text-slate-500">Trend chart</span>
          </CardHeader>
          <SpendingTrendChart data={spendingTrend} />
        </Card>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <Card className="lg:col-span-3" animate>
          <CardHeader>
            <CardTitle icon={BarChart3}>Category Breakdown</CardTitle>
            <span className="text-xs text-slate-500">Sorted by spend</span>
          </CardHeader>
          <CategoryBreakdownChart data={categoryBreakdown} />
        </Card>
        <Card className="lg:col-span-2" animate>
          <CardHeader>
            <CardTitle icon={PieChart}>Expense Distribution</CardTitle>
            <span className="text-xs text-slate-500">By category</span>
          </CardHeader>
          <ExpensePieChart data={categoryBreakdown} />
        </Card>
      </div>

      <Card animate>
        <CardHeader>
          <CardTitle>Monthly Summary</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Month', 'Income', 'Expenses', 'Savings', 'Savings Rate', 'Transactions'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3 px-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthly.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-sm text-slate-500">No data available</td>
                </tr>
              ) : (
                [...monthly].reverse().map((row, i) => {
                  const rate = ((row.savings / row.income) * 100).toFixed(1);
                  return (
                    <tr key={row.month || i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-2 text-sm font-medium text-slate-300">{row.month}</td>
                      <td className="py-3.5 px-2 text-sm text-emerald-400 font-semibold">₹{Math.round(row.income).toLocaleString('en-IN')}</td>
                      <td className="py-3.5 px-2 text-sm text-rose-400 font-semibold">₹{Math.round(row.expenses).toLocaleString('en-IN')}</td>
                      <td className="py-3.5 px-2 text-sm text-blue-400 font-semibold">₹{Math.round(row.savings).toLocaleString('en-IN')}</td>
                      <td className="py-3.5 px-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${+rate > 40 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>
                          {rate}%
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-sm text-slate-400">{row.transactions || '-'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
