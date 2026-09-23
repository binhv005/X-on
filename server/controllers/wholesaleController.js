import { db } from '../config/db.js';
import bcrypt from 'bcryptjs';

export const submitWholesaleApplication = (req, res, next) => {
  try {
    const { username, email, business_name, business_address, phone, password, membership } = req.body;

    if (!username || !email || !business_name || !business_address || !phone || !password) {
      return res.status(400).json({ success: false, message: 'All required fields must be completed.' });
    }

    // Check existing email
    const existingUser = db.findOne('users', u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);

    // Create user record
    const newUser = db.insert('users', {
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password_hash,
      role: 'wholesale_customer',
      status: 'pending_approval',
      name: business_name
    });

    // Create WholesaleApplication record
    const application = db.insert('wholesaleApplications', {
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

    res.status(201).json({
      success: true,
      message: 'Wholesale application submitted successfully! Our team will review your account credentials.',
      data: application
    });
  } catch (err) {
    next(err);
  }
};

export const getWholesaleApplications = (req, res, next) => {
  try {
    const { status, search } = req.query;
    let apps = db.getCollection('wholesaleApplications');

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

    res.json({ success: true, data: apps });
  } catch (err) {
    next(err);
  }
};

export const updateWholesaleApplicationStatus = (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updated = db.update('wholesaleApplications', id, { status, notes });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Wholesale application not found' });
    }

    // Also sync status with user if user_id linked
    if (updated.user_id) {
      db.update('users', updated.user_id, {
        status: status === 'approved' ? 'active' : status === 'rejected' ? 'inactive' : 'pending_approval'
      });
    }

    res.json({ success: true, message: 'Application updated successfully', data: updated });
  } catch (err) {
    next(err);
  }
};
