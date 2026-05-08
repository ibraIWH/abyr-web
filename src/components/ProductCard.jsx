import { Link } from "react-router-dom";
import { C, F, Ser } from "../designTokens";

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product._id}`} style={{ textDecoration: "none", color: C.ink }}>
      <div style={{ background: "#EDE8E0", height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} style={{ maxHeight: "100%", maxWidth: "100%" }} />
        ) : (
          <svg width="36" height="80" viewBox="0 0 80 180" fill="none" stroke="rgba(0,0,0,0.09)" strokeWidth="1.5">
            <path d="M40 10 C24 10 16 24 16 36 L8 44 L0 44 L0 160 L80 160 L80 44 L72 44 L64 36 C64 24 56 10 40 10Z"/>
          </svg>
        )}
      </div>
      <div style={{ padding: "8px 10px 12px" }}>
        <div style={{ ...F(8, 500, C.tan), letterSpacing: 1, textTransform: "uppercase" }}>{product.category}</div>
        <div style={{ ...F(11, 500, C.ink), marginBottom: 2 }}>{product.name}</div>
        <div style={{ ...Ser(13, 300, C.tan) }}>SAR {parseFloat(product.price).toFixed(2)}</div>
      </div>
    </Link>
  );
}