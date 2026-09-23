import { db } from '../config/db.js';

export const getUsers = (req, res, next) => {
  try {
    const { role, status, search } = req.query;
    let users = db.getCollection('users');

    if (role) {
      users = users.filter(u => u.role === role);
    }
    if (status) {
      users = users.filter(u => u.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      users = users.filter(u =>
        (u.username && u.username.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.name && u.name.toLowerCase().includes(q))
      );
    }

    // Omit password hashes
    const sanitized = users.map(({ password_hash, ...u }) => u);
    res.json({ success: true, data: sanitized });
  } catch (err) {
    next(err);
  }
};

export const updateUserStatus = (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, role } = req.body;
    const updates = {};
    if (status) updates.status = status;
    if (role) updates.role = role;

    const updated = db.update('users', id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { password_hash, ...sanitized } = updated;
    res.json({ success: true, message: 'User updated successfully', data: sanitized });
  } catch (err) {
    next(err);
  }
};
