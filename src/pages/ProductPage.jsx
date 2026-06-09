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
  const [zoomedImage, setZoomedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        addToRecentlyViewed(res.data);
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
  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl].filter(Boolean);
  const displayImage = images[selectedImageIndex] || product.imageUrl;
  const hasSale = product.salePrice && product.salePrice < product.price;

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
      <div style={{
        padding: "28px 64px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 48,
      }}>
        {/* ---- Product Images ---- */}
        <div>
          {/* Main Image */}
          <div
            style={{
              background: "transparent",
              height: 600,
              overflow: "hidden",
              position: "relative",
              cursor: "zoom-in",
              marginBottom: 12,
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
            onClick={() => {
              if (displayImage) setZoomedImage(displayImage);
            }}
          >
            {displayImage ? (
              <img
                id="product-main-image"
                src={displayImage}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  transition: "transform 0.3s ease",
                  transform: "scale(1)",
                  display: "block",
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="80" height="180" viewBox="0 0 80 180" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5">
                  <path d="M40 10 C24 10 16 24 16 36 L8 44 L0 44 L0 160 L80 160 L80 44 L72 44 L64 36 C64 24 56 10 40 10Z" />
                </svg>
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div style={{ display: "flex", gap: 8 }}>
              {images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  style={{
                    width: 64,
                    height: 80,
                    background: "#EDE8E0",
                    cursor: "pointer",
                    border: `2px solid ${selectedImageIndex === idx ? C.brandRed : "transparent"}`,
                    overflow: "hidden",
                  }}
                >
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ---- Product Info ---- */}
        <div>
          <div style={{ ...F(9, 500, C.tan), letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
            {product.category}
          </div>
          <h1 style={{ ...Ser(36, 300, C.ink), lineHeight: 1.1, marginBottom: 8 }}>{product.name}</h1>

          {/* Price Display */}
          <div style={{ marginBottom: 20, display: "flex", alignItems: "baseline", gap: 12 }}>
            <span style={{ ...Ser(28, 300, hasSale ? C.brandRed : C.tan) }}>
              SAR {hasSale ? parseFloat(product.salePrice).toFixed(2) : parseFloat(product.price).toFixed(2)}
            </span>
            {hasSale && (
              <span style={{ ...F(14, 400, "#888"), textDecoration: "line-through" }}>
                SAR {parseFloat(product.price).toFixed(2)}
              </span>
            )}
          </div>

          {/* Payment Options */}
          <div style={{
            background: C.linen,
            padding: "12px 16px",
            marginBottom: 20,
            border: `0.5px solid ${C.border}`,
          }}>
            <div style={{ ...F(10, 500, C.ink), marginBottom: 6 }}>Pay in 4 interest-free payments</div>
            <div style={{ ...F(9, 400, "#888"), marginBottom: 4 }}>
              Pay in 4 interest-free payments of{" "}
              <strong>
                SAR {(hasSale ? (product.salePrice / 4) : (product.price / 4)).toFixed(2)}
              </strong>{" "}
              with Tabby & Tamara
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ background: C.ink, color: C.cream, padding: "3px 10px", borderRadius: 4, ...F(8, 500, C.cream), letterSpacing: 1 }}>Tabby</div>
              <div style={{ background: C.brandRed, color: C.cream, padding: "3px 10px", borderRadius: 4, ...F(8, 500, C.cream), letterSpacing: 1 }}>Tamara</div>
            </div>
          </div>

          {/* Size Selector */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ ...F(9, 500, C.tan), letterSpacing: 2, textTransform: "uppercase" }}>Size</div>
            <Link to="/size-guide" style={{ ...F(9, 400, C.tan), textDecoration: "underline", cursor: "pointer" }}>
              Size Guide ↓
            </Link>
          </div>
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
          <div style={{ ...F(11, 400, "#888"), lineHeight: 1.8, marginBottom: 20 }}>
            {product.description || "A beautifully crafted piece from the Abyr collection."}
          </div>

          {/* Add to Cart button */}
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
                marginBottom: 12,
              }}
            >
              {added ? "✓ Added!" : "Add to Cart"}
            </button>
          </div>

          {/* Favourite + Shipping Info */}
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            {user && (
              <button
                onClick={toggleFavourite}
                disabled={favLoading}
                style={{
                  flex: 1,
                  background: "none",
                  border: `0.5px solid ${isFav ? C.brandRed : C.border}`,
                  padding: "10px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  cursor: "pointer",
                  ...F(10, 400, isFav ? C.brandRed : "#888"),
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={isFav ? C.brandRed : "none"} stroke={isFav ? C.brandRed : "#888"} strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {isFav ? "Saved" : "Save"}
              </button>
            )}
          </div>

          {/* Shipping Info Box */}
          <div style={{
            background: C.linen,
            border: `0.5px solid ${C.border}`,
            padding: "14px 16px",
            marginBottom: 20,
          }}>
            <div style={{ ...F(10, 500, C.ink), marginBottom: 8 }}>📦 Shipping</div>
            <div style={{ ...F(10, 400, "#888"), lineHeight: 1.6 }}>
              Fast delivery · Order now and get delivery within 2-3 business days
            </div>
            <div style={{ ...F(10, 400, C.green), marginTop: 4 }}>Free delivery over SAR 200</div>
          </div>

          {/* Return Policy */}
          <div style={{
            border: `0.5px solid ${C.border}`,
            padding: "14px 16px",
            marginBottom: 20,
          }}>
            <div style={{ ...F(10, 500, C.ink), marginBottom: 6 }}>🔄 Returns & Exchange</div>
            <div style={{ ...F(10, 400, "#888"), lineHeight: 1.6 }}>
              Easy returns within 7 days. If you're not satisfied, return it — no questions asked.
            </div>
          </div>

          <div style={{ marginTop: 8, textAlign: "center" }}>
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
            <div style={{ ...Ser(16, 300, C.tan) }}>
              SAR {hasSale ? parseFloat(product.salePrice).toFixed(2) : parseFloat(product.price).toFixed(2)}
            </div>
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

      {/* Full‑screen zoom overlay */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(6px)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "zoom-out",
          }}
        >
          <img
            src={zoomedImage}
            alt={product.name}
            style={{
              maxHeight: "90vh",
              maxWidth: "90vw",
              objectFit: "contain",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <Footer />
    </div>
  );
}