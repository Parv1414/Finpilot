import Expense from '../models/Expense.js';
import Budget from '../models/Budget.js';
import Goal from '../models/Goal.js';
import { generateInsights } from '../services/aiService.js';

export const getInsights = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;

    const [expenses, budgets, goals] = await Promise.all([
      Expense.find({ user: userId }).sort({ date: -1 }),
      Budget.find({ user: userId }),
      Goal.find({ user: userId }),
    ]);

    const insights = await generateInsights(req.user, expenses, budgets, goals);

    res.json(insights);
  } catch (error) {
    next(error);
  }
};
