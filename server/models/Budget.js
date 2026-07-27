import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: ['Food', 'Groceries', 'Transport', 'Shopping', 'Bills', 'Investments', 'EMI', 'Healthcare', 'Entertainment', 'Education', 'Salary', 'UPI', 'Rent'],
    },
    limit: {
      type: Number,
      required: [true, 'Please set a budget limit'],
      min: [0, 'Limit must be positive'],
    },
    spent: {
      type: Number,
      default: 0,
    },
    icon: {
      type: String,
      default: '💰',
    },
    month: {
      type: String, // Format: YYYY-MM
      required: [true, 'Please specify the month (e.g., 2023-10)'],
      match: [/^\d{4}-\d{2}$/, 'Please use YYYY-MM format'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate categories for the same user in the same month
budgetSchema.index({ user: 1, category: 1, month: 1 }, { unique: true });

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;
