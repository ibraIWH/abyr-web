import { C, F, Ser } from '../designTokens';

// Quick status meta (reuse from admin theme, or define here)
const STATUS_META = {
  placed:    { label: 'Placed',    fg: '#5B5048', bg: '#EFEAE2' },
  confirmed: { label: 'Confirmed', fg: '#5C0A14', bg: '#F4E3E5' },
  shipped:   { label: 'Shipped',   fg: '#8A3A00', bg: '#FBE7D8' },
  delivered: { label: 'Delivered', fg: '#1B5E20', bg: '#E3F0E4' },
  cancelled: { label: 'Cancelled', fg: '#C62828', bg: '#FBE3E3' },
};

export default function OrderDetailModal({ order, onClose }) {
  if (!order) return null;

  const st = STATUS_META[order.status] || STATUS_META.placed;
  const subtotal = order.subtotal ?? order.items?.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const delivery = order.deliveryFee ?? 0;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: C.white,
          maxWidth: 600,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px',
          border: `0.5px solid ${C.border}`,
          borderRadius: 8,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ ...Ser(24, 300, C.ink) }}>Order {order.orderNumber}</div>
            <div style={{ ...F(11, 400, '#888') }}>
              {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>
          <span
            style={{
              background: st.bg,
              color: st.fg,
              padding: '4px 12px',
              ...F(10, 500),
              borderRadius: 4,
              letterSpacing: 1,
            }}
          >
            {st.label}
          </span>
        </div>

        {/* Items */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ ...F(9, 500, C.tan), letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
            Items
          </div>
          {order.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `0.5px solid ${C.border}` }}>
              <div>
                <div style={{ ...F(12, 500, C.ink) }}>{item.name}</div>
                <div style={{ ...F(10, 400, '#888') }}>
                  {item.size && `Size ${item.size} · `}Qty {item.quantity}
                </div>
              </div>
              <div style={{ ...F(12, 400, C.ink) }}>SAR {(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', ...F(11, 400, '#888') }}>
            <span>Subtotal</span>
            <span>SAR {subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', ...F(11, 400, '#888') }}>
            <span>Delivery</span>
            <span>{delivery === 0 ? 'Free' : `SAR ${delivery.toFixed(2)}`}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTop: `0.5px solid ${C.border}` }}>
            <span style={{ ...F(13, 500, C.ink) }}>Total</span>
            <span style={{ ...Ser(18, 300, C.tan) }}>SAR {order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Shipping Address */}
        {order.shippingAddress && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ ...F(9, 500, C.tan), letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
              Delivery Address
            </div>
            <div style={{ ...F(12, 400, '#444'), lineHeight: 1.6 }}>
              {order.shippingAddress.name}<br />
              {order.shippingAddress.line1}<br />
              {order.shippingAddress.city}
              {order.shippingAddress.phone && <><br />{order.shippingAddress.phone}</>}
            </div>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '10px',
            background: C.border,
            border: 'none',
            ...F(11, 400, C.ink),
            cursor: 'pointer',
            marginTop: 8,
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}