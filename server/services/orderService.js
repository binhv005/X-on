import { orderRepository } from '../repositories/orderRepository.js';
import { productRepository } from '../repositories/productRepository.js';

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
    const order = orderRepository.findById(id);
    if (!order) {
      throw new Error(`Order not found: ${id}`);
    }

    const updates = {};
    if (status) updates.status = status;
    if (payment_status) updates.payment_status = payment_status;
    if (tracking) {
      updates.shipping_metadata = {
        ...(order?.shipping_metadata || {}),
        tracking
      };
    }

    // Restore stock if order is cancelled
    if (status && status.toLowerCase() === 'cancelled' && order.status?.toLowerCase() !== 'cancelled') {
      if (Array.isArray(order.line_items)) {
        order.line_items.forEach(item => {
          const product = (item.id ? productRepository.findById(item.id) : null) ||
                          (item.sku ? productRepository.findBySKU(item.sku) : null);
          if (product) {
            const currentStock = typeof product.stock === 'number' ? product.stock : parseInt(product.stock, 10) || 0;
            const qty = parseInt(item.quantity, 10) || 1;
            const restoredStock = currentStock + qty;
            const statusUpdate = product.status === 'out_of_stock' && restoredStock > 0 ? 'active' : product.status;

            let restoredSizeStock = product.size_stock;
            if (item.selectedSize && product.size_stock && typeof product.size_stock === 'object') {
              restoredSizeStock = { ...product.size_stock };
              const curSizeQty = typeof restoredSizeStock[item.selectedSize] === 'number' 
                ? restoredSizeStock[item.selectedSize] 
                : parseInt(restoredSizeStock[item.selectedSize], 10) || 0;
              restoredSizeStock[item.selectedSize] = curSizeQty + qty;
            }

            productRepository.update(product.id, {
              stock: restoredStock,
              size_stock: restoredSizeStock,
              status: statusUpdate
            });
          }
        });
      }
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

    // Validate inventory stock availability before order creation
    for (const item of line_items) {
      const product = (item.id ? productRepository.findById(item.id) : null) ||
                      (item.sku ? productRepository.findBySKU(item.sku) : null);
      if (product) {
        let availableStock = typeof product.stock === 'number' ? product.stock : parseInt(product.stock, 10) || 0;
        if (item.selectedSize && product.size_stock && typeof product.size_stock === 'object' && product.size_stock[item.selectedSize] !== undefined) {
          availableStock = typeof product.size_stock[item.selectedSize] === 'number'
            ? product.size_stock[item.selectedSize]
            : parseInt(product.size_stock[item.selectedSize], 10) || 0;
        }
        const requestedQty = parseInt(item.quantity, 10) || 1;
        if (requestedQty > availableStock) {
          throw new Error(`Item "${product.name}"${item.selectedSize ? ` (Size: ${item.selectedSize})` : ''} only has ${availableStock} in stock. Please reduce quantity.`);
        }
      }
    }

    // Automatically deduct inventory stock for each purchased item
    line_items.forEach(item => {
      const product = (item.id ? productRepository.findById(item.id) : null) ||
                      (item.sku ? productRepository.findBySKU(item.sku) : null);
      if (product) {
        const currentStock = typeof product.stock === 'number' ? product.stock : parseInt(product.stock, 10) || 0;
        const qty = parseInt(item.quantity, 10) || 1;
        const newStock = Math.max(0, currentStock - qty);
        const statusUpdate = newStock === 0 ? 'out_of_stock' : product.status;

        let updatedSizeStock = product.size_stock;
        if (item.selectedSize && product.size_stock && typeof product.size_stock === 'object') {
          updatedSizeStock = { ...product.size_stock };
          const curSizeQty = typeof updatedSizeStock[item.selectedSize] === 'number' 
            ? updatedSizeStock[item.selectedSize] 
            : parseInt(updatedSizeStock[item.selectedSize], 10) || 0;
          updatedSizeStock[item.selectedSize] = Math.max(0, curSizeQty - qty);
        }

        productRepository.update(product.id, {
          stock: newStock,
          size_stock: updatedSizeStock,
          status: statusUpdate
        });
      }
    });

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
