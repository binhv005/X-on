import React, { useState, useEffect } from 'react';
import { Search, Eye, Filter, CheckCircle, Package, Truck, CreditCard } from 'lucide-react';
import { api } from '../../../services/api';
import Modal from '../../../components/common/Modal';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { useToast } from '../../../context/ToastContext';

export default function AdminOrdersPage() {
  const { addToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Selected Order Centered Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.getOrders({
        search,
        status: statusFilter
      });
      if (res.success && res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      addToast(err.message || 'Failed to fetch orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [search, statusFilter]);

  const openOrderDetail = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setTrackingNumber(order.shipping_metadata?.tracking || '');
    setIsModalOpen(true);
  };

  const handleQuickStatusChange = async (orderId, targetStatus) => {
    try {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: targetStatus } : o));
      const res = await api.updateOrderStatus(orderId, { status: targetStatus });
      if (res.success) {
        addToast(`Order ${orderId} status changed to ${targetStatus}`, 'success');
      } else {
        throw new Error(res.message || 'Failed to update order status');
      }
    } catch (err) {
      addToast(err.message || 'Error updating status', 'error');
      loadOrders();
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      setUpdatingStatus(true);
      const res = await api.updateOrderStatus(selectedOrder.id, {
        status: newStatus,
        tracking: trackingNumber
      });
      if (res.success) {
        addToast(`Order ${selectedOrder.id} status updated to ${newStatus}`, 'success');
        setSelectedOrder(res.data);
        loadOrders();
      }
    } catch (err) {
      addToast(err.message || 'Failed to update order status', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <span className="brand-line">Fulfillment & Sales</span>
        <h1 className="font-heading" style={{ fontSize: '1.8rem', color: 'var(--text-primary)', margin: '0.25rem 0' }}>
          Orders Management
        </h1>
      </div>

      {/* Toolbar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1.25rem',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        marginBottom: '1.5rem'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '550px' }}>
          <input
            type="text"
            placeholder="Search by Order ID, customer name/email..."
            className="form-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem', fontSize: '0.85rem' }}
          />
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        {/* Status Filter */}
        <select
          className="form-select"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', width: 'auto' }}
        >
          <option value="">All Order Statuses</option>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      {loading ? (
        <LoadingSpinner text="Loading orders..." />
      ) : (
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem' }}>Order ID</th>
                  <th style={{ padding: '1rem' }}>Customer</th>
                  <th style={{ padding: '1rem' }}>Total</th>
                  <th style={{ padding: '1rem' }}>Payment</th>
                  <th style={{ padding: '1rem' }}>Order Status</th>
                  <th style={{ padding: '1rem' }}>Date</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--accent-gold-light)' }}>{order.id}</td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{order.customer?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.customer?.email}</div>
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        ${order.total?.toFixed(2)}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                          {order.payment_status || 'Paid'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <select
                          value={order.status || 'Processing'}
                          onChange={(e) => handleQuickStatusChange(order.id, e.target.value)}
                          style={{
                            padding: '0.35rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            border: '1px solid',
                            cursor: 'pointer',
                            outline: 'none',
                            transition: 'all 0.2s ease',
                            background:
                              order.status === 'Completed'
                                ? '#dcfce7'
                                : order.status === 'Cancelled'
                                ? '#fee2e2'
                                : '#fef3c7',
                            color:
                              order.status === 'Completed'
                                ? '#15803d'
                                : order.status === 'Cancelled'
                                ? '#b91c1c'
                                : '#854d0e',
                            borderColor:
                              order.status === 'Completed'
                                ? '#86efac'
                                : order.status === 'Cancelled'
                                ? '#fca5a5'
                                : '#fde047',
                          }}
                        >
                          <option value="Processing" style={{ background: '#fff', color: '#854d0e' }}>Processing</option>
                          <option value="Completed" style={{ background: '#fff', color: '#15803d' }}>Completed</option>
                          <option value="Cancelled" style={{ background: '#fff', color: '#b91c1c' }}>Cancelled</option>
                        </select>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <button
                          onClick={() => openOrderDetail(order)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.4rem 0.75rem' }}
                        >
                          <Eye size={14} /> View Detail
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Centered Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Order Details: ${selectedOrder?.id}`}
        maxWidth="750px"
      >
        {selectedOrder && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Customer & Status Header */}
            <div style={{ padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <h4 className="font-heading" style={{ color: 'var(--accent-gold-dark)', marginBottom: '0.75rem' }}>
                Customer Information
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', fontSize: '0.88rem' }}>
                <div><strong>Name:</strong> {selectedOrder.customer?.name}</div>
                <div><strong>Email:</strong> {selectedOrder.customer?.email}</div>
                <div><strong>Phone:</strong> {selectedOrder.customer?.phone || 'N/A'}</div>
              </div>
            </div>

            {/* Line Items */}
            <div>
              <h4 className="font-heading" style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
                Purchased Items ({selectedOrder.line_items?.length || 0})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {selectedOrder.line_items?.map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: '6px',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Size: <strong>{item.size || 'M'}</strong> | Qty: <strong>{item.quantity}</strong>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals Summary */}
            <div style={{
              padding: '1.25rem',
              background: 'var(--bg-secondary)',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.9rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
                <span>${selectedOrder.subtotal?.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Shipping:</span>
                <span>${selectedOrder.shipping?.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                <span>Total:</span>
                <span style={{ color: 'var(--accent-gold)' }}>${selectedOrder.total?.toFixed(2)}</span>
              </div>
            </div>

            {/* Shipping & Payment Meta */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
              <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-gold-dark)', fontWeight: 600, marginBottom: '0.4rem' }}>
                  <Truck size={15} /> Shipping Metadata
                </div>
                <div><strong>Address:</strong> {selectedOrder.shipping_metadata?.address || 'Studio Pickup'}</div>
                <div><strong>Carrier:</strong> {selectedOrder.shipping_metadata?.carrier || 'USPS Priority'}</div>
                <div><strong>Tracking:</strong> {selectedOrder.shipping_metadata?.tracking || 'Pending'}</div>
              </div>

              <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-gold-dark)', fontWeight: 600, marginBottom: '0.4rem' }}>
                  <CreditCard size={15} /> Payment Reference
                </div>
                <div><strong>Method:</strong> {selectedOrder.payment_metadata?.method || 'Online Checkout'}</div>
                <div><strong>Status:</strong> {selectedOrder.payment_status || 'Paid'}</div>
              </div>
            </div>

            {/* Status Update Form */}
            <form onSubmit={handleUpdateStatus} style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
              <h4 className="font-heading" style={{ color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '1rem' }}>
                Update Fulfillment Status
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Order Status</label>
                  <select
                    className="form-select"
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value)}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Tracking Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={trackingNumber}
                    onChange={e => setTrackingNumber(e.target.value)}
                    placeholder="e.g. 94055112062134567"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={updatingStatus}
                style={{ width: '100%' }}
              >
                {updatingStatus ? 'Updating...' : 'Save Order Status'}
              </button>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}
