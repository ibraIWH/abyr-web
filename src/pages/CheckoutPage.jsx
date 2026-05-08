import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { C, F, Ser } from "../designTokens";

const initialAddresses = () =>
  JSON.parse(localStorage.getItem("savedAddresses") || "[]");

export default function CheckoutPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cart, setCart] = useState(
    JSON.parse(sessionStorage.getItem("cart") || "[]")
  );
  const [addresses, setAddresses] = useState(initialAddresses);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    line1: "",
    city: "",
    phone: "",
  });

  // ---------- GUARD: not signed in ----------
  if (!user) {
    return (
      <div
        style={{
          background: C.sand,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 40,
          }}
        >
          <div style={{ ...Ser(28, 300, C.ink), marginBottom: 12 }}>
            Sign in to continue
          </div>
          <div style={{ ...F(12, 400, "#888"), marginBottom: 24 }}>
            You need an account to place an order.
          </div>
          <Link
            to={`/signin?redirect=/checkout`}
            style={{
              background: C.brandRed,
              color: C.cream,
              padding: "12px 28px",
              textDecoration: "none",
              ...F(11, 500),
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Sign In
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // ---------- GUARD: empty cart ----------
  if (cart.length === 0) {
    return (
      <div
        style={{
          background: C.sand,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar />
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 40,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ ...Ser(28, 300, C.ink), marginBottom: 12 }}>
              Your cart is empty
            </div>
            <div style={{ ...F(12, 400, "#888"), marginBottom: 24 }}>
              Add items before checking out.
            </div>
            <div
              onClick={() => navigate("/")}
              style={{
                background: C.brandRed,
                color: C.cream,
                padding: "12px 28px",
                display: "inline-block",
                cursor: "pointer",
                ...F(11, 500),
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Continue Shopping
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // address helpers
  const handleSaveAddress = () => {
    if (!newAddress.name || !newAddress.line1 || !newAddress.city) return;
    const updated = [...addresses, newAddress];
    localStorage.setItem("savedAddresses", JSON.stringify(updated));
    setAddresses(updated);
    setSelectedAddress(newAddress);
    setShowAddForm(false);
    setNewAddress({ name: "", line1: "", city: "", phone: "" });
  };

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      alert("Please select or add an address.");
      return;
    }
    const orderNumber = "ABR-" + Date.now().toString().slice(-8);
    sessionStorage.removeItem("cart");
    window.dispatchEvent(new Event("cartUpdated"));
    const order = {
      id: orderNumber,
      items: cart,
      total: total.toFixed(2),
      address: selectedAddress,
      date: new Date().toLocaleDateString(),
    };
    localStorage.setItem("lastOrder", JSON.stringify(order));
    navigate(`/payment?order=${orderNumber}`);
  };

  // ---------- inline styles helpers ----------
  const fieldStyle = {
    width: "100%",
    border: "0.5px solid #DDD",
    padding: "10px",
    marginBottom: 12,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    color: C.ink,
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        background: C.sand,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />
      <div
        style={{
          padding: "28px 64px",
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: 48,
          alignItems: "start",
        }}
      >
        {/* ---------- ADDRESS SIDE ---------- */}
        <div>
          <h1 style={{ ...Ser(28, 300, C.ink), marginBottom: 24 }}>Checkout</h1>
          <div
            style={{
              background: C.white,
              border: `0.5px solid ${C.border}`,
              padding: "28px",
            }}
          >
            <div
              style={{
                ...F(9, 500, C.tan),
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              Delivery Address
            </div>

            {/* Saved addresses */}
            {addresses.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                {addresses.map((addr, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedAddress(addr)}
                    style={{
                      border: `1px solid ${
                        selectedAddress === addr ? C.brandRed : C.border
                      }`,
                      background:
                        selectedAddress === addr ? "#F5F0E8" : C.white,
                      padding: "14px",
                      marginBottom: 8,
                      cursor: "pointer",
                      position: "relative",
                    }}
                  >
                    <div style={{ ...F(11, 500, C.ink) }}>{addr.name}</div>
                    <div
                      style={{
                        ...F(10, 400, "#888"),
                        lineHeight: 1.6,
                      }}
                    >
                      {addr.line1}, {addr.city}
                    </div>
                    {addr.phone && (
                      <div style={{ ...F(10, 400, "#888") }}>{addr.phone}</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Toggle add‑new form */}
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
                  marginBottom: 24,
                }}
              >
                + Add new address
              </div>
            ) : (
              <div style={{ marginBottom: 24 }}>
                <input
                  placeholder="Full Name"
                  value={newAddress.name}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, name: e.target.value })
                  }
                  style={fieldStyle}
                />
                <input
                  placeholder="Address Line"
                  value={newAddress.line1}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, line1: e.target.value })
                  }
                  style={fieldStyle}
                />
                <input
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                  style={fieldStyle}
                />
                <input
                  placeholder="Phone (optional)"
                  value={newAddress.phone}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, phone: e.target.value })
                  }
                  style={fieldStyle}
                />
                <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                  <button
                    onClick={handleSaveAddress}
                    style={{
                      flex: 1,
                      background: C.brandRed,
                      color: C.cream,
                      border: "none",
                      padding: "12px",
                      ...F(11, 500, C.cream),
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    Save Address
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    style={{
                      border: "0.5px solid #CCC",
                      background: "white",
                      padding: "12px",
                      ...F(11, 400, "#888"),
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Place order button */}
            <button
              onClick={handlePlaceOrder}
              disabled={!selectedAddress}
              style={{
                width: "100%",
                padding: "14px",
                background: selectedAddress ? C.brandRed : "#CCC",
                color: C.cream,
                border: "none",
                ...F(11, 500, C.cream),
                letterSpacing: 2,
                textTransform: "uppercase",
                cursor: selectedAddress ? "pointer" : "not-allowed",
                marginTop: 8,
              }}
            >
              Continue to Payment
            </button>
          </div>
        </div>

        {/* ---------- ORDER SUMMARY SIDE ---------- */}
        <div style={{ background: C.cream, padding: "24px" }}>
          <div
            style={{
              ...F(9, 500, C.tan),
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            Order Summary
          </div>
          {cart.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span style={{ ...F(10, 400, "#888") }}>
                {item.name} × {item.quantity}
              </span>
              <span style={{ ...F(10, 400, C.ink) }}>
                SAR {(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
          <div style={{ height: 1, background: "#DDD", margin: "14px 0" }} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span style={{ ...F(10, 400, "#888") }}>Delivery</span>
            <span style={{ ...F(10, 400, C.green) }}>Free</span>
          </div>
          <div
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <span style={{ ...F(14, 500, C.ink) }}>Total</span>
            <span style={{ ...Ser(20, 300, C.tan) }}>
              SAR {total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}