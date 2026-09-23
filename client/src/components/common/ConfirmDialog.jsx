import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this action?',
  itemName,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  loading = false
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="480px">
      <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem auto'
        }}>
          <AlertTriangle size={28} color="#ef4444" />
        </div>
        <p style={{ color: 'var(--text-primary)', fontSize: '1.05rem', marginBottom: itemName ? '0.5rem' : '1.5rem' }}>
          {message}
        </p>
        {itemName && (
          <p style={{ color: 'var(--accent-gold-light)', fontWeight: 600, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            "{itemName}"
          </p>
        )}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
