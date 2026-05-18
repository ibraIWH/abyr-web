import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { C, F, Ser } from "../designTokens";

export default function ProductPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("M");
  const [added, setAdded] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  // Check favourite status
  useEffect(() => {
    if (!user) return;
    api.get("/favourites")
      .then(res => {
        const found = res.data.some(fav => fav.product._id === id);
        setIsFav(found);
      })
      .catch(() => {});
  }, [user, id]);

  const handleAddToCart = () => {
    const cart = JSON.parse(sessionStorage.getItem("cart") || "[]");
    cart.push({ ...product, size: selectedSize, quantity: 1 });
    sessionStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const toggleFavourite = async () => {
    if (!user) return;
    setFavLoading(true);
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
      setFavLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: 80, ...F(14, 400, "#888") }}>Loading...</div>;
  if (!product) return <div style={{ textAlign: "center", padding: 80, ...F(14, 400, C.red) }}>Product not found</div>;

  const sizes = ["XS", "S", "M", "L", "XL"];

  return (
    <div style={{ background: C.sand, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ padding: "28px 64px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
        <div>
          <div style={{ background: "#EDE8E0", height: 440, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} style={{ maxHeight: "100%", maxWidth: "100%" }} />
            ) : (
              <svg width="80" height="180" viewBox="0 0 80 180" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5">
                <path d="M40 10 C24 10 16 24 16 36 L8 44 L0 44 L0 160 L80 160 L80 44 L72 44 L64 36 C64 24 56 10 40 10Z"/>
              </svg>
            )}
          </div>
        </div>
        <div>
          <div style={{ ...F(9, 500, C.tan), letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>{product.category}</div>
          <h1 style={{ ...Ser(36, 300, C.ink), lineHeight: 1.1, marginBottom: 8 }}>{product.name}</h1>
          <div style={{ ...Ser(28, 300, C.tan), marginBottom: 24 }}>SAR {parseFloat(product.price).toFixed(2)}</div>

          {/* Favourite button */}
          {user && (
            <button
              onClick={toggleFavourite}
              disabled={favLoading}
              style={{
                background: "none",
                border: `0.5px solid ${isFav ? C.brandRed : C.border}`,
                padding: "8px 16px",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                marginBottom: 18,
                ...F(11, 400, isFav ? C.brandRed : "#888"),
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={isFav ? C.brandRed : "none"} stroke={isFav ? C.brandRed : "#888"} strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {isFav ? "Remove from Favourites" : "Add to Favourites"}
            </button>
          )}

          <div style={{ ...F(9, 500, C.tan), letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Size</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {sizes.map(size => (
              <div key={size}
                onClick={() => setSelectedSize(size)}
                style={{
                  width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center",
                  border: `1px solid ${selectedSize === size ? C.brandRed : C.border}`,
                  background: selectedSize === size ? C.brandRed : "transparent",
                  ...F(11, 400, selectedSize === size ? C.cream : "#444"),
                  cursor: "pointer", transition: "0.15s"
                }}
              >{size}</div>
            ))}
          </div>

          <div style={{ ...F(11, 400, "#888"), lineHeight: 1.8, marginBottom: 24 }}>
            {product.description || "A beautifully crafted piece from the Abyr collection."}
          </div>

          <button
            onClick={handleAddToCart}
            style={{
              width: "100%", padding: "14px",
              background: added ? C.green : C.brandRed,
              color: C.cream, border: "none",
              ...F(11, 500, C.cream), letterSpacing: 2, textTransform: "uppercase",
              cursor: "pointer", transition: "0.2s"
            }}
          >
            {added ? "✓ Added!" : "Add to Cart"}
          </button>

          <div style={{ marginTop: 20, textAlign: "center" }}>
            <Link to="/" style={{ ...F(10, 400, C.tan), textDecoration: "underline" }}>← Continue Shopping</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}