import { db } from '../config/db.js';
import bcrypt from 'bcryptjs';
import { signToken } from '../middleware/auth.js';

export const login = (req, res, next) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({ success: false, message: 'Username/Email and Password are required' });
    }

    const q = usernameOrEmail.trim().toLowerCase();
    const user = db.findOne('users', u => u.email.toLowerCase() === q || (u.username && u.username.toLowerCase() === q));

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = signToken(user);
    const { password_hash, ...sanitized } = user;

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: sanitized
    });
  } catch (err) {
    next(err);
  }
};

export const register = (req, res, next) => {
  try {
    const { username, email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const existingUser = db.findOne('users', u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);

    const newUser = db.insert('users', {
      username: username ? username.trim() : email.split('@')[0],
      email: email.trim().toLowerCase(),
      name: name ? name.trim() : '',
      password_hash,
      role: 'customer',
      status: 'active'
    });

    const token = signToken(newUser);
    const { password_hash: _, ...sanitized } = newUser;

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: sanitized
    });
  } catch (err) {
    next(err);
  }
};

export const getCurrentUser = (req, res, next) => {
  try {
    const user = db.findById('users', req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const { password_hash, ...sanitized } = user;
    res.json({ success: true, user: sanitized });
  } catch (err) {
    next(err);
  }
};

export const getDashboardStats = (req, res, next) => {
  try {
    const products = db.getCollection('products');
    const orders = db.getCollection('orders');
    const users = db.getCollection('users');
    const wholesale = db.getCollection('wholesaleApplications');
    const inquiries = db.getCollection('inquiries');

    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status === 'active').length;
    const totalOrders = orders.length;
    const totalCustomers = users.filter(u => u.role !== 'admin').length;
    const totalWholesale = wholesale.length;
    const totalInquiries = inquiries.length;

    const recentOrders = orders.slice(0, 5);
    const recentWholesale = wholesale.slice(0, 5);
    const recentInquiries = inquiries.slice(0, 5);

    res.json({
      success: true,
      data: {
        kpis: {
          totalProducts,
          activeProducts,
          totalOrders,
          totalCustomers,
          totalWholesale,
          totalInquiries
        },
        recentOrders,
        recentWholesale,
        recentInquiries
      }
    });
  } catch (err) {
    next(err);
  }
};
