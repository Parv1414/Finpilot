import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet, TrendingUp, TrendingDown, PiggyBank, ShieldCheck, ArrowRight,
} from 'lucide-react';
import StatCard from '../components/shared/StatCard';
import AIInsightsCard from '../components/shared/AIInsightsCard';
import TransactionTable from '../components/shared/TransactionTable';
import SpendingTrendChart from '../components/charts/SpendingTrendChart';
import ExpensePieChart from '../components/charts/ExpensePieChart';
import Card, { CardHeader, CardTitle } from '../components/ui/Card';
import api from '../services/api';
import { formatCurrency } from '../utils/format';

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expRes, budgRes] = await Promise.all([
          api.get('/expenses'),
          api.get('/budgets')
        ]);

        const txList = Array.isArray(expRes.data) ? expRes.data : [];
        const mappedData = txList.map(t => ({
          ...t,
          id: t._id,
        }));
        setTransactions(mappedData);
        setBudgets(Array.isArray(budgRes.data) ? budgRes.data : []);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate dynamic stats
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const totalBalance = totalIncome - totalExpenses;
  const budgetTotal = budgets.reduce((acc, curr) => acc + curr.limit, 0); 
  const budgetLeft = budgetTotal - totalExpenses;

  const stats = [
    {
      title: 'Total Balance',
      value: totalBalance,
      icon: Wallet,
      color: 'emerald',
      trend: 8.2,
      trendLabel: 'vs last month',
      delay: 0,
    },
    {
      title: 'Monthly Income',
      value: totalIncome,
      icon: TrendingUp,
      color: 'blue',
      trend: 14.1,
      trendLabel: 'vs last month',
      delay: 0.05,
    },
    {
      title: 'Monthly Expenses',
      value: totalExpenses,
      icon: TrendingDown,
      color: 'rose',
      trend: -10.6,
      trendLabel: 'vs last month',
      delay: 0.1,
    },
    {
      title: 'Monthly Savings',
      value: totalIncome - totalExpenses,
      icon: PiggyBank,
      color: 'violet',
      trend: 24.3,
      trendLabel: 'vs last month',
      delay: 0.15,
    },
    {
      title: 'Budget Left',
      value: budgetLeft,
      icon: ShieldCheck,
      color: 'amber',
      trendLabel: `of ₹${budgetTotal.toLocaleString('en-IN')} total budget`,
      delay: 0.2,
    },
  ];

  const recentTransactions = transactions.slice(0, 6);

  const categoryColors = {
    'Food': '#10b981', 'Groceries': '#f59e0b', 'Transport': '#06b6d4',
    'Shopping': '#3b82f6', 'Bills': '#64748b', 'Investments': '#60a5fa',
    'EMI': '#a78bfa', 'Healthcare': '#f43f5e', 'Entertainment': '#8b5cf6',
    'Education': '#ec4899', 'Salary': '#34d399', 'UPI': '#818cf8', 'Rent': '#94a3b8',
  };

  const expenseByCategory = useMemo(() => {
    const map = {};
    for (const t of transactions) {
      if (t.type === 'expense') {
        const cat = t.category || 'Other';
        map[cat] = (map[cat] || 0) + t.amount;
      }
    }
    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
      color: categoryColors[name] || '#64748b',
    }));
  }, [transactions]);

  const spendingTrend = useMemo(() => {
    const map = {};
    for (const t of transactions) {
      const d = new Date(t.date);
      const key = d.toLocaleString('en-IN', { month: 'short', year: 'numeric' });
      if (!map[key]) {
        map[key] = { month: key, income: 0, expenses: 0, savings: 0 };
      }
      if (t.type === 'income') {
        map[key].income += t.amount;
      } else {
        map[key].expenses += t.amount;
      }
    }
    for (const key of Object.keys(map)) {
      map[key].savings = map[key].income - map[key].expenses;
    }
    return Object.values(map);
  }, [transactions]);

  if (loading) {
    return <div className="text-white text-center py-10">Loading Dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      {/* Middle Row: AI Insights + Spending Trend */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* AI Insights */}
        <div>
          <AIInsightsCard />
        </div>

        {/* Spending Trend */}
        <Card className="lg:col-span-2" animate>
          <CardHeader>
            <CardTitle icon={TrendingUp}>Spending Trend</CardTitle>
            <span className="text-xs text-slate-500">Last 6 months</span>
          </CardHeader>
          <SpendingTrendChart data={spendingTrend} />
        </Card>
      </div>

      {/* Bottom Row: Recent Transactions + Pie Chart */}
      <div className="grid lg:grid-cols-5 gap-5">
        {/* Transactions */}
        <Card className="lg:col-span-3" animate>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <Link
              to="/expenses"
              className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              View all <ArrowRight size={12} />
            </Link>
          </CardHeader>
          <TransactionTable transactions={recentTransactions} maxRows={6} />
        </Card>

        {/* Pie Chart */}
        <Card className="lg:col-span-2" animate>
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
            <span className="text-xs text-slate-500">This month</span>
          </CardHeader>
          <ExpensePieChart data={expenseByCategory} />
        </Card>
      </div>
    </div>
  );
}
