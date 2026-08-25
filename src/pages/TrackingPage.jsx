import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import Layout from "../components/Layout";
import { C, F, Ser } from "../designTokens";

const statusSteps = [
  { key: "placed",     label: "Order Placed", time: "" },
  { key: "confirmed",  label: "Confirmed",    time: "" },
  { key: "shipped",    label: "Shipped",      time: "" },
  { key: "delivered",  label: "Delivered",    time: "" },
];

export default function TrackingPage() {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("order") || "ABR-00000000";
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // NEW: use the dedicated tracking endpoint
    api.get(`/orders/track/${orderNumber}`)
      .then((res) => setOrder(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  if (loading) {
    return (
      <Layout>
        <div style={{ background: C.sand, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
            <span style={{ ...F(14, 400, "#888") }}>Loading order…</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div style={{ background: C.sand, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
            <span style={{ ...F(14, 400, "#888") }}>Order not found</span>
          </div>
        </div>
      </Layout>
    );
  }

  const currentStepIndex = statusSteps.findIndex((s) => s.key === order.status);

  return (
    <Layout>
      <div style={{ background: C.sand, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, padding: "32px 64px" }}>
          <div onClick={() => window.history.back()} style={{ ...F(10, 400, "#888"), cursor: "pointer", marginBottom: 18 }}>
            ← Back to My Orders
          </div>
          <div style={{ ...Ser(28, 300, C.ink), marginBottom: 4 }}>Order {order.orderNumber}</div>
          <div style={{ ...F(11, 400, "#888"), marginBottom: 32 }}>
            Placed {new Date(order.createdAt).toLocaleDateString()}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
            {/* Timeline */}
            <div>
              <div style={{ ...Cap(C.tan), marginBottom: 20 }}>Delivery Status</div>
              {statusSteps.map((step, i) => (
                <div key={step.key} style={{ display: "flex", gap: 16, marginBottom: i < statusSteps.length - 1 ? 24 : 0 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: i <= currentStepIndex ? C.brandRed : "#E8E8E4",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {i <= currentStepIndex && (
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    {i < statusSteps.length - 1 && (
                      <div
                        style={{
                          width: 1,
                          height: 34,
                          background: i < currentStepIndex ? C.brandRed : "#E8E8E4",
                          margin: "3px 0",
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <div
                      style={{
                        ...F(11, i <= currentStepIndex ? 500 : 400, i <= currentStepIndex ? C.ink : "#AAA"),
                        marginBottom: 3,
                      }}
                    >
                      {step.label}
                    </div>
                    <div style={{ ...F(9, 400, "#888") }}>
                      {i <= currentStepIndex ? new Date(order.createdAt).toLocaleDateString() : "—"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <div style={{ ...Cap(C.tan), marginBottom: 20 }}>Order Summary</div>
              <div style={{ background: C.linen, padding: "16px" }}>
                {/* Items */}
                <div style={{ marginBottom: 16 }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ ...F(10, 400, "#888") }}>{item.name} × {item.quantity}</span>
                      <span style={{ ...F(10, 400, C.ink) }}>
                        SAR {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ height: 1, background: "#DDD", margin: "14px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ ...F(10, 400, "#888") }}>Subtotal</span>
                  <span style={{ ...F(10, 400, C.ink) }}>SAR {order.subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ ...F(10, 400, "#888") }}>Delivery</span>
                  <span style={{ ...F(10, 400, order.deliveryFee === 0 ? C.green : C.ink) }}>
                    {order.deliveryFee === 0 ? "Free" : `SAR ${order.deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div style={{ height: 1, background: "#DDD", margin: "14px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ ...F(12, 500, C.ink) }}>Total</span>
                  <span style={{ ...Ser(16, 300, C.tan) }}>SAR {order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const Cap = (c = "#8B7355") => ({
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 9,
  color: c,
  letterSpacing: 2,
  textTransform: "uppercase",
});