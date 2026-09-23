import { userService } from '../services/userService.js';

export const getUsers = (req, res, next) => {
  try {
    const users = userService.getUsers(req.query);
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

export const updateUserStatus = (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = userService.updateUserStatus(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'User updated successfully', data: updated });
  } catch (err) {
    next(err);
  }
};
