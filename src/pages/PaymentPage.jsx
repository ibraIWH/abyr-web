import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import { C, F, Ser } from "../designTokens";

export default function PaymentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("order") || "ABR-00000000";
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("zaad");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handlePay = () => {
    if (paymentMethod === "zaad" || paymentMethod === "edahab") {
      if (!phoneNumber || phoneNumber.length < 10) {
        alert("Please enter a valid phone number (e.g., 0651234567)");
        return;
      }
    }

    setLoading(true);
    // In production, this would call the payment API
    setTimeout(() => {
      setLoading(false);
      navigate(`/order-confirmed?order=${orderNumber}`);
    }, 1500);
  };

  const paymentMethods = [
    { value: "zaad", label: "Zaad", icon: "📱", desc: "Telesom" },
    { value: "edahab", label: "eDahab", icon: "📱", desc: "Somcable" },
    { value: "applepay", label: "Apple Pay", icon: "🍎", desc: "Apple Wallet" },
    { value: "googlepay", label: "Google Pay", icon: "🤖", desc: "Google Wallet" },
    { value: "card", label: "Card", icon: "💳", desc: "Credit/Debit" },
    { value: "paypal", label: "PayPal", icon: "💰", desc: "PayPal" },
    { value: "cod", label: "Cash on Delivery", icon: "💵", desc: "Pay on arrival" },
  ];

  return (
    <Layout>
      <div style={{ background: C.sand, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
          <div style={{ maxWidth: 520, width: "100%", background: C.white, border: `0.5px solid ${C.border}`, padding: "36px", borderRadius: 12 }}>
            <div style={{ ...Ser(28, 300, C.ink), marginBottom: 8 }}>Payment</div>
            <div style={{ ...F(12, 400, "#888"), marginBottom: 24 }}>Order: {orderNumber}</div>

            {/* Payment method selector */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 12, marginBottom: 24 }}>
              {paymentMethods.map((method) => (
                <div
                  key={method.value}
                  onClick={() => setPaymentMethod(method.value)}
                  style={{
                    border: `2px solid ${paymentMethod === method.value ? C.brandRed : C.border}`,
                    background: paymentMethod === method.value ? C.cream : "transparent",
                    padding: "12px 8px",
                    textAlign: "center",
                    cursor: "pointer",
                    borderRadius: 8,
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ fontSize: 24 }}>{method.icon}</div>
                  <div style={{ ...F(11, 500, C.ink), marginTop: 4 }}>{method.label}</div>
                  <div style={{ ...F(8, 400, "#888") }}>{method.desc}</div>
                </div>
              ))}
            </div>

            {/* Phone number input for Zaad/eDahab */}
            {(paymentMethod === "zaad" || paymentMethod === "edahab") && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ ...F(9, 500, C.tan), letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
                  Phone Number
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="065 123 4567"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: `0.5px solid ${C.border}`,
                    borderRadius: 8,
                    ...F(14, 400, C.ink),
                    outline: "none",
                  }}
                />
                <div style={{ ...F(9, 400, "#888"), marginTop: 6 }}>
                  Enter your {paymentMethod === "zaad" ? "Zaad" : "eDahab"} registered number
                </div>
                <div style={{ ...F(9, 400, C.gold), marginTop: 4 }}>
                  You will receive a payment request on this number
                </div>
              </div>
            )}

            {/* Payment method info */}
            {(paymentMethod === "applepay" || paymentMethod === "googlepay" || paymentMethod === "card" || paymentMethod === "paypal") && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ background: "#F0F7FF", padding: "12px 16px", borderRadius: 8, border: `0.5px solid #BBDEFB` }}>
                  <div style={{ ...F(10, 500, C.ink) }}>
                    {paymentMethod === "applepay" && "🍎 Apple Pay"}
                    {paymentMethod === "googlepay" && "🤖 Google Pay"}
                    {paymentMethod === "card" && "💳 Card Payment"}
                    {paymentMethod === "paypal" && "💰 PayPal"}
                  </div>
                  <div style={{ ...F(10, 400, "#888"), marginTop: 4, lineHeight: 1.6 }}>
                    You'll be redirected to complete your payment securely.
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "cod" && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ background: "#FFF8E1", padding: "12px 16px", borderRadius: 8, border: `0.5px solid #FFE082` }}>
                  <div style={{ ...F(10, 500, C.ink) }}>💵 Cash on Delivery</div>
                  <div style={{ ...F(10, 400, "#888"), marginTop: 4, lineHeight: 1.6 }}>
                    Pay in cash when your order arrives. No payment needed now.
                  </div>
                </div>
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
                borderRadius: 8,
                ...F(11, 500, C.cream),
                letterSpacing: 2,
                textTransform: "uppercase",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Processing..." : `Pay with ${paymentMethod === "zaad" ? "Zaad" : paymentMethod === "edahab" ? "eDahab" : paymentMethod === "applepay" ? "Apple Pay" : paymentMethod === "googlepay" ? "Google Pay" : paymentMethod === "card" ? "Card" : paymentMethod === "paypal" ? "PayPal" : "Cash"}`}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}