import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { C, F, Ser } from "../designTokens";
import MegaMenu from "./MegaMenu";
import ModernSearch from "./ModernSearch";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);   // ← new state
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = () => {
    logout();
  };

  return (
    <div
      style={{
        position: "sticky",
        top: "28px",
        left: 0,
        width: "100%",
        zIndex: 1000,
        transition: "all 0.3s ease",
        background: scrolled ? C.sand : "transparent",
        boxShadow: scrolled ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
      }}
    >
      <div
        style={{
          padding: "0 48px",
          height: 52,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <Link to="/" style={{ ...Ser(28, 300, C.ink), textDecoration: "none" }}>
            abyr
          </Link>
        </div>

        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {/* SHOP button that toggles the mega menu */}
          <div
            onClick={() => setMegaOpen(!megaOpen)}
            style={{
              ...F(10, 400, C.ink),
              cursor: "pointer",
              letterSpacing: 1,
            }}
          >
            SHOP
          </div>
          <ModernSearch />
          <Link to="/favourites" style={{ ...F(10, 400, C.ink), textDecoration: "none" }}>FAV</Link>
          <Link to="/cart" style={{ position: "relative", ...F(10, 400, C.ink), textDecoration: "none" }}>
            CART
            {cartCount > 0 && (
              <span style={{ fontSize: 9, background: C.brandRed, color: C.cream, borderRadius: "50%", padding: "1px 5px", marginLeft: 4 }}>
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <>
              <Link to="/account" style={{ ...F(10, 400, C.ink), textDecoration: "none" }}>{user.name.toUpperCase()}</Link>
               
            </>
          ) : (
            <Link to="/signin" style={{ ...F(10, 400, C.ink), textDecoration: "none" }}>SIGN IN</Link>
          )}
        </div>
      </div>

      {/* MegaMenu with proper props */}
      <MegaMenu open={megaOpen} onClose={() => setMegaOpen(false)} />
    </div>
  );
}