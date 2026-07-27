import Budget from '../models/Budget.js';

// @desc    Get all budgets for a user
// @route   GET /api/budgets
// @access  Private
export const getBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.find({ user: req.user._id }).sort({ month: -1 });
    res.json(budgets);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new budget
// @route   POST /api/budgets
// @access  Private
export const createBudget = async (req, res, next) => {
  try {
    const { category, limit, month, spent, icon } = req.body;

    // Check if budget already exists for this category in the given month
    const existingBudget = await Budget.findOne({ user: req.user._id, category, month });
    
    if (existingBudget) {
      res.status(400);
      throw new Error('Budget already exists for this category in this month');
    }

    const budget = await Budget.create({
      user: req.user._id,
      category,
      limit,
      spent,
      icon,
      month,
    });

    res.status(201).json(budget);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a budget
// @route   PUT /api/budgets/:id
// @access  Private
export const updateBudget = async (req, res, next) => {
  try {
    let budget = await Budget.findById(req.params.id);

    if (!budget) {
      res.status(404);
      throw new Error('Budget not found');
    }

    // Make sure user owns the budget
    if (budget.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    budget = await Budget.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(budget);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
export const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      res.status(404);
      throw new Error('Budget not found');
    }

    // Make sure user owns the budget
    if (budget.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await budget.deleteOne();

    res.json({ id: req.params.id, message: 'Budget deleted' });
  } catch (error) {
    next(error);
  }
};
