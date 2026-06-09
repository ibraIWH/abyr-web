import { useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from '../components/EmptyState';
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { C, Cap, F, Ser } from "../designTokens";

export default function CartPage() {
  const [cart, setCart] = useState(JSON.parse(sessionStorage.getItem("cart") || "[]"));

  const updateQuantity = (index, delta) => {
    const newCart = [...cart];
    newCart[index].quantity += delta;
    if (newCart[index].quantity < 1) newCart[index].quantity = 1;
    setCart(newCart);
    sessionStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    sessionStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!loading && cart.length === 0) {
    return <EmptyState title="Your cart is empty" message="Looks like you haven't added anything yet." icon="🛒" showShopButton={true} />;
  }

  if (cart.length === 0) {
    return (
      <div style={{ background: C.sand, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
          <div style={{ ...Ser(28, 300, C.ink), marginBottom: 12 }}>Your Cart is Empty</div>
          <div style={{ ...F(12, 400, "#888"), marginBottom: 24 }}>Add products to get started.</div>
          <Link to="/" style={{ background: C.brandRed, color: C.cream, padding: "12px 28px", textDecoration: "none", ...F(11, 500), letterSpacing: 2, textTransform: "uppercase" }}>
            Shop Now
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ background: C.sand, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ padding: "28px 64px", display: "grid", gridTemplateColumns: "1fr 340px", gap: 48, alignItems: "start" }}>
        {/* Cart Items */}
        <div>
          <h1 style={{ ...Ser(28, 300, C.ink), marginBottom: 24 }}>Shopping Bag ({cart.length})</h1>
          {cart.map((item, index) => (
            <div key={index} style={{ display: "flex", gap: 18, paddingBottom: 20, marginBottom: 20, borderBottom: `0.5px solid ${C.border}` }}>
              <div style={{ width: 90, height: 110, background: "#EDE8E0", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} style={{ maxHeight: "100%", maxWidth: "100%" }} />
                ) : (
                  <svg width="28" height="56" viewBox="0 0 80 180" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5">
                    <path d="M40 10 C24 10 16 24 16 36 L8 44 L0 44 L0 160 L80 160 L80 44 L72 44 L64 36 C64 24 56 10 40 10Z"/>
                  </svg>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ ...F(12, 500, C.ink) }}>{item.name}</div>
                  <span onClick={() => removeItem(index)} style={{ cursor: "pointer", fontSize: 16, color: "#CCC" }}>×</span>
                </div>
                <div style={{ ...F(10, 400, "#888"), marginBottom: 12 }}>
                  {item.size} · Qty: {item.quantity}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ ...Ser(16, 300, C.tan) }}>SAR {parseFloat(item.price).toFixed(2)}</div>
                  <div style={{ display: "flex", border: `0.5px solid ${C.border}` }}>
                    <div onClick={() => updateQuantity(index, -1)} style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", ...F(14, 400, "#888") }}>−</div>
                    <div style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", ...F(11, 400, C.ink) }}>{item.quantity}</div>
                    <div onClick={() => updateQuantity(index, 1)} style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", ...F(14, 400, "#888"), borderLeft: `0.5px solid ${C.border}` }}>+</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div style={{ background: C.cream, padding: "24px" }}>
          <div style={{ ...Cap(C.tan), marginBottom: 18 }}>Order Summary</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ ...F(11, 400, "#888") }}>Subtotal</span>
            <span style={{ ...F(11, 400, C.ink) }}>SAR {total.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ ...F(11, 400, "#888") }}>Delivery</span>
            <span style={{ ...F(11, 400, C.green) }}>Free</span>
          </div>
          <div style={{ height: 1, background: "#DDD", margin: "14px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <span style={{ ...F(13, 500, C.ink) }}>Total</span>
            <span style={{ ...Ser(20, 300, C.tan) }}>SAR {total.toFixed(2)}</span>
          </div>
          <Link to="/checkout" style={{ background: C.brandRed, color: C.cream, padding: "14px", textAlign: "center", display: "block", textDecoration: "none", ...F(11, 500, C.cream), letterSpacing: 2, textTransform: "uppercase" }}>
            Proceed to Checkout
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}