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

  const handleDirectWholesaleStatusChange = async (appId, newStatus, notes) => {
    try {
      const res = await api.updateWholesaleStatus(appId, {
        status: newStatus,
        notes: notes || ''
      });
      if (res.success) {
        addToast(`Wholesale status changed to: ${newStatus}`, 'success');
        setWholesaleApps(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
      }
    } catch (err) {
      addToast(err.message || 'Status update failed', 'error');
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

  const handleDirectInquiryStatusChange = async (inqId, newStatus, note) => {
    try {
      const res = await api.updateInquiry(inqId, {
        status: newStatus,
        note: note || ''
      });
      if (res.success) {
        addToast(`Inquiry status changed to: ${newStatus}`, 'success');
        setInquiries(prev => prev.map(i => i.id === inqId ? { ...i, status: newStatus } : i));
      }
    } catch (err) {
      addToast(err.message || 'Status update failed', 'error');
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
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', minWidth: '780px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem', whiteSpace: 'nowrap' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem', whiteSpace: 'nowrap' }}>Business Name</th>
                  <th style={{ padding: '1rem', whiteSpace: 'nowrap' }}>Contact / Email</th>
                  <th style={{ padding: '1rem', whiteSpace: 'nowrap' }}>Phone</th>
                  <th style={{ padding: '1rem', whiteSpace: 'nowrap' }}>Membership</th>
                  <th style={{ padding: '1rem', whiteSpace: 'nowrap' }}>Status</th>
                  <th style={{ padding: '1rem', whiteSpace: 'nowrap', textAlign: 'right' }}>Action</th>
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
                      <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{app.business_name}</div>
                        {app.business_address && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{app.business_address}</div>
                        )}
                      </td>
                      <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                        <div style={{ color: 'var(--accent-gold-dark)', fontWeight: 600, whiteSpace: 'nowrap' }}>{app.username}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{app.email}</div>
                      </td>
                      <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>{app.phone || '—'}</td>
                      <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                        <span className="badge badge-gold" style={{ whiteSpace: 'nowrap', fontSize: '0.7rem', padding: '0.3rem 0.7rem' }}>{app.membership || 'Wholesale customer'}</span>
                      </td>
                      <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                        <select
                          value={app.status}
                          onChange={(e) => handleDirectWholesaleStatusChange(app.id, e.target.value, app.notes)}
                          style={{
                            padding: '0.35rem 0.65rem',
                            borderRadius: '4px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            cursor: 'pointer',
                            border: '1px solid var(--border-subtle)',
                            background: app.status === 'approved' ? 'rgba(5, 150, 105, 0.18)' : app.status === 'rejected' ? 'rgba(239, 68, 68, 0.18)' : 'rgba(245, 158, 11, 0.18)',
                            color: app.status === 'approved' ? '#34d399' : app.status === 'rejected' ? '#f87171' : '#fbbf24',
                            outline: 'none'
                          }}
                        >
                          <option value="pending" style={{ background: '#1c1f26', color: '#fbbf24' }}>PENDING</option>
                          <option value="approved" style={{ background: '#1c1f26', color: '#34d399' }}>APPROVED</option>
                          <option value="rejected" style={{ background: '#1c1f26', color: '#f87171' }}>REJECTED</option>
                        </select>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button
                          onClick={() => openWholesaleDrawer(app)}
                          className="btn btn-secondary btn-sm"
                          title="View details & internal notes"
                          style={{ padding: '0.45rem 0.75rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Eye size={15} />
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
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', minWidth: '780px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem', whiteSpace: 'nowrap' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem', whiteSpace: 'nowrap' }}>Sender Name</th>
                  <th style={{ padding: '1rem', whiteSpace: 'nowrap' }}>Email / Order #</th>
                  <th style={{ padding: '1rem', whiteSpace: 'nowrap' }}>Message Excerpt</th>
                  <th style={{ padding: '1rem', whiteSpace: 'nowrap' }}>Status</th>
                  <th style={{ padding: '1rem', whiteSpace: 'nowrap', textAlign: 'right' }}>Action</th>
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
                      <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'nowrap' }}>
                          <span>{inq.name}</span>
                          {inq.type === 'newsletter' && (
                            <span className="badge badge-gold" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', whiteSpace: 'nowrap' }}>VIP Newsletter</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                        <div style={{ color: 'var(--accent-gold-dark)', fontWeight: 600, whiteSpace: 'nowrap' }}>{inq.email}</div>
                        {inq.phone && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Tel: {inq.phone}</div>
                        )}
                        {inq.order_number && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Order: {inq.order_number}</div>
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
                      <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                        <select
                          value={inq.status}
                          onChange={(e) => handleDirectInquiryStatusChange(inq.id, e.target.value, inq.note)}
                          style={{
                            padding: '0.35rem 0.65rem',
                            borderRadius: '4px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            cursor: 'pointer',
                            border: '1px solid var(--border-subtle)',
                            background: inq.status === 'resolved' ? 'rgba(5, 150, 105, 0.18)' : inq.status === 'in_review' ? 'rgba(245, 158, 11, 0.18)' : 'rgba(148, 163, 184, 0.18)',
                            color: inq.status === 'resolved' ? '#34d399' : inq.status === 'in_review' ? '#fbbf24' : '#cbd5e1',
                            outline: 'none'
                          }}
                        >
                          <option value="new" style={{ background: '#1c1f26', color: '#cbd5e1' }}>NEW</option>
                          <option value="in_review" style={{ background: '#1c1f26', color: '#fbbf24' }}>IN REVIEW</option>
                          <option value="resolved" style={{ background: '#1c1f26', color: '#34d399' }}>RESOLVED</option>
                        </select>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button
                          onClick={() => openInquiryDrawer(inq)}
                          className="btn btn-secondary btn-sm"
                          title="View inquiry details"
                          style={{ padding: '0.45rem 0.75rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Eye size={15} />
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
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', minWidth: '780px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem', whiteSpace: 'nowrap' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem', whiteSpace: 'nowrap' }}>Username</th>
                  <th style={{ padding: '1rem', whiteSpace: 'nowrap' }}>Email</th>
                  <th style={{ padding: '1rem', whiteSpace: 'nowrap' }}>Account Role</th>
                  <th style={{ padding: '1rem', whiteSpace: 'nowrap' }}>Account Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{user.username}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{user.email}</td>
                    <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                      <span className="badge badge-gold" style={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                      <span className="badge badge-success" style={{ whiteSpace: 'nowrap' }}>{user.status}</span>
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
        maxWidth="600px"
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

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsDrawerOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={updating}>
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
        maxWidth="600px"
      >
        {selectedInquiry && (
          <form onSubmit={handleUpdateInquiry} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div><strong>Sender:</strong> {selectedInquiry.name}</div>
              <div><strong>Email:</strong> {selectedInquiry.email}</div>
              {selectedInquiry.phone && <div><strong>Phone:</strong> {selectedInquiry.phone}</div>}
              <div><strong>Type:</strong> {selectedInquiry.type === 'newsletter' ? 'VIP Newsletter Subscription' : 'General Contact'}</div>
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

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsDrawerOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={updating}>
                {updating ? 'Saving...' : 'Update Inquiry Status'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
