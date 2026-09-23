import { db } from '../config/db.js';

export const getOrders = (req, res, next) => {
  try {
    const { status, search } = req.query;
    let orders = db.getCollection('orders');

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

    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

export const getOrderById = (req, res, next) => {
  try {
    const { id } = req.params;
    const order = db.findById('orders', id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, payment_status, tracking } = req.body;
    const updates = {};
    if (status) updates.status = status;
    if (payment_status) updates.payment_status = payment_status;
    if (tracking) {
      const order = db.findById('orders', id);
      updates.shipping_metadata = {
        ...(order?.shipping_metadata || {}),
        tracking
      };
    }

    const updated = db.update('orders', id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, message: 'Order status updated successfully', data: updated });
  } catch (err) {
    next(err);
  }
};

export const createOrder = (req, res, next) => {
  try {
    const { customer, line_items, shipping = 0, payment_metadata = {}, shipping_metadata = {} } = req.body;
    if (!customer || !line_items || !line_items.length) {
      return res.status(400).json({ success: false, message: 'Customer details and line items are required' });
    }

    const subtotal = line_items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + parseFloat(shipping);
    const orderId = `XON-ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = db.insert('orders', {
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

    res.status(201).json({ success: true, message: 'Order placed successfully', data: newOrder });
  } catch (err) {
    next(err);
  }
};
