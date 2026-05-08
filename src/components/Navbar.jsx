import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { C, F, Ser } from "../designTokens";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    const cart = JSON.parse(sessionStorage.getItem("cart") || "[]");
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
  };

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("cart");
    window.dispatchEvent(new Event("cartUpdated"));
    setUser(null);
    window.location.href = "/";
  };

  return (
    <div style={{ borderBottom: `0.5px solid ${C.border}`, background: C.sand }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 48px", height: 52 }}>
        <Link to="/" style={{ ...Ser(28, 300, C.ink), textDecoration: "none" }}>
          abyr
        </Link>

        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {user ? (
            <>
              <Link to="/account" style={{ ...F(10, 400, C.ink), textDecoration: "none" }}>
                {user.name.toUpperCase()}
              </Link>
              <span
                onClick={handleSignOut}
                style={{ ...F(10, 400, C.red), cursor: "pointer", textDecoration: "underline" }}
              >
                SIGN OUT
              </span>
            </>
          ) : (
            <Link to="/signin" style={{ ...F(10, 400, C.ink), textDecoration: "none" }}>
              SIGN IN
            </Link>
          )}

          <Link to="/cart" style={{ position: "relative", ...F(10, 400, C.ink), textDecoration: "none" }}>
            CART
            {cartCount > 0 && (
              <span style={{ fontSize: 9, background: C.brandRed, color: C.cream, borderRadius: "50%", padding: "1px 5px", marginLeft: 4 }}>
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}