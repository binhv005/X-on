import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/userRepository.js';
import { productRepository } from '../repositories/productRepository.js';
import { orderRepository } from '../repositories/orderRepository.js';
import { wholesaleRepository } from '../repositories/wholesaleRepository.js';
import { inquiryRepository } from '../repositories/inquiryRepository.js';
import { signToken } from '../middleware/auth.js';

class AuthService {
  login(usernameOrEmail, password) {
    if (!usernameOrEmail || !password) {
      throw new Error('Username/Email and Password are required');
    }

    const user = userRepository.findByEmailOrUsername(usernameOrEmail);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = signToken(user);
    const { password_hash, ...sanitized } = user;

    return { token, user: sanitized };
  }

  register(data) {
    const { username, email, password, name } = data;

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const existingUser = userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email is already registered');
    }

    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);

    const newUser = userRepository.create({
      username: username ? username.trim() : email.split('@')[0],
      email: email.trim().toLowerCase(),
      name: name ? name.trim() : '',
      password_hash,
      role: 'customer',
      status: 'active'
    });

    const token = signToken(newUser);
    const { password_hash: _, ...sanitized } = newUser;

    return { token, user: sanitized };
  }

  getCurrentUser(userId) {
    const user = userRepository.findById(userId);
    if (!user) return null;
    const { password_hash, ...sanitized } = user;
    return sanitized;
  }

  getDashboardStats() {
    const products = productRepository.getAll();
    const orders = orderRepository.getAll();
    const users = userRepository.getAll();
    const wholesale = wholesaleRepository.getAll();
    const inquiries = inquiryRepository.getAll();

    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status === 'active').length;
    const totalOrders = orders.length;
    const totalCustomers = users.filter(u => u.role !== 'admin').length;
    const totalWholesale = wholesale.length;
    const totalInquiries = inquiries.length;

    const recentOrders = orders.slice(0, 5);
    const recentWholesale = wholesale.slice(0, 5);
    const recentInquiries = inquiries.slice(0, 5);

    return {
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
    };
  }
}

export const authService = new AuthService();
