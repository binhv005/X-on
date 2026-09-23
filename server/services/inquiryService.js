import { inquiryRepository } from '../repositories/inquiryRepository.js';

class InquiryService {
  submitInquiry(data) {
    const { name, email, order_number, message } = data;

    if (!name || !name.trim()) {
      const err = new Error('First & Last Name is required.');
      err.status = 400;
      throw err;
    }

    if (!email || !email.trim()) {
      const err = new Error('Email Address is required.');
      err.status = 400;
      throw err;
    }

    const emailNorm = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(emailNorm)) {
      const err = new Error('Please enter a valid Email Address.');
      err.status = 400;
      throw err;
    }

    if (!message || !message.trim()) {
      const err = new Error('Message is required.');
      err.status = 400;
      throw err;
    }

    if (message.trim().length < 10) {
      const err = new Error('Message should be at least 10 characters so our artists can help you better.');
      err.status = 400;
      throw err;
    }

    if (name.trim().length > 120) {
      const err = new Error('Name is too long (max 120 characters).');
      err.status = 400;
      throw err;
    }

    return inquiryRepository.create({
      name: name.trim(),
      email: emailNorm,
      order_number: order_number ? order_number.trim().slice(0, 80) : '',
      message: message.trim().slice(0, 5000),
      status: 'new',
      note: ''
    });
  }

  getInquiries(filters = {}) {
    const { status, search } = filters;
    let inqs = inquiryRepository.getAll();

    if (status) {
      inqs = inqs.filter(i => i.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      inqs = inqs.filter(i =>
        (i.name || '').toLowerCase().includes(q) ||
        (i.email || '').toLowerCase().includes(q) ||
        (i.order_number || '').toLowerCase().includes(q) ||
        (i.message || '').toLowerCase().includes(q)
      );
    }

    return inqs;
  }

  updateInquiry(id, data) {
    const { status, note } = data;
    return inquiryRepository.update(id, { status, note });
  }
}

export const inquiryService = new InquiryService();
