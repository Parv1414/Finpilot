import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.json({ _id: user._id, name: user.name, email: user.email, createdAt: user.createdAt });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, bio } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    await user.save();
    res.json({ _id: user._id, name: user.name, email: user.email, createdAt: user.createdAt });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    if (!(await user.matchPassword(currentPassword))) {
      res.status(401);
      throw new Error('Current password is incorrect');
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully', token: generateToken(user._id) });
  } catch (error) {
    next(error);
  }
};
