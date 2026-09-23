import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage = 1, totalPages = 1, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      marginTop: '3rem',
      flexWrap: 'wrap'
    }}>
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        style={{ padding: '0.5rem 0.75rem' }}
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '6px',
            border: page === currentPage ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
            background: page === currentPage ? 'linear-gradient(135deg, #d4af37 0%, #aa8c2c 100%)' : 'var(--bg-surface-elevated)',
            color: page === currentPage ? '#0a0a0c' : 'var(--text-primary)',
            fontWeight: page === currentPage ? 700 : 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {page}
        </button>
      ))}

      <button
        className="btn btn-secondary btn-sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        style={{ padding: '0.5rem 0.75rem' }}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
