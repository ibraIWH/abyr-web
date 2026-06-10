import { Link, useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import { C, F, Ser } from "../designTokens";

export default function OrderConfirmedPage() {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("order") || "ABR-00000000";

  return (
    <Layout>
    <div style={{ background: C.sand, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
        <div style={{ width: 80, height: 80, border: "1px solid #5A8F5A", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#5A8F5A" strokeWidth="1.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div style={{ ...Ser(36, 300, C.ink), marginBottom: 8 }}>Order Confirmed</div>
        <div style={{ ...F(12, 400, "#888"), lineHeight: 1.8, marginBottom: 32 }}>
          Thank you for your order.<br />We'll send a confirmation to your email.
        </div>
        <div style={{ background: C.linen, padding: "20px 32px", marginBottom: 8 }}>
          <div style={{ ...F(9, 500, C.tan), letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Order Number</div>
          <div style={{ ...Ser(22, 300, C.tan), letterSpacing: 3 }}>{orderNumber}</div>
        </div>
        <div style={{ ...F(10, 400, "#888"), marginBottom: 28 }}>Estimated delivery: 3 – 5 business days</div>
        <div style={{ display: "flex", gap: 12 }}>
          <Link to={`/tracking?order=${orderNumber}`} style={{ background: C.brandRed, color: C.cream, padding: "13px 28px", textDecoration: "none", ...F(11, 500), letterSpacing: 2, textTransform: "uppercase" }}>
            Track Order
          </Link>
          <Link to="/" style={{ border: `0.5px solid ${C.brandRed}`, padding: "13px 24px", textDecoration: "none", ...F(11, 400, C.brandRed), letterSpacing: 3, textTransform: "uppercase" }}>
            Continue Shopping
          </Link>
        </div>
      </div>
      <Footer />
    </div>
    </Layout>
  );
}