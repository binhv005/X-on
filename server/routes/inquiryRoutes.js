import express from 'express';
import {
  submitInquiry,
  getInquiries,
  updateInquiry
} from '../controllers/inquiryController.js';

const router = express.Router();

router.post('/', submitInquiry);
router.get('/', getInquiries);
router.put('/:id', updateInquiry);

export default router;
