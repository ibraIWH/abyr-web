import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";
import { C, F, Ser } from "../designTokens";
import { PAGE_X, useIsMobile } from "../responsive";
import MegaMenu from "./MegaMenu";
import ModernSearch from "./ModernSearch";

const toSlug = (name = "") =>
  name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useAuth();
  const { cartCount } = useCart();
  const { categories } = useSettings();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Stop the page scrolling behind the open drawer.
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  // Close the drawer if the window grows back to desktop.
  useEffect(() => {
    if (!isMobile) setDrawerOpen(false);
  }, [isMobile]);

  const linkStyle = { ...F(10, 400, C.ink), textDecoration: "none" };

  return (
    <div
      style={{
        position: "sticky",
        top: "28px",
        left: 0,
        width: "100%",
        zIndex: drawerOpen ? 1200 : 1000,
        transition: "all 0.3s ease",
        background: scrolled ? C.sand : "transparent",
        boxShadow: scrolled ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
      }}
    >
      <div
        style={{
          padding: `0 ${PAGE_X}`,
          height: 52,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        <Link to="/" style={{ ...Ser(28, 300, C.ink), textDecoration: "none" }}>
          abyr
        </Link>

        {isMobile ? (
          /* Phone: cart stays visible, everything else moves into the drawer */
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <Link to="/cart" style={{ position: "relative", ...linkStyle }}>
              CART
              {cartCount > 0 && (
                <span style={{ fontSize: 9, background: C.brandRed, color: C.cream, borderRadius: "50%", padding: "1px 5px", marginLeft: 4 }}>
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              style={{
                background: "none",
                border: "none",
                padding: 6,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              {[0, 1, 2].map((i) => (
                <span key={i} style={{ display: "block", width: 20, height: 1.5, background: C.ink }} />
              ))}
            </button>
          </div>
        ) : (
          /* Desktop: unchanged */
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <div
              onClick={() => setMegaOpen(!megaOpen)}
              style={{ ...F(10, 400, C.ink), cursor: "pointer", letterSpacing: 1 }}
            >
              SHOP
            </div>
            <ModernSearch />
            <Link to="/favourites" style={linkStyle}>FAV</Link>
            <Link to="/cart" style={{ position: "relative", ...linkStyle }}>
              CART
              {cartCount > 0 && (
                <span style={{ fontSize: 9, background: C.brandRed, color: C.cream, borderRadius: "50%", padding: "1px 5px", marginLeft: 4 }}>
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <Link to="/account" style={linkStyle}>{user.name.toUpperCase()}</Link>
            ) : (
              <Link to="/signin" style={linkStyle}>SIGN IN</Link>
            )}
          </div>
        )}
      </div>

      {/* Desktop mega menu only — the drawer covers phones */}
      {!isMobile && <MegaMenu open={megaOpen} onClose={() => setMegaOpen(false)} />}

      {/* Mobile drawer */}
      {isMobile && drawerOpen && (
        <>
          <div
            onClick={() => setDrawerOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1100 }}
          />
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "min(320px, 85vw)",
              background: C.sand,
              zIndex: 1101,
              display: "flex",
              flexDirection: "column",
              padding: "22px 24px",
              overflowY: "auto",
              boxShadow: "-8px 0 30px rgba(0,0,0,0.12)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26 }}>
              <span style={{ ...Ser(24, 300, C.ink) }}>abyr</span>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                style={{ background: "none", border: "none", fontSize: 26, lineHeight: 1, cursor: "pointer", color: C.ink }}
              >
                ×
              </button>
            </div>

            <div style={{ ...F(9, 500, C.tan), letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
              Categories
            </div>
            <div style={{ display: "flex", flexDirection: "column", marginBottom: 28 }}>
              {(categories || []).map((cat) => (
                <Link
                  key={cat._id || cat.slug}
                  to={`/category/${cat.slug || toSlug(cat.name)}`}
                  onClick={() => setDrawerOpen(false)}
                  style={{
                    ...F(13, 400, C.ink),
                    textDecoration: "none",
                    padding: "10px 0",
                    borderBottom: `0.5px solid ${C.border}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      width: 42,
                      height: 54,
                      flexShrink: 0,
                      background: C.cream,
                      overflow: "hidden",
                      display: "block",
                    }}
                  >
                    {cat.imageUrl && (
                      <img
                        src={cat.imageUrl}
                        alt=""
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "top center",
                          display: "block",
                        }}
                      />
                    )}
                  </span>
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>

            <div style={{ ...F(9, 500, C.tan), letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
              Account
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Link to="/favourites" onClick={() => setDrawerOpen(false)} style={{ ...F(13, 400, C.ink), textDecoration: "none", padding: "12px 0", borderBottom: `0.5px solid ${C.border}` }}>
                Favourites
              </Link>
              <Link to="/cart" onClick={() => setDrawerOpen(false)} style={{ ...F(13, 400, C.ink), textDecoration: "none", padding: "12px 0", borderBottom: `0.5px solid ${C.border}` }}>
                Cart{cartCount > 0 ? ` (${cartCount})` : ""}
              </Link>
              <Link
                to={user ? "/account" : "/signin"}
                onClick={() => setDrawerOpen(false)}
                style={{ ...F(13, 400, C.ink), textDecoration: "none", padding: "12px 0" }}
              >
                {user ? user.name : "Sign in"}
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}