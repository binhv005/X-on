import React, { useRef, useState, useEffect } from 'react';
import { Upload, Link2, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const MAX_SIZE = 15 * 1024 * 1024; // 15MB limit

// Preview file locally before saving, or paste direct Cloudinary/HTTPS link
export default function ImageInput({ value = '', onChange, label = 'Image', required = false, onFileChange }) {
  const { addToast } = useToast();
  const fileRef = useRef(null);
  const [mode, setMode] = useState('link');
  const [dragOver, setDragOver] = useState(false);
  const [localPreview, setLocalPreview] = useState('');
  const [fileName, setFileName] = useState('');

  // Cleanup object URL on unmount or when localPreview changes
  useEffect(() => {
    return () => {
      if (localPreview && localPreview.startsWith('blob:')) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  const discardPending = () => {
    if (localPreview && localPreview.startsWith('blob:')) {
      URL.revokeObjectURL(localPreview);
    }
    setLocalPreview('');
    setFileName('');
    onFileChange?.(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const selectFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addToast('Only image files are allowed (jpg, png, webp, gif).', 'error');
      return;
    }
    if (file.size > MAX_SIZE) {
      addToast('Image must be under 15MB.', 'error');
      return;
    }
    if (localPreview && localPreview.startsWith('blob:')) {
      URL.revokeObjectURL(localPreview);
    }
    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);
    setFileName(file.name);
    onFileChange?.(file);
  };

  const handleLinkChange = (v) => {
    discardPending();
    onChange(v);
  };

  const handleClear = () => {
    discardPending();
    onChange('');
  };

  const preview = localPreview || value;

  return (
    <div className="form-group">
      <label className="form-label">{label} {required && '*'}</label>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <button
          type="button"
          onClick={() => setMode('link')}
          className={`btn btn-sm ${mode === 'link' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Link2 size={13} /> Paste link
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`btn btn-sm ${mode === 'upload' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Upload size={13} /> Upload device
        </button>
      </div>

      {mode === 'link' ? (
        <input
          type="text"
          className="form-input"
          value={value}
          onChange={(e) => handleLinkChange(e.target.value)}
          placeholder="https://... or /assets/images/..."
          required={required}
        />
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); selectFile(e.dataTransfer.files?.[0]); }}
          onClick={() => fileRef.current?.click()}
          style={{
            border: `1.5px dashed ${dragOver ? 'var(--accent-gold)' : 'var(--border-subtle)'}`,
            borderRadius: '8px',
            padding: '1rem',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragOver ? 'rgba(179,135,40,0.06)' : 'var(--bg-secondary)'
          }}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => selectFile(e.target.files?.[0])}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            <Upload size={16} /> Click or drag & drop image here (max 5MB)
          </div>
        </div>
      )}

      {preview ? (
        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <div style={{ width: '120px', height: '80px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-subtle)', flexShrink: 0, background: '#111' }}>
            <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.opacity = '0.3'; }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-start' }}>
            {localPreview && (
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-gold-dark)', background: 'rgba(179,135,40,0.12)', border: '1px solid var(--border-gold)', borderRadius: '999px', padding: '0.15rem 0.6rem', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                New{fileName ? `: ${fileName}` : ''}
              </span>
            )}
            <button type="button" className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }} onClick={handleClear}>
              <X size={12} /> Clear
            </button>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          <ImageIcon size={14} /> No image selected
        </div>
      )}
    </div>
  );
}
