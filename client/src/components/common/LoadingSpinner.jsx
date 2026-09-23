import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ text = 'Loading...', size = 28 }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      padding: '3rem 1rem',
      color: 'var(--accent-gold)'
    }}>
      <Loader2 size={size} style={{ animation: 'spin 1s linear infinite' }} />
      <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{text}</span>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
