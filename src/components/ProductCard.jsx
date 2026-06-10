import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { C, F, Ser } from "../designTokens";
import QuickViewModal from "./QuickViewModal";

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [currentImage, setCurrentImage] = useState(product.imageUrl);

  const hoverImage = product.imageUrl2 || product.imageUrl;

  // Check if product is already in favourites
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
    e.preventDefault();
    if (!user) return;
    setFavLoading(true);
    try {
      if (isFav) {
        await api.delete(`/favourites/${product._id}`);
        setIsFav(false);
        addToast("Removed from favourites");
      } else {
        await api.post("/favourites", { productId: product._id });
        setIsFav(true);
        addToast("Added to favourites", "success");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFavLoading(false);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
    addToast("Added to cart", "success");
  };

  const badge = product.stock === 0 ? "SOLD OUT" : product.salePrice ? "SALE" : null;

  return (
    <>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ position: "relative" }}
      >
        <Link to={`/product/${product._id}`} style={{ textDecoration: "none", color: C.ink }}>
          {/* Image container */}
          <div
            onMouseEnter={() => setCurrentImage(hoverImage)}
            onMouseLeave={() => setCurrentImage(product.imageUrl)}
            style={{
              background: "transparent",
              height: 300,
              width: "100%",                       // explicitly full width
              overflow: "hidden",                  // clip any overflow
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {currentImage ? (
              <img
                src={currentImage}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",             // fill the area without stretching
                }}
              />
            ) : (
              <svg
                width="36"
                height="80"
                viewBox="0 0 80 180"
                fill="none"
                stroke="rgba(0,0,0,0.09)"
                strokeWidth="1.5"
              >
                <path d="M40 10 C24 10 16 24 16 36 L8 44 L0 44 L0 160 L80 160 L80 44 L72 44 L64 36 C64 24 56 10 40 10Z" />
              </svg>
            )}

            {/* Badge */}
            {badge && (
              <div
                style={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  background: badge === "SOLD OUT" ? C.ink : C.brandRed,
                  color: C.cream,
                  padding: "4px 10px",
                  ...F(8, 500, C.cream),
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  zIndex: 2,
                }}
              >
                {badge}
              </div>
            )}

            {/* Favourite heart */}
            {user && (
              <button
                onClick={toggleFavourite}
                disabled={favLoading}
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
                  zIndex: 2,
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill={isFav ? C.brandRed : "none"}
                  stroke="white"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            )}
          </div>

          {/* Product info */}
          <div style={{ padding: "8px 0px 12px" }}>
            <div style={{ ...F(8, 500, C.tan), letterSpacing: 1, textTransform: "uppercase" }}>
              {product.category}
            </div>
            <div style={{ ...F(11, 500, C.ink), marginBottom: 2 }}>
              {product.name}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
              {product.salePrice ? (
                <>
                  <span style={{ ...Ser(13, 300, C.tan) }}>
                    SAR {parseFloat(product.salePrice).toFixed(2)}
                  </span>
                  <span style={{ ...F(11, 400, "#888"), textDecoration: "line-through" }}>
                    SAR {parseFloat(product.price).toFixed(2)}
                  </span>
                </>
              ) : (
                <span style={{ ...Ser(13, 300, C.tan) }}>
                  SAR {parseFloat(product.price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Quick View button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowQuickView(true);
              }}
              style={{
                width: "100%",
                padding: "6px 0",
                background: "transparent",
                color: C.tan,
                border: `0.5px solid ${C.border}`,
                ...F(10, 400, C.tan),
                letterSpacing: 1,
                cursor: "pointer",
                marginBottom: 6,
              }}
            >
              Quick View
            </button>

            {/* Add to Cart button */}
            <button
              onClick={handleAddToCart}
              style={{
                width: "100%",
                padding: "8px 0",
                background: C.brandRed,
                color: C.cream,
                border: "none",
                ...F(11, 500, C.cream),
                letterSpacing: 2,
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Add to Cart
            </button>
          </div>
        </Link>
      </div>

      {showQuickView && (
        <QuickViewModal product={product} onClose={() => setShowQuickView(false)} />
      )}
    </>
  );
}