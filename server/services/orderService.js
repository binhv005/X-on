import { orderRepository } from '../repositories/orderRepository.js';

class OrderService {
  getOrders(filters = {}) {
    const { status, search } = filters;
    let orders = orderRepository.getAll();

    if (status && status !== 'all') {
      orders = orders.filter(o => o.status.toLowerCase() === status.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      orders = orders.filter(o =>
        o.id.toLowerCase().includes(q) ||
        (o.customer && o.customer.name && o.customer.name.toLowerCase().includes(q)) ||
        (o.customer && o.customer.email && o.customer.email.toLowerCase().includes(q))
      );
    }

    return orders;
  }

  getOrderById(id) {
    return orderRepository.findById(id);
  }

  updateOrderStatus(id, data) {
    const { status, payment_status, tracking } = data;
    const updates = {};
    if (status) updates.status = status;
    if (payment_status) updates.payment_status = payment_status;
    if (tracking) {
      const order = orderRepository.findById(id);
      updates.shipping_metadata = {
        ...(order?.shipping_metadata || {}),
        tracking
      };
    }

    return orderRepository.update(id, updates);
  }

  createOrder(data) {
    const { customer, line_items, shipping = 0, payment_metadata = {}, shipping_metadata = {} } = data;
    if (!customer || !line_items || !line_items.length) {
      throw new Error('Customer details and line items are required');
    }

    const subtotal = line_items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + parseFloat(shipping);
    const orderId = `XON-ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    return orderRepository.create({
      id: orderId,
      customer,
      line_items,
      subtotal,
      shipping: parseFloat(shipping),
      total,
      status: 'Processing',
      payment_status: 'Paid',
      payment_metadata,
      shipping_metadata
    });
  }
}

export const orderService = new OrderService();
