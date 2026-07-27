import Expense from '../models/Expense.js';
import Budget from '../models/Budget.js';
import Goal from '../models/Goal.js';
import { chatWithAI } from '../services/aiService.js';

export const chat = async (req, res, next) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400);
      throw new Error('Message is required');
    }

    if (message.length > 2000) {
      res.status(400);
      throw new Error('Message is too long (max 2000 characters)');
    }

    const { _id: userId } = req.user;

    const [expenses, budgets, goals] = await Promise.all([
      Expense.find({ user: userId }).sort({ date: -1 }),
      Budget.find({ user: userId }),
      Goal.find({ user: userId }),
    ]);

    const reply = await chatWithAI(req.user, expenses, budgets, goals, message, history || []);

    res.json({ reply });
  } catch (error) {
    next(error);
  }
};
