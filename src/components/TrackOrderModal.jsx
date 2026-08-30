import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { C, F, Ser } from '../designTokens';

export default function TrackOrderModal({ onClose }) {
  const [orderNumber, setOrderNumber] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = orderNumber.trim();
    if (!trimmed) {
      setError('Please enter your order number');
      return;
    }
    onClose();
    navigate(`/tracking?order=${trimmed}`);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1200,
        padding: '20px',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: C.white,
          maxWidth: 420,
          width: '100%',
          padding: '32px 28px',
          borderRadius: 12,
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 12,
            right: 16,
            background: 'none',
            border: 'none',
            fontSize: 24,
            color: '#888',
            cursor: 'pointer',
          }}
        >
          ×
        </button>

        <div style={{ ...Ser(28, 300, C.ink), marginBottom: 8 }}>Track Order</div>
        <div style={{ ...F(11, 400, '#888'), marginBottom: 24 }}>
          Enter your order number to check delivery status.
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => {
              setOrderNumber(e.target.value);
              setError('');
            }}
            placeholder="e.g. ABR-123456789"
            style={{
              width: '100%',
              padding: '12px 16px',
              border: `1px solid ${error ? C.red : C.border}`,
              borderRadius: 8,
              ...F(14, 400, C.ink),
              outline: 'none',
              marginBottom: error ? 8 : 16,
              transition: 'border-color 0.15s',
            }}
            onFocus={(e) => (e.target.style.borderColor = C.gold)}
            onBlur={(e) => (e.target.style.borderColor = error ? C.red : C.border)}
          />

          {error && (
            <div style={{ ...F(11, 400, C.red), marginBottom: 16 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              background: C.brandRed,
              color: C.cream,
              border: 'none',
              borderRadius: 8,
              ...F(11, 500, C.cream),
              letterSpacing: 2,
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Track Order
          </button>
        </form>

        <div style={{ ...F(10, 400, '#888'), textAlign: 'center', marginTop: 16 }}>
          Your order number is in your confirmation email.
        </div>
      </div>
    </div>
  );
}