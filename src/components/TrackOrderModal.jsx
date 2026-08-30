import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { C, F, Ser } from '../designTokens';

const STATUS_META = {
  placed:    { label: 'Placed',    fg: '#5B5048', bg: '#EFEAE2' },
  confirmed: { label: 'Confirmed', fg: '#5C0A14', bg: '#F4E3E5' },
  shipped:   { label: 'Shipped',   fg: '#8A3A00', bg: '#FBE7D8' },
  delivered: { label: 'Delivered', fg: '#1B5E20', bg: '#E3F0E4' },
  cancelled: { label: 'Cancelled', fg: '#C62828', bg: '#FBE3E3' },
};

export default function TrackOrderModal({ onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    api.get('/orders')
      .then((res) => setOrders(res.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user]);

  const handleOrderClick = (orderNumber) => {
    onClose();
    navigate(`/tracking?order=${orderNumber}`);
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
          maxWidth: 480,
          width: '100%',
          maxHeight: '80vh',
          padding: '28px 24px',
          borderRadius: 12,
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
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

        <div style={{ ...Ser(28, 300, C.ink), marginBottom: 4 }}>My Orders</div>
        <div style={{ ...F(11, 400, '#888'), marginBottom: 20 }}>
          {user ? 'Click any order to track it.' : 'Sign in to see your orders.'}
        </div>

        {!user ? (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ ...F(13, 400, '#888'), marginBottom: 16 }}>
              Please sign in to view your orders.
            </div>
            <button
              onClick={() => {
                onClose();
                navigate('/signin');
              }}
              style={{
                background: C.brandRed,
                color: C.cream,
                border: 'none',
                padding: '10px 24px',
                ...F(11, 500, C.cream),
                letterSpacing: 2,
                textTransform: 'uppercase',
                cursor: 'pointer',
                borderRadius: 8,
              }}
            >
              Sign In
            </button>
          </div>
        ) : loading ? (
          <div style={{ textAlign: 'center', padding: 20, ...F(13, 400, '#888') }}>
            Loading...
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ ...F(13, 400, '#888'), marginBottom: 12 }}>
              You haven't placed any orders yet.
            </div>
            <button
              onClick={() => {
                onClose();
                navigate('/');
              }}
              style={{
                background: C.brandRed,
                color: C.cream,
                border: 'none',
                padding: '10px 24px',
                ...F(11, 500, C.cream),
                letterSpacing: 2,
                textTransform: 'uppercase',
                cursor: 'pointer',
                borderRadius: 8,
              }}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {orders.map((order) => {
              const st = STATUS_META[order.status] || STATUS_META.placed;
              return (
                <div
                  key={order._id}
                  onClick={() => handleOrderClick(order.orderNumber)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 14px',
                    borderBottom: `0.5px solid ${C.border}`,
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                    borderRadius: 6,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = C.cream)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ ...F(12, 500, C.ink) }}>
                      {order.orderNumber}
                    </div>
                    <div style={{ ...F(10, 400, '#888') }}>
                      {new Date(order.createdAt).toLocaleDateString()} · {order.items?.length || 0} items
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                    <span
                      style={{
                        background: st.bg,
                        color: st.fg,
                        padding: '3px 10px',
                        borderRadius: 4,
                        ...F(9, 500),
                        letterSpacing: 0.5,
                      }}
                    >
                      {st.label}
                    </span>
                    <span style={{ ...F(10, 400, '#888') }}>→</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}