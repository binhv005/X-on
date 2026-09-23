import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  ShoppingCart,
  Users,
  Building2,
  Mail,
  Sparkles,
  PlusCircle,
  FileText,
  Eye,
  ArrowRight
} from 'lucide-react';
import { api } from '../../../services/api';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const res = await api.getDashboardStats();
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Aggregating X-ON management metrics..." />;
  }

  const kpis = stats?.kpis || {
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalWholesale: 0,
    totalInquiries: 0
  };

  return (
    <div>
      {/* Header & Quick Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
        <div>
          <span className="brand-line">Executive Overview</span>
          <h1 className="font-heading" style={{ fontSize: '1.9rem', color: '#fff', margin: '0.25rem 0' }}>
            Operations & Catalog Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Real-time storefront metrics, incoming wholesale registrations, and customer inquiries.
          </p>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/admin/products?action=add')}
            className="btn btn-primary btn-sm"
          >
            <PlusCircle size={15} /> Add Product
          </button>
          <button
            onClick={() => navigate('/admin/blog-gallery?tab=blog&action=add')}
            className="btn btn-secondary btn-sm"
          >
            <FileText size={15} /> Add Blog Post
          </button>
          <button
            onClick={() => navigate('/admin/blog-gallery?tab=gallery&action=add')}
            className="btn btn-secondary btn-sm"
          >
            <Sparkles size={15} /> Add Gallery Item
          </button>
          <button
            onClick={() => navigate('/admin/content')}
            className="btn btn-outline btn-sm"
          >
            Edit Home Content
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Total Products</span>
            <Package size={20} color="var(--accent-gold)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>
            {kpis.totalProducts}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--accent-gold-light)' }}>
            {kpis.activeProducts} Active in Catalog
          </span>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Total Orders</span>
            <ShoppingCart size={20} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>
            {kpis.totalOrders}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#38bdf8' }}>Storefront Orders</span>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Wholesale Apps</span>
            <Building2 size={20} color="#a855f7" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>
            {kpis.totalWholesale}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#a855f7' }}>Salon & Spa Partners</span>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Contact Inquiries</span>
            <Mail size={20} color="#34d399" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>
            {kpis.totalInquiries}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#34d399' }}>Customer Inquiries</span>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Registered Users</span>
            <Users size={20} color="#f4acb7" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>
            {kpis.totalCustomers}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#f4acb7' }}>Customer Profiles</span>
        </div>
      </div>

      {/* Grid: Recent Orders + Recent Inquiries & Wholesale */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {/* Recent Orders Table */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 className="font-heading" style={{ fontSize: '1.15rem', color: '#fff' }}>Recent Storefront Orders</h3>
            <Link to="/admin/orders" style={{ fontSize: '0.82rem', color: 'var(--accent-gold-light)', display: 'flex', alignItems: 'center', gap: '3px' }}>
              View All <ArrowRight size={13} />
            </Link>
          </div>

          {stats?.recentOrders && stats.recentOrders.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>Order ID</th>
                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>Customer</th>
                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>Total</th>
                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--accent-gold-light)' }}>{order.id}</td>
                      <td style={{ padding: '0.75rem', color: '#fff' }}>{order.customer?.name}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>${order.total?.toFixed(2)}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>{order.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No recent orders.</p>
          )}
        </div>

        {/* Recent Wholesale Applications */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 className="font-heading" style={{ fontSize: '1.15rem', color: '#fff' }}>Recent Wholesale Applications</h3>
            <Link to="/admin/users" style={{ fontSize: '0.82rem', color: 'var(--accent-gold-light)', display: 'flex', alignItems: 'center', gap: '3px' }}>
              View All <ArrowRight size={13} />
            </Link>
          </div>

          {stats?.recentWholesale && stats.recentWholesale.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats.recentWholesale.map(app => (
                <div key={app.id} style={{ padding: '0.75rem 1rem', borderRadius: '6px', background: 'var(--bg-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-subtle)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>{app.business_name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{app.email} · {app.phone}</div>
                  </div>
                  <span className={`badge ${app.status === 'approved' ? 'badge-success' : 'badge-gold'}`} style={{ fontSize: '0.7rem' }}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No wholesale applications yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
