import React, { useState, useEffect } from 'react';
import {
  Users,
  Building2,
  Mail,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
  Edit2
} from 'lucide-react';
import { api } from '../../../services/api';
import Modal from '../../../components/common/Modal';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { useToast } from '../../../context/ToastContext';

export default function AdminUsersWholesalePage() {
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('wholesale'); // customers | wholesale | inquiries
  const [customers, setCustomers] = useState([]);
  const [wholesaleApps, setWholesaleApps] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Drawer detail states
  const [selectedWholesale, setSelectedWholesale] = useState(null);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Status/Note edit states
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [usersRes, wsRes, inqRes] = await Promise.all([
        api.getUsers({ search }),
        api.getWholesaleApplications({ search }),
        api.getInquiries({ search })
      ]);

      if (usersRes.success) setCustomers(usersRes.data);
      if (wsRes.success) setWholesaleApps(wsRes.data);
      if (inqRes.success) setInquiries(inqRes.data);
    } catch (err) {
      addToast('Failed to fetch user accounts and applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [search]);

  const openWholesaleDrawer = (app) => {
    setSelectedWholesale(app);
    setSelectedInquiry(null);
    setEditStatus(app.status);
    setEditNotes(app.notes || '');
    setIsDrawerOpen(true);
  };

  const openInquiryDrawer = (inq) => {
    setSelectedInquiry(inq);
    setSelectedWholesale(null);
    setEditStatus(inq.status);
    setEditNotes(inq.note || '');
    setIsDrawerOpen(true);
  };

  const handleUpdateWholesale = async (e) => {
    e.preventDefault();
    if (!selectedWholesale) return;
    try {
      setUpdating(true);
      const res = await api.updateWholesaleStatus(selectedWholesale.id, {
        status: editStatus,
        notes: editNotes
      });
      if (res.success) {
        addToast(`Wholesale application updated to: ${editStatus}`, 'success');
        setIsDrawerOpen(false);
        loadAllData();
      }
    } catch (err) {
      addToast(err.message || 'Update failed', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateInquiry = async (e) => {
    e.preventDefault();
    if (!selectedInquiry) return;
    try {
      setUpdating(true);
      const res = await api.updateInquiry(selectedInquiry.id, {
        status: editStatus,
        note: editNotes
      });
      if (res.success) {
        addToast(`Inquiry status updated to: ${editStatus}`, 'success');
        setIsDrawerOpen(false);
        loadAllData();
      }
    } catch (err) {
      addToast(err.message || 'Update failed', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading accounts & partner databases..." />;
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <span className="brand-line">Account & Relationship Management</span>
        <h1 className="font-heading" style={{ fontSize: '1.8rem', color: 'var(--text-primary)', margin: '0.25rem 0' }}>
          Users, Wholesale & Inquiries
        </h1>
      </div>

      {/* Tabs & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('wholesale')}
            className={`btn btn-sm ${activeTab === 'wholesale' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Building2 size={15} /> Wholesale ({wholesaleApps.length})
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`btn btn-sm ${activeTab === 'inquiries' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Mail size={15} /> Contact Inquiries ({inquiries.length})
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`btn btn-sm ${activeTab === 'customers' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Users size={15} /> Customers ({customers.length})
          </button>
        </div>

        <div style={{ position: 'relative', minWidth: '220px', maxWidth: '320px', width: '100%' }}>
          <input
            type="text"
            placeholder="Search records..."
            className="form-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem', fontSize: '0.85rem' }}
          />
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </div>

      {/* Tab 1: Wholesale Applications */}
      {activeTab === 'wholesale' && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem' }}>Business Name</th>
                  <th style={{ padding: '1rem' }}>Contact / Email</th>
                  <th style={{ padding: '1rem' }}>Phone</th>
                  <th style={{ padding: '1rem' }}>Membership</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {wholesaleApps.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No wholesale applications found.
                    </td>
                  </tr>
                ) : (
                  wholesaleApps.map(app => (
                    <tr key={app.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{app.business_name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.business_address}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ color: 'var(--accent-gold-light)' }}>{app.username}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{app.email}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>{app.phone}</td>
                      <td style={{ padding: '1rem' }}>
                        <span className="badge badge-gold">{app.membership || 'Wholesale customer'}</span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`badge ${
                          app.status === 'approved' ? 'badge-success' :
                          app.status === 'rejected' ? 'badge-sale' : 'badge-neutral'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <button
                          onClick={() => openWholesaleDrawer(app)}
                          className="btn btn-secondary btn-sm"
                        >
                          <Eye size={14} /> Review Application
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

      {/* Tab 2: Contact Inquiries */}
      {activeTab === 'inquiries' && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem' }}>Sender Name</th>
                  <th style={{ padding: '1rem' }}>Email / Order #</th>
                  <th style={{ padding: '1rem' }}>Message Excerpt</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No contact inquiries found.
                    </td>
                  </tr>
                ) : (
                  inquiries.map(inq => (
                    <tr key={inq.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{inq.name}</td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ color: 'var(--accent-gold-dark)' }}>{inq.email}</div>
                        {inq.order_number && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Order: {inq.order_number}</div>
                        )}
                      </td>
                      <td style={{ padding: '1rem', maxWidth: '300px' }}>
                        <div style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          color: 'var(--text-secondary)'
                        }}>
                          {inq.message}
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`badge ${
                          inq.status === 'resolved' ? 'badge-success' :
                          inq.status === 'in_review' ? 'badge-gold' : 'badge-neutral'
                        }`}>
                          {inq.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <button
                          onClick={() => openInquiryDrawer(inq)}
                          className="btn btn-secondary btn-sm"
                        >
                          <Eye size={14} /> View Inquiry
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

      {/* Tab 3: Customers */}
      {activeTab === 'customers' && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem' }}>Username</th>
                  <th style={{ padding: '1rem' }}>Email</th>
                  <th style={{ padding: '1rem' }}>Account Role</th>
                  <th style={{ padding: '1rem' }}>Account Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.username}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{user.email}</td>
                    <td style={{ padding: '1rem' }}>
                      <span className="badge badge-gold" style={{ textTransform: 'capitalize' }}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className="badge badge-success">{user.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Wholesale Review Centered Modal */}
      <Modal
        isOpen={isDrawerOpen && Boolean(selectedWholesale)}
        onClose={() => setIsDrawerOpen(false)}
        title="Wholesale Application Review"
        maxWidth="650px"
      >
        {selectedWholesale && (
          <form onSubmit={handleUpdateWholesale} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div><strong>Business Name:</strong> {selectedWholesale.business_name}</div>
              <div><strong>Address:</strong> {selectedWholesale.business_address}</div>
              <div><strong>Contact Email:</strong> {selectedWholesale.email}</div>
              <div><strong>Phone:</strong> {selectedWholesale.phone}</div>
              <div><strong>Membership Type:</strong> {selectedWholesale.membership}</div>
              <div><strong>Applied Date:</strong> {selectedWholesale.createdAt ? new Date(selectedWholesale.createdAt).toLocaleString() : 'N/A'}</div>
            </div>

            <div className="form-group">
              <label className="form-label">Application Status</label>
              <select
                className="form-select"
                value={editStatus}
                onChange={e => setEditStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Internal Administrator Notes</label>
              <textarea
                rows="4"
                className="form-textarea"
                value={editNotes}
                onChange={e => setEditNotes(e.target.value)}
                placeholder="Add verification notes, tax certificates, or wholesale tier limits..."
              ></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsDrawerOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={updating}>
                {updating ? 'Saving...' : 'Update Application'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Inquiry Detail Centered Modal */}
      <Modal
        isOpen={isDrawerOpen && Boolean(selectedInquiry)}
        onClose={() => setIsDrawerOpen(false)}
        title="Contact Inquiry Details"
        maxWidth="650px"
      >
        {selectedInquiry && (
          <form onSubmit={handleUpdateInquiry} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div><strong>Sender:</strong> {selectedInquiry.name}</div>
              <div><strong>Email:</strong> {selectedInquiry.email}</div>
              <div><strong>Order Reference:</strong> {selectedInquiry.order_number || 'N/A'}</div>
              <div><strong>Received:</strong> {selectedInquiry.createdAt ? new Date(selectedInquiry.createdAt).toLocaleString() : 'N/A'}</div>
            </div>

            <div style={{ padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <strong style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--accent-gold-dark)' }}>Message:</strong>
              <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {selectedInquiry.message}
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Inquiry Status</label>
              <select
                className="form-select"
                value={editStatus}
                onChange={e => setEditStatus(e.target.value)}
              >
                <option value="new">New</option>
                <option value="in_review">In Review</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Admin Response / Notes</label>
              <textarea
                rows="4"
                className="form-textarea"
                value={editNotes}
                onChange={e => setEditNotes(e.target.value)}
                placeholder="Log team responses or resolutions..."
              ></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsDrawerOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={updating}>
                {updating ? 'Saving...' : 'Update Inquiry Status'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
