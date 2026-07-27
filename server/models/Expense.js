import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    description: {
      type: String,
      required: [true, 'Please add a description for the transaction'],
      trim: true,
    },
    merchant: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please add an amount'],
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      default: 'expense',
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: ['Food', 'Groceries', 'Transport', 'Shopping', 'Bills', 'Investments', 'EMI', 'Healthcare', 'Entertainment', 'Education', 'Salary', 'UPI', 'Rent'],
      default: 'Other',
    },
    paymentMethod: {
      type: String,
      required: [true, 'Please specify a payment method'],
      enum: ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash', 'Wallet', 'EMI', 'Other'],
      default: 'UPI',
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot be more than 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
