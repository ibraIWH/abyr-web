import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import { C, F, Ser } from "../designTokens";

export default function PaymentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("order") || "ABR-00000000";
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" });

  const handlePay = () => {
    if (paymentMethod === "card" && (!card.number || !card.expiry || !card.cvc)) {
      alert("Please fill in card details.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(`/order-confirmed?order=${orderNumber}`);
    }, 1500);
  };

  return (
    <Layout>
    <div style={{ background: C.sand, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <div style={{ maxWidth: 500, width: "100%", background: C.white, border: `0.5px solid ${C.border}`, padding: "36px" }}>
          <div style={{ ...Ser(28, 300, C.ink), marginBottom: 24 }}>Payment</div>
          <div style={{ ...F(12, 400, "#888"), marginBottom: 24 }}>Order: {orderNumber}</div>

          {/* Payment method selector */}
          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            {['card', 'applepay', 'mada'].map(method => (
              <div
                key={method}
                onClick={() => setPaymentMethod(method)}
                style={{
                  flex: 1,
                  border: `1px solid ${paymentMethod === method ? C.brandRed : C.border}`,
                  background: paymentMethod === method ? "#F5F0E8" : "transparent",
                  padding: "10px",
                  textAlign: "center",
                  cursor: "pointer",
                  ...F(11, 400, C.ink),
                }}
              >
                {method === 'card' && '💳 Card'}
                {method === 'applepay' && '🍎 Apple Pay'}
                {method === 'mada' && '🏦 Mada'}
              </div>
            ))}
          </div>

          {paymentMethod === "card" && (
            <div>
              <input
                placeholder="Card Number"
                value={card.number}
                onChange={(e) => setCard({ ...card, number: e.target.value })}
                style={fieldStyle}
              />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                <input
                  placeholder="MM/YY"
                  value={card.expiry}
                  onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                  style={{ ...fieldStyle, marginBottom: 0 }}
                />
                <input
                  placeholder="CVC"
                  value={card.cvc}
                  onChange={(e) => setCard({ ...card, cvc: e.target.value })}
                  style={{ ...fieldStyle, marginBottom: 0 }}
                />
              </div>
            </div>
          )}

          {paymentMethod === "applepay" && (
            <div style={{ ...F(12, 400, "#888"), textAlign: "center", marginBottom: 20 }}>
              You will be redirected to Apple Pay.
            </div>
          )}

          {paymentMethod === "mada" && (
            <div style={{ ...F(12, 400, "#888"), textAlign: "center", marginBottom: 20 }}>
              Mada secure payment gateway.
            </div>
          )}

          <button
            onClick={handlePay}
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "#888" : C.brandRed,
              color: C.cream,
              border: "none",
              ...F(11, 500, C.cream),
              letterSpacing: 2,
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            {loading ? "Processing..." : `Pay with ${paymentMethod === 'card' ? 'Card' : paymentMethod === 'applepay' ? 'Apple Pay' : 'Mada'}`}
          </button>
        </div>
      </div>
      <Footer />
    </div>
    </Layout>
  );
}

const fieldStyle = {
  width: "100%",
  border: "0.5px solid #DDD",
  padding: "11px",
  marginBottom: 12,
  ...{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#1A1A1A" },
  outline: "none",
  boxSizing: "border-box",
};