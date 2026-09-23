import { userRepository } from '../repositories/userRepository.js';

class UserService {
  getUsers(filters = {}) {
    const { role, status, search } = filters;
    let users = userRepository.getAll();

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

    return users.map(({ password_hash, ...u }) => u);
  }

  updateUserStatus(id, data) {
    const { status, role } = data;
    const updates = {};
    if (status) updates.status = status;
    if (role) updates.role = role;

    const updated = userRepository.update(id, updates);
    if (!updated) return null;

    const { password_hash, ...sanitized } = updated;
    return sanitized;
  }
}

export const userService = new UserService();
