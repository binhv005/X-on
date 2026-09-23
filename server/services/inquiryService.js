import { inquiryRepository } from '../repositories/inquiryRepository.js';

class InquiryService {
  submitInquiry(data) {
    const { name, email, phone, order_number, message, type } = data;

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

    const isNewsletter = type === 'newsletter' || (!name && !message);
    const finalName = (name && name.trim()) || (isNewsletter ? 'VIP Newsletter Subscriber' : '');
    if (!isNewsletter && !finalName) {
      const err = new Error('First & Last Name is required.');
      err.status = 400;
      throw err;
    }

    const finalMessage = (message && message.trim()) || (isNewsletter ? `Subscribed to X-ON VIP Newsletter & Updates.${phone ? ` Phone: ${phone}` : ''}` : '');
    if (!isNewsletter && finalMessage.length < 10) {
      const err = new Error('Message should be at least 10 characters so our artists can help you better.');
      err.status = 400;
      throw err;
    }

    return inquiryRepository.create({
      name: finalName.slice(0, 120),
      email: emailNorm,
      phone: phone ? phone.trim().slice(0, 40) : '',
      order_number: order_number ? order_number.trim().slice(0, 80) : '',
      message: finalMessage.slice(0, 5000),
      type: isNewsletter ? 'newsletter' : (type || 'contact'),
      status: 'new',
      note: isNewsletter ? 'Joined VIP mailing list' : ''
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
