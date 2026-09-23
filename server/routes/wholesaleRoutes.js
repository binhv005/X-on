import express from 'express';
import {
  submitWholesaleApplication,
  getWholesaleApplications,
  updateWholesaleApplicationStatus
} from '../controllers/wholesaleController.js';

const router = express.Router();

router.post('/signup', submitWholesaleApplication);
router.get('/', getWholesaleApplications);
router.put('/:id', updateWholesaleApplicationStatus);

export default router;
