import { C, F, Ser } from "../designTokens";

export default function Footer() {
  return (
    <div style={{ background: C.ink, padding: "clamp(36px, 6vw, 48px) clamp(16px, 5vw, 64px) 28px", color: C.cream }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 32, marginBottom: 40 }}>
        {/* Brand */}
        <div>
          <div style={{ ...Ser(24, 300, C.cream), marginBottom: 12 }}>abyr</div>
          <p style={{ ...F(10, 400, "rgba(255,255,255,0.35)"), lineHeight: 1.8 }}>
            Crafting refined modest fashion for the modern woman. Every piece tells a story of elegance.
          </p>
        </div>
        {/* Shop */}
        <div>
          <div style={{ ...F(9, 500, C.gold), letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Shop</div>
          {["Abaya", "Jalabiya", "Niqab", "Bisht", "Gloves", "School"].map((item) => (
            <div key={item} style={{ ...F(10, 400, "rgba(255,255,255,0.35)"), marginBottom: 6 }}>{item}</div>
          ))}
        </div>
        {/* Help */}
        <div>
          <div style={{ ...F(9, 500, C.gold), letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Help</div>
          {["Size Guide", "Delivery Info", "Returns", "FAQ", "Contact"].map((item) => (
            <div key={item} style={{ ...F(10, 400, "rgba(255,255,255,0.35)"), marginBottom: 6 }}>{item}</div>
          ))}
        </div>
        {/* Trust badges */}
        <div>
          <div style={{ ...F(9, 500, C.gold), letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>We Accept</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {["Visa", "Mastercard", "Mada", "Apple Pay"].map((badge) => (
              <div key={badge} style={{
                border: "0.5px solid rgba(255,255,255,0.2)",
                padding: "4px 10px",
                ...F(9, 400, "rgba(255,255,255,0.4)"),
              }}>
                {badge}
              </div>
            ))}
          </div>
          <div style={{ ...F(9, 500, C.gold), letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Secured By</div>
          <div style={{ ...F(9, 400, "rgba(255,255,255,0.3)"), marginBottom: 6 }}>SSL Secure Checkout</div>
          <div style={{ ...F(9, 400, "rgba(255,255,255,0.3)") }}>Tracked Delivery</div>
        </div>
      </div>
      <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.08)", paddingTop: 20, textAlign: "center", ...F(9, 400, "rgba(255,255,255,0.2)") }}>
        © 2026 Abyr Line. All rights reserved.
      </div>
    </div>
  );
}