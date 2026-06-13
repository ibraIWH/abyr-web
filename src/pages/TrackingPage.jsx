import { useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import { C, F, Ser } from "../designTokens";

const steps = [
  { label: "Order Placed", time: "Just now", done: true },
  { label: "Confirmed", time: "—", done: false },
  { label: "Shipped", time: "—", done: false },
  { label: "Delivered", time: "—", done: false },
];

export default function TrackingPage() {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("order") || "ABR-00000000";

  return (
    <Layout>
    <div style={{ background: C.sand, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, padding: "32px 64px" }}>
        <div onClick={() => window.history.back()} style={{ ...F(10, 400, "#888"), cursor: "pointer", marginBottom: 18 }}>← Back to My Orders</div>
        <div style={{ ...Ser(28, 300, C.ink), marginBottom: 4 }}>Order {orderNumber}</div>
        <div style={{ ...F(11, 400, "#888"), marginBottom: 32 }}>Placed just now</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
          <div>
            <div style={{ ...Cap(C.tan), marginBottom: 20 }}>Delivery Status</div>
            {steps.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 16, marginBottom: s.done ? 0 : 24 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: s.done ? C.brandRed : "#E8E8E4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {s.done && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  {i < steps.length - 1 && <div style={{ width: 1, height: 34, background: s.done ? C.brandRed : "#E8E8E4", margin: "3px 0" }} />}
                </div>
                <div>
                  <div style={{ ...F(11, s.done ? 500 : 400, s.done ? C.ink : "#AAA"), marginBottom: 3 }}>{s.label}</div>
                  <div style={{ ...F(9, 400, "#888") }}>{s.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div style={{ ...Cap(C.tan), marginBottom: 20 }}>Order Summary</div>
            <div style={{ background: C.linen, padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ ...F(10, 400, "#888") }}>Subtotal</span>
                <span style={{ ...F(10, 400, C.ink) }}>SAR 90.00</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ ...F(10, 400, "#888") }}>Delivery</span>
                <span style={{ ...F(10, 400, C.green) }}>Free</span>
              </div>
              <div style={{ height: 1, background: "#DDD", margin: "14px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ ...F(12, 500, C.ink) }}>Total</span>
                <span style={{ ...Ser(16, 300, C.tan) }}>SAR 90.00</span>
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
  fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: c, letterSpacing: 2, textTransform: "uppercase"
});