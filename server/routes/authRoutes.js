import express from 'express';
import { login, register, getCurrentUser, getDashboardStats } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', authenticateToken, getCurrentUser);
router.get('/dashboard-stats', getDashboardStats);

export default router;
