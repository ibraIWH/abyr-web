import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";
import Breadcrumb from "../components/Breadcrumb";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { addToRecentlyViewed } from "../components/RecentlyViewed";
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
  const [showStickyBar, setShowStickyBar] = useState(false);
  const ctaRef = useRef(null);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        addToRecentlyViewed(res.data); // ← save for recently viewed
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!user) return;
    api.get("/favourites")
      .then((res) => {
        const found = res.data.some((fav) => fav.product._id === id);
        setIsFav(found);
      })
      .catch(() => {});
  }, [user, id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (ctaRef.current) observer.observe(ctaRef.current);
    return () => observer.disconnect();
  }, [product]);

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

  if (loading)
    return <div style={{ textAlign: "center", padding: 80, ...F(14, 400, "#888") }}>Loading...</div>;
  if (!product)
    return <div style={{ textAlign: "center", padding: 80, ...F(14, 400, C.red) }}>Product not found</div>;

  const sizes = ["XS", "S", "M", "L", "XL"];

  return (
    <div style={{ background: C.sand, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: product.category, to: `/category/${product.category?.toLowerCase()}` },
          { label: product.name },
        ]}
      />
      <div style={{ padding: "28px 64px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
        {/* ---- Product Image with Zoom ---- */}
        <div>
          <div
            style={{
              height: 440,
              overflow: "hidden",
              position: "relative",
              background: "#EDE8E0",
            }}
            onMouseMove={(e) => {
              const img = document.getElementById("product-main-image");
              if (!img) return;
              const bounds = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - bounds.left) / bounds.width) * 100;
              const y = ((e.clientY - bounds.top) / bounds.height) * 100;
              img.style.transformOrigin = `${x}% ${y}%`;
            }}
            onMouseEnter={() => {
              const img = document.getElementById("product-main-image");
              if (img) img.style.transform = "scale(2)";
            }}
            onMouseLeave={() => {
              const img = document.getElementById("product-main-image");
              if (img) img.style.transform = "scale(1)";
            }}
          >
            <img
              id="product-main-image"
              src={product.imageUrl || ""}
              alt={product.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.3s ease",
                transform: "scale(1)",
                cursor: "crosshair",
              }}
              onError={(e) => {
                e.target.style.display = "none";
                const fallback = e.target.nextSibling;
                if (fallback) fallback.style.display = "flex";
              }}
            />
            <svg
              width="80"
              height="180"
              viewBox="0 0 80 180"
              fill="none"
              stroke="rgba(0,0,0,0.08)"
              strokeWidth="1.5"
              style={{
                display: product.imageUrl ? "none" : "flex",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                margin: "auto",
              }}
            >
              <path d="M40 10 C24 10 16 24 16 36 L8 44 L0 44 L0 160 L80 160 L80 44 L72 44 L64 36 C64 24 56 10 40 10Z" />
            </svg>
          </div>
        </div>

        {/* ---- Product Info ---- */}
        <div>
          <div style={{ ...F(9, 500, C.tan), letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
            {product.category}
          </div>
          <h1 style={{ ...Ser(36, 300, C.ink), lineHeight: 1.1, marginBottom: 8 }}>{product.name}</h1>
          <div style={{ ...Ser(28, 300, C.tan), marginBottom: 24 }}>SAR {parseFloat(product.price).toFixed(2)}</div>

          {/* Color Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ ...F(9, 500, C.tan), letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>
                Colour
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                {product.colors.map((color, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      const imgEl = document.getElementById("product-main-image");
                      if (imgEl && color.imageUrl) {
                        imgEl.src = color.imageUrl;
                        imgEl.style.display = "block";
                        const fallback = imgEl.nextSibling;
                        if (fallback) fallback.style.display = "none";
                      }
                    }}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: color.hex || "#ccc",
                      border: `2px solid ${idx === 0 ? C.ink : "transparent"}`,
                      outline: "0.5px solid rgba(0,0,0,0.08)",
                      cursor: "pointer",
                      transition: "border 0.15s",
                    }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

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
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {isFav ? "Remove from Favourites" : "Add to Favourites"}
            </button>
          )}

          {/* Size Selector */}
          <div style={{ ...F(9, 500, C.tan), letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Size</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {sizes.map((size) => (
              <div
                key={size}
                onClick={() => setSelectedSize(size)}
                style={{
                  width: 42,
                  height: 42,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `1px solid ${selectedSize === size ? C.brandRed : C.border}`,
                  background: selectedSize === size ? C.brandRed : "transparent",
                  ...F(11, 400, selectedSize === size ? C.cream : "#444"),
                  cursor: "pointer",
                  transition: "0.15s",
                }}
              >
                {size}
              </div>
            ))}
          </div>

          {/* Description */}
          <div style={{ ...F(11, 400, "#888"), lineHeight: 1.8, marginBottom: 24 }}>
            {product.description || "A beautifully crafted piece from the Abyr collection."}
          </div>

          {/* Add to Cart button (normal position) */}
          <div ref={ctaRef}>
            <button
              onClick={handleAddToCart}
              style={{
                width: "100%",
                padding: "14px",
                background: added ? C.green : C.brandRed,
                color: C.cream,
                border: "none",
                ...F(11, 500, C.cream),
                letterSpacing: 2,
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "0.2s",
              }}
            >
              {added ? "✓ Added!" : "Add to Cart"}
            </button>
          </div>

          <div style={{ marginTop: 20, textAlign: "center" }}>
            <Link to="/" style={{ ...F(10, 400, C.tan), textDecoration: "underline" }}>
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Sticky Add-to-Cart Bar */}
      {showStickyBar && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "rgba(250,250,248,0.97)",
            backdropFilter: "blur(10px)",
            borderTop: `0.5px solid ${C.border}`,
            padding: "12px 64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 100,
          }}
        >
          <div>
            <div style={{ ...F(12, 500, C.ink) }}>{product.name}</div>
            <div style={{ ...Ser(16, 300, C.tan) }}>SAR {parseFloat(product.price).toFixed(2)}</div>
          </div>
          <button
            onClick={handleAddToCart}
            style={{
              padding: "12px 32px",
              background: added ? C.green : C.brandRed,
              color: C.cream,
              border: "none",
              ...F(11, 500, C.cream),
              letterSpacing: 2,
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            {added ? "✓ Added!" : "Add to Cart"}
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}