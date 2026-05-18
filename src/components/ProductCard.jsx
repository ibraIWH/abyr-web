import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { C, F, Ser } from "../designTokens";

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if product is already favourited
  useEffect(() => {
    if (!user) return;
    api.get("/favourites")
      .then(res => {
        const found = res.data.some(fav => fav.product._id === product._id);
        setIsFav(found);
      })
      .catch(() => {});
  }, [user, product._id]);

  const toggleFavourite = async (e) => {
    e.preventDefault(); // Prevent navigation
    if (!user) return;
    setLoading(true);
    try {
      if (isFav) {
        await api.delete(`/favourites/${product._id}`);
        setIsFav(false);
      } else {
        await api.post("/favourites", { productId: product._id });
        setIsFav(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link to={`/product/${product._id}`} style={{ textDecoration: "none", color: C.ink }}>
      <div style={{ background: "#EDE8E0", height: 200, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} style={{ maxHeight: "100%", maxWidth: "100%" }} />
        ) : (
          <svg width="36" height="80" viewBox="0 0 80 180" fill="none" stroke="rgba(0,0,0,0.09)" strokeWidth="1.5">
            <path d="M40 10 C24 10 16 24 16 36 L8 44 L0 44 L0 160 L80 160 L80 44 L72 44 L64 36 C64 24 56 10 40 10Z"/>
          </svg>
        )}
        {/* Favourite heart */}
        {user && (
          <button
            onClick={toggleFavourite}
            disabled={loading}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "rgba(0,0,0,0.3)",
              border: "none",
              borderRadius: "50%",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={isFav ? C.brandRed : "none"} stroke="white" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
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