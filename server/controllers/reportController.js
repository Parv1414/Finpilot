import Expense from '../models/Expense.js';
import Budget from '../models/Budget.js';

export const getReports = async (req, res, next) => {
  try {
    const months = parseInt(req.query.months) || 6;
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

    const expenses = await Expense.find({
      user: req.user._id,
      date: { $gte: startDate },
    }).sort({ date: 1 });

    const monthlyMap = {};
    for (const exp of expenses) {
      const d = new Date(exp.date);
      const key = d.toLocaleString('en-IN', { month: 'short', year: 'numeric' });
      if (!monthlyMap[key]) {
        monthlyMap[key] = { month: key, income: 0, expenses: 0, savings: 0, transactions: 0 };
      }
      if (exp.type === 'income') {
        monthlyMap[key].income += exp.amount;
      } else {
        monthlyMap[key].expenses += exp.amount;
      }
      monthlyMap[key].transactions += 1;
    }

    for (const key of Object.keys(monthlyMap)) {
      monthlyMap[key].savings = monthlyMap[key].income - monthlyMap[key].expenses;
    }

    const monthly = Object.values(monthlyMap);

    const categoryMap = {};
    for (const exp of expenses) {
      if (exp.type === 'expense') {
        const cat = exp.category || 'Other';
        if (!categoryMap[cat]) {
          categoryMap[cat] = { name: cat, value: 0, color: categoryColor(cat) };
        }
        categoryMap[cat].value += exp.amount;
      }
    }
    const categoryBreakdown = Object.values(categoryMap);

    const trendMap = {};
    for (const exp of expenses) {
      const d = new Date(exp.date);
      const key = d.toLocaleString('en-IN', { month: 'short', year: 'numeric' });
      if (!trendMap[key]) {
        trendMap[key] = { month: key, income: 0, expenses: 0, savings: 0 };
      }
      if (exp.type === 'income') {
        trendMap[key].income += exp.amount;
      } else {
        trendMap[key].expenses += exp.amount;
      }
    }
    for (const key of Object.keys(trendMap)) {
      trendMap[key].savings = trendMap[key].income - trendMap[key].expenses;
    }
    const spendingTrend = Object.values(trendMap);

    res.json({ monthly, categoryBreakdown, spendingTrend });
  } catch (error) {
    next(error);
  }
};

function categoryColor(category) {
  const colors = {
    'Food': '#10b981', 'Groceries': '#f59e0b', 'Transport': '#06b6d4',
    'Shopping': '#3b82f6', 'Bills': '#64748b', 'Investments': '#60a5fa',
    'EMI': '#a78bfa', 'Healthcare': '#f43f5e', 'Entertainment': '#8b5cf6',
    'Education': '#ec4899', 'Salary': '#34d399', 'UPI': '#818cf8', 'Rent': '#94a3b8',
  };
  return colors[category] || '#64748b';
}
