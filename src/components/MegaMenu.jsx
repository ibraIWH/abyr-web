import { Link } from "react-router-dom";
import { C, F, Ser } from "../designTokens";

const categories = [
  "Summer Discounts", "Trendy Abayas", "Winter Abayas", "Black Abayas",
  "Daily Abayas", "Work Abayas", "Event Abayas", "Bisht",
  "Jalabiya", "Niqab", "Gloves", "School",
];

export default function MegaMenu({ open, onClose }) {
  if (!open) return null;

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", zIndex: 998 }} />
      <div style={{
        position: "absolute", top: "100%", left: 0, right: 0,
        background: C.white, borderBottom: `0.5px solid ${C.border}`,
        boxShadow: "0 12px 30px rgba(0,0,0,0.08)", zIndex: 999,
        padding: "28px 64px 32px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", gap: 64, alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ ...F(9, 500, C.tan), letterSpacing: 2, textTransform: "uppercase", marginBottom: 18 }}>Categories</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))", columnGap: 32, rowGap: 12 }}>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  to={`/category/${cat.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={onClose}
                  style={{ textDecoration: "none", ...F(12, 400, C.ink), lineHeight: 2, transition: "color 0.15s", whiteSpace: "nowrap" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = C.brandRed}
                  onMouseLeave={(e) => e.currentTarget.style.color = C.ink}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
          <div style={{ width: 240, borderLeft: `0.5px solid ${C.border}`, paddingLeft: 32 }}>
            <div style={{ ...F(9, 500, C.tan), letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>New Collection</div>
            <div style={{ ...Ser(22, 300, C.ink), lineHeight: 1.2, marginBottom: 10 }}>Spring 2026</div>
            <div style={{ ...F(11, 400, "#888"), marginBottom: 18 }}>Discover the latest abayas crafted with care.</div>
            <Link
              to="/category/new"
              onClick={onClose}
              style={{
                background: C.brandRed, color: C.cream, padding: "10px 20px",
                textDecoration: "none", ...F(10, 500, C.cream), letterSpacing: 2,
                textTransform: "uppercase", display: "inline-block", textAlign: "center",
              }}
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}