import { inquiryService } from '../services/inquiryService.js';

export const submitInquiry = (req, res, next) => {
  try {
    const newInquiry = inquiryService.submitInquiry(req.body);
    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out to X-ON. Your message has been received.',
      data: newInquiry
    });
  } catch (err) {
    next(err);
  }
};

export const getInquiries = (req, res, next) => {
  try {
    const inqs = inquiryService.getInquiries(req.query);
    res.json({ success: true, data: inqs });
  } catch (err) {
    next(err);
  }
};

export const updateInquiry = (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = inquiryService.updateInquiry(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    res.json({ success: true, message: 'Inquiry updated successfully', data: updated });
  } catch (err) {
    next(err);
  }
};
