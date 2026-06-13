import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api"; // ← MISSING IMPORT
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { C, F, Ser } from "../designTokens";

const getSavedAddresses = () =>
  JSON.parse(localStorage.getItem("savedAddresses") || "[]");

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState(getSavedAddresses);
  const [selectedAddress, setSelectedAddress] = useState(
    addresses.length > 0 ? addresses[0] : null
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    line1: "",
    city: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal;

  const handleSaveAddress = () => {
    if (!newAddress.name || !newAddress.line1 || !newAddress.city) return;
    const updated = [...addresses, newAddress];
    localStorage.setItem("savedAddresses", JSON.stringify(updated));
    setAddresses(updated);
    setSelectedAddress(newAddress);
    setShowAddForm(false);
    setNewAddress({ name: "", line1: "", city: "", phone: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAddress) {
      addToast("Please select or add an address", "error");
      return;
    }
    setSubmitting(true);
    try {
      const orderData = {
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          size: item.size || "M",
        })),
        shippingAddress: selectedAddress,
        paymentMethod: "cod",
      };
      const res = await api.post("/orders", orderData);
      clearCart();
      addToast("Order placed successfully!", "success");
      navigate(`/order-confirmed?order=${res.data.orderNumber}`);
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to place order", "error");
    } finally {
      setSubmitting(false);
    }
  };
  
  if (cart.length === 0) {
    return (
      <Layout>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
          <div style={{ textAlign: "center" }}>
            <h2 style={Ser(28, 300, C.ink)}>Your cart is empty</h2>
            <Link
              to="/"
              style={{
                background: C.brandRed,
                color: C.cream,
                padding: "10px 24px",
                textDecoration: "none",
                ...F(11, 500, C.cream),
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ flex: 1, maxWidth: 1100, margin: "2rem auto", padding: "0 1rem", width: "100%" }}>
        <h1 style={{ ...Ser(28, 300, C.ink), marginBottom: 24 }}>Checkout</h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
          <form onSubmit={handleSubmit} style={{ flex: 2, minWidth: 280 }}>
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ ...F(9, 500, C.tan), letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
                Delivery Address
              </div>

              {addresses.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  {addresses.map((addr, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedAddress(addr)}
                      style={{
                        border: `1px solid ${selectedAddress === addr ? C.brandRed : C.border}`,
                        background: selectedAddress === addr ? "#F5F0E8" : C.white,
                        padding: "14px",
                        marginBottom: 8,
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ ...F(11, 500, C.ink) }}>{addr.name}</div>
                      <div style={{ ...F(10, 400, "#888"), lineHeight: 1.6 }}>
                        {addr.line1}, {addr.city}
                      </div>
                      {addr.phone && <div style={{ ...F(10, 400, "#888") }}>{addr.phone}</div>}
                    </div>
                  ))}
                </div>
              )}

              {!showAddForm ? (
                <div
                  onClick={() => setShowAddForm(true)}
                  style={{
                    border: "0.5px dashed #CCC",
                    padding: "12px",
                    textAlign: "center",
                    ...F(11, 400, C.tan),
                    cursor: "pointer",
                    letterSpacing: 1,
                    marginBottom: 16,
                  }}
                >
                  + Add new address
                </div>
              ) : (
                <div style={{ marginBottom: 16 }}>
                  <input placeholder="Full Name" value={newAddress.name}
                    onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                    style={{ ...inputStyle, marginBottom: 8 }} />
                  <input placeholder="Address Line" value={newAddress.line1}
                    onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                    style={{ ...inputStyle, marginBottom: 8 }} />
                  <input placeholder="City" value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    style={{ ...inputStyle, marginBottom: 8 }} />
                  <input placeholder="Phone (optional)" value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    style={{ ...inputStyle, marginBottom: 12 }} />
                  <div style={{ display: "flex", gap: 12 }}>
                    <button type="button" onClick={handleSaveAddress}
                      style={{ flex: 1, background: C.brandRed, color: C.cream, border: "none",
                        padding: "10px 0", ...F(10, 500, C.cream), letterSpacing: 1,
                        textTransform: "uppercase", cursor: "pointer" }}>
                      Save Address
                    </button>
                    <button type="button" onClick={() => setShowAddForm(false)}
                      style={{ border: "0.5px solid #CCC", background: "white", padding: "10px 16px",
                        ...F(10, 400, "#888"), cursor: "pointer" }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button type="submit" disabled={submitting}
              style={{
                marginTop: "1rem", width: "100%", padding: "1rem", background: C.brandRed,
                color: C.cream, border: "none", ...F(11, 500, C.cream), letterSpacing: 2,
                textTransform: "uppercase", cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.7 : 1,
              }}>
              {submitting ? "Processing..." : `Place Order – ${total.toFixed(2)} SAR`}
            </button>
          </form>

          <div style={{ flex: 1, background: C.cream, padding: "1.5rem", border: `0.5px solid ${C.border}` }}>
            <div style={{ ...Cap(C.tan), marginBottom: 18 }}>Order Summary</div>
            {cart.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between",
                marginBottom: "0.5rem", ...F(11, 400, C.ink) }}>
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
    </Layout>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: 4,
  border: "0.5px solid #E8E8E4",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 13,
  outline: "none",
  marginBottom: "0.75rem",
  display: "block",
};

const Cap = (c = C.tan) => ({
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 9,
  color: c,
  letterSpacing: 2,
  textTransform: "uppercase",
});