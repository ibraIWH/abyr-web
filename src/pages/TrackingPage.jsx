import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import Layout from '../components/Layout';
import OrderStatusTimeline from '../components/OrderStatusTimeline';
import { C, F, Ser } from '../designTokens';

export default function TrackingPage() {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('order') || 'ABR-00000000';
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/track/${orderNumber}`)
      .then((res) => setOrder(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  if (loading) {
    return (
      <Layout>
        <div style={{ background: C.sand, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
            <span style={{ ...F(14, 400, '#888') }}>Loading order…</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div style={{ background: C.sand, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
            <span style={{ ...F(14, 400, '#888') }}>Order not found</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ background: C.sand, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, padding: '32px 64px' }}>
          <div onClick={() => window.history.back()} style={{ ...F(10, 400, '#888'), cursor: 'pointer', marginBottom: 18 }}>
            ← Back to My Orders
          </div>
          <div style={{ ...Ser(28, 300, C.ink), marginBottom: 4 }}>Order {order.orderNumber}</div>
          <div style={{ ...F(11, 400, '#888'), marginBottom: 32 }}>
            Placed {new Date(order.createdAt).toLocaleDateString()}
          </div>

          {/* Timeline */}
          <OrderStatusTimeline status={order.status} createdAt={order.createdAt} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginTop: 32 }}>
            {/* Order Summary */}
            <div>
              <div style={{ ...F(9, 500, C.tan), letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>
                Order Summary
              </div>
              <div style={{ background: C.cream, padding: '16px', borderRadius: 8 }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ ...F(10, 400, '#888') }}>{item.name} × {item.quantity}</span>
                    <span style={{ ...F(10, 400, C.ink) }}>
                      SAR {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div style={{ height: 1, background: '#DDD', margin: '14px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ ...F(10, 400, '#888') }}>Subtotal</span>
                  <span style={{ ...F(10, 400, C.ink) }}>SAR {order.subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ ...F(10, 400, '#888') }}>Delivery</span>
                  <span style={{ ...F(10, 400, order.deliveryFee === 0 ? C.green : C.ink) }}>
                    {order.deliveryFee === 0 ? 'Free' : `SAR ${order.deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div style={{ height: 1, background: '#DDD', margin: '14px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ ...F(12, 500, C.ink) }}>Total</span>
                  <span style={{ ...Ser(16, 300, C.tan) }}>SAR {order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div>
                <div style={{ ...F(9, 500, C.tan), letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>
                  Delivery Address
                </div>
                <div style={{ background: C.white, padding: '16px', border: `0.5px solid ${C.border}`, borderRadius: 8 }}>
                  <div style={{ ...F(12, 500, C.ink) }}>{order.shippingAddress.name}</div>
                  <div style={{ ...F(11, 400, '#888'), lineHeight: 1.6, marginTop: 4 }}>
                    {order.shippingAddress.line1}<br />
                    {order.shippingAddress.city}
                  </div>
                  {order.shippingAddress.phone && (
                    <div style={{ ...F(11, 400, '#888'), marginTop: 4 }}>{order.shippingAddress.phone}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}