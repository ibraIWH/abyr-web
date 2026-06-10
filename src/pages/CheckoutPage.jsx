import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { C, F, Ser } from "../designTokens";

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [guestEmail, setGuestEmail] = useState("");
  const [shipping, setShipping] = useState({
    fullName: user?.name || "", address: "", city: "", phone: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal;

  const handleChange = (e) => setShipping({ ...shipping, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user && !guestEmail) { addToast("Please enter your email address", "error"); return; }
    setSubmitting(true);
    setTimeout(() => {
      clearCart();
      addToast("Order placed successfully!", "success");
      navigate(`/order-confirmed?order=ABR-${Date.now().toString().slice(-8)}`);
      setSubmitting(false);
    }, 1500);
  };

  if (cart.length === 0) {
    return (
      <Layout>
      <div style={{ background: C.sand, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
       
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
          <div style={{ textAlign: "center" }}>
            <h2 style={Ser(28, 300, C.ink)}>Your cart is empty</h2>
            <Link to="/" style={{ background: C.brandRed, color: C.cream, padding: "10px 24px", textDecoration: "none", ...F(11, 500, C.cream), letterSpacing: 2, textTransform: "uppercase" }}>Continue Shopping</Link>
          </div>
        </div>
        <Footer />
      </div>
      </Layout>
    );
  }

  return (
    <Layout>
    <div style={{ background: C.sand, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ maxWidth: 1100, margin: "2rem auto", padding: "0 1rem", width: "100%" }}>
        <h1 style={{ ...Ser(28, 300, C.ink), marginBottom: 24 }}>Checkout</h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
          <form onSubmit={handleSubmit} style={{ flex: 2, minWidth: 280 }}>
            {!user && (
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ ...F(9, 500, C.tan), letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Email for updates</div>
                <input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} required style={inputStyle} />
              </div>
            )}
            <div style={{ ...F(9, 500, C.tan), letterSpacing: 2, textTransform: "uppercase", marginBottom: 18 }}>Shipping Address</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input name="fullName" placeholder="Full Name" value={shipping.fullName} onChange={handleChange} required style={inputStyle} />
              <input name="address" placeholder="Street Address" value={shipping.address} onChange={handleChange} required style={inputStyle} />
              <input name="city" placeholder="City" value={shipping.city} onChange={handleChange} required style={inputStyle} />
              <input name="phone" placeholder="Phone" value={shipping.phone} onChange={handleChange} style={inputStyle} />
            </div>
            <button type="submit" disabled={submitting}
              style={{
                marginTop: "1.5rem", width: "100%", padding: "1rem", background: C.brandRed, color: C.cream,
                border: "none", ...F(11, 500, C.cream), letterSpacing: 2, textTransform: "uppercase",
                cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? "Processing..." : `Place Order – ${total.toFixed(2)} SAR`}
            </button>
          </form>
          <div style={{ flex: 1, background: C.cream, padding: "1.5rem", border: `0.5px solid ${C.border}` }}>
            <div style={{ ...Cap(C.tan), marginBottom: 18 }}>Order Summary</div>
            {cart.map(item => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", ...F(11, 400, C.ink) }}>
                <span>{item.name} x{item.quantity}</span>
                <span>{(item.price * item.quantity).toFixed(2)} SAR</span>
              </div>
            ))}
            <div style={{ height: 1, background: "#DDD", margin: "14px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", ...F(13, 500, C.ink), marginTop: "1rem" }}>
              <span>Total</span>
              <span style={Ser(16, 300, C.tan)}>{total.toFixed(2)} SAR</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    </Layout>
  );
}

const inputStyle = {
  width: "100%", padding: "0.75rem", borderRadius: 4,
  border: "0.5px solid #E8E8E4", fontFamily: "'DM Sans', sans-serif",
  fontSize: 13, outline: "none",
};

const Cap = (c = C.tan) => ({
  fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: c, letterSpacing: 2, textTransform: "uppercase",
});