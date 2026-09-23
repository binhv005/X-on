import { authService } from '../services/authService.js';

export const login = (req, res, next) => {
  try {
    const { usernameOrEmail, password } = req.body;
    const { token, user } = authService.login(usernameOrEmail, password);
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user
    });
  } catch (err) {
    next(err);
  }
};

export const register = (req, res, next) => {
  try {
    const { token, user } = authService.register(req.body);
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user
    });
  } catch (err) {
    next(err);
  }
};

export const getCurrentUser = (req, res, next) => {
  try {
    const user = authService.getCurrentUser(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

export const getDashboardStats = (req, res, next) => {
  try {
    const data = authService.getDashboardStats();
    res.json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};
