import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import EmptyState from '../components/EmptyState';
import Layout from '../components/Layout';
import OrderDetailModal from '../components/OrderDetailModal';
import { useAuth } from '../context/AuthContext';
import { C, F, Ser } from '../designTokens';

export default function OrdersPage({ standalone = true }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user) return;
    api.get('/orders')
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: 40, ...F(14, 400, '#888') }}>
        Please sign in to view your orders.
      </div>
    );
  }

  if (loading) {
    return <div style={{ ...F(14, 400, '#888'), padding: 40, textAlign: 'center' }}>Loading...</div>;
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        message="When you place an order, it will appear here."
        showShopButton={true}
      />
    );
  }

  const content = (
    <div style={{ padding: standalone ? '28px 64px' : '0' }}>
      <h1 style={{ ...Ser(32, 300, C.ink), marginBottom: 24 }}>My Orders</h1>
      {orders.map((order) => (
        <div
          key={order._id}
          style={{
            border: `0.5px solid ${C.border}`,
            background: C.white,
            padding: '16px',
            marginBottom: 16,
            cursor: 'pointer',
          }}
          onClick={() => setSelectedOrder(order)}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ ...F(11, 500, C.ink) }}>#{order.orderNumber}</span>
            <span style={{ ...F(10, 400, '#888') }}>
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div style={{ ...F(10, 400, '#888'), marginBottom: 4 }}>
            {order.items?.length} item(s) · {order.status}
          </div>
          <div style={{ ...Ser(16, 300, C.tan) }}>SAR {parseFloat(order.total).toFixed(2)}</div>
          <div style={{ marginTop: 8, display: 'flex', gap: 16 }}>
            <span
              onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
              style={{ ...F(10, 400, C.tan), cursor: 'pointer', letterSpacing: 1, textDecoration: 'underline' }}
            >
              View Details
            </span>
            <Link
              to={`/tracking?order=${order.orderNumber}`}
              onClick={(e) => e.stopPropagation()}
              style={{ ...F(10, 400, C.brandRed), textDecoration: 'underline', cursor: 'pointer' }}
            >
              Track Order →
            </Link>
          </div>
        </div>
      ))}

      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );

  return standalone ? (
    <Layout>
      <div style={{ background: C.sand, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {content}
      </div>
    </Layout>
  ) : (
    content
  );
}