import { orderService } from '../services/orderService.js';

export const getOrders = (req, res, next) => {
  try {
    const orders = orderService.getOrders(req.query);
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

export const getOrderById = (req, res, next) => {
  try {
    const { id } = req.params;
    const order = orderService.getOrderById(id);
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
    const updated = orderService.updateOrderStatus(id, req.body);
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
    const newOrder = orderService.createOrder(req.body);
    res.status(201).json({ success: true, message: 'Order placed successfully', data: newOrder });
  } catch (err) {
    next(err);
  }
};
