import bcrypt from 'bcryptjs';
import { wholesaleRepository } from '../repositories/wholesaleRepository.js';
import { userRepository } from '../repositories/userRepository.js';

class WholesaleService {
  submitApplication(data) {
    const { username, email, business_name, business_address, phone, password, membership } = data;

    if (!username || !email || !business_name || !business_address || !phone || !password) {
      const err = new Error('All required fields must be completed.');
      err.status = 400;
      throw err;
    }

    const emailNorm = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(emailNorm)) {
      const err = new Error('Please enter a valid email address.');
      err.status = 400;
      throw err;
    }

    if (password.length < 6) {
      const err = new Error('Password must be at least 6 characters long.');
      err.status = 400;
      throw err;
    }

    const existingUser = userRepository.findByEmail(emailNorm);
    if (existingUser) {
      const err = new Error('An account with this email already exists.');
      err.status = 400;
      throw err;
    }

    const usernameNorm = username.trim().toLowerCase();
    const existingUsername = userRepository.getAll().find(u => (u.username || '').toLowerCase() === usernameNorm);
    if (existingUsername) {
      const err = new Error('This username is already taken.');
      err.status = 400;
      throw err;
    }

    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);

    // Create user record
    const newUser = userRepository.create({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password_hash,
      role: 'wholesale_customer',
      status: 'pending_approval',
      name: business_name
    });

    // Create WholesaleApplication record
    return wholesaleRepository.create({
      user_id: newUser.id,
      username: username.trim(),
      email: email.trim().toLowerCase(),
      business_name: business_name.trim(),
      business_address: business_address.trim(),
      phone: phone.trim(),
      membership: membership || 'Wholesale customer',
      status: 'pending',
      notes: ''
    });
  }

  getApplications(filters = {}) {
    const { status, search } = filters;
    let apps = wholesaleRepository.getAll();

    if (status) {
      apps = apps.filter(a => a.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      apps = apps.filter(a =>
        a.business_name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.username.toLowerCase().includes(q)
      );
    }

    return apps;
  }

  updateApplicationStatus(id, data) {
    const { status, notes } = data;
    const updated = wholesaleRepository.update(id, { status, notes });
    if (!updated) return null;

    if (updated.user_id) {
      userRepository.update(updated.user_id, {
        status: status === 'approved' ? 'active' : status === 'rejected' ? 'inactive' : 'pending_approval'
      });
    }

    return updated;
  }
}

export const wholesaleService = new WholesaleService();
