import { inquiryRepository } from '../repositories/inquiryRepository.js';

class InquiryService {
  submitInquiry(data) {
    const { name, email, order_number, message } = data;

    if (!name || !email || !message) {
      throw new Error('Name, Email, and Message are required.');
    }

    return inquiryRepository.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      order_number: order_number ? order_number.trim() : '',
      message: message.trim(),
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
        i.name.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.order_number.toLowerCase().includes(q) ||
        i.message.toLowerCase().includes(q)
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
