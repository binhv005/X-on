import { db } from '../config/db.js';

export const submitInquiry = (req, res, next) => {
  try {
    const { name, email, order_number, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, Email, and Message are required.' });
    }

    const newInquiry = db.insert('inquiries', {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      order_number: order_number ? order_number.trim() : '',
      message: message.trim(),
      status: 'new',
      note: ''
    });

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
    const { status, search } = req.query;
    let inqs = db.getCollection('inquiries');

    if (status) {
      inqs = inqs.filter(i => i.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      inqs = inqs.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.order_number.toLowerCase().includes(q) ||
        i.message.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, data: inqs });
  } catch (err) {
    next(err);
  }
};

export const updateInquiry = (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const updated = db.update('inquiries', id, { status, note });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    res.json({ success: true, message: 'Inquiry updated successfully', data: updated });
  } catch (err) {
    next(err);
  }
};
