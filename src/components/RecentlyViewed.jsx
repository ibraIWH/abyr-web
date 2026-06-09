import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { C, F, Ser } from "../designTokens";

const RECENT_KEY = "recentlyViewed";

export default function RecentlyViewed() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem(RECENT_KEY);
    if (raw) setProducts(JSON.parse(raw));
  }, []);

  if (!products.length) return null;

  return (
    <div style={{ padding: "0 64px 52px" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ ...F(9, 500, C.tan), letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
          Recently Viewed
        </div>
        <h2 style={{ ...Ser(28, 300, C.ink) }}>You Recently Looked At</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 16 }}>
        {products.map((prod) => (
          <Link
            key={prod._id}
            to={`/product/${prod._id}`}
            style={{ textDecoration: "none", color: C.ink }}
          >
            <div style={{ background: "transparent", height: 410, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
              {prod.imageUrl ? (
                <img src={prod.imageUrl} alt={prod.name} style={{ maxHeight: "100%", maxWidth: "100%" }} />
              ) : (
                <svg width="28" height="56" viewBox="0 0 80 180" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5">
                  <path d="M40 10 C24 10 16 24 16 36 L8 44 L0 44 L0 160 L80 160 L80 44 L72 44 L64 36 C64 24 56 10 40 10Z" />
                </svg>
              )}
            </div>
            <div style={{ ...F(11, 500, C.ink) }}>{prod.name}</div>
            <div style={{ ...Ser(14, 300, C.tan) }}>SAR {parseFloat(prod.price).toFixed(2)}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Helper to add product to recently viewed – call this in ProductPage after product loads
export function addToRecentlyViewed(product) {
  if (!product) return;
  const raw = localStorage.getItem(RECENT_KEY);
  let list = raw ? JSON.parse(raw) : [];
  list = list.filter((p) => p._id !== product._id);
  list.unshift({ _id: product._id, name: product.name, price: product.price, imageUrl: product.imageUrl });
  if (list.length > 8) list.pop();
  localStorage.setItem(RECENT_KEY, JSON.stringify(list));
}