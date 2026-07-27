import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a goal title'],
    },
    description: {
      type: String,
      default: '',
    },
    targetAmount: {
      type: Number,
      required: [true, 'Please set a target amount'],
      min: [0, 'Target amount must be positive'],
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: [0, 'Current amount must be positive'],
    },
    deadline: {
      type: Date,
      required: [true, 'Please set a deadline'],
    },
    icon: {
      type: String,
      default: '🎯',
    },
    color: {
      type: String,
      default: '#10b981',
    },
    status: {
      type: String,
      enum: ['In Progress', 'Achieved', 'Abandoned'],
      default: 'In Progress',
    },
  },
  {
    timestamps: true,
  }
);

const Goal = mongoose.model('Goal', goalSchema);

export default Goal;
