import { Link } from "react-router-dom";
import { C, F, Ser } from "../designTokens";

export default function EmptyState({ title, message, showShopButton = true }) {
  return (
    <div style={{ textAlign: "center", padding: 60, margin: "2rem auto", maxWidth: 500 }}>
      <h2 style={{ ...Ser(24, 300, C.ink), marginBottom: 12 }}>{title}</h2>
      <p style={{ ...F(13, 400, "#888"), marginBottom: 24 }}>{message}</p>
      {showShopButton && (
        <Link
          to="/"
          style={{
            background: C.brandRed, color: C.cream, padding: "12px 28px",
            textDecoration: "none", ...F(11, 500, C.cream), letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Browse Products
        </Link>
      )}
    </div>
  );
}