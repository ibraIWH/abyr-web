import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { C, F, Ser } from "../designTokens";
import QuickViewModal from "./QuickViewModal";

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!user) return;
    api.get("/favourites")
      .then((res) => {
        const found = res.data.some((fav) => fav.product._id === product._id);
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

  const badge =
    product.stock === 0 ? "SOLD OUT" : product.salePrice ? "SALE" : null;

  return (
    <>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ position: "relative" }}
      >
        <Link
          to={`/product/${product._id}`}
          style={{ textDecoration: "none", color: C.ink }}
        >
          {/* Image – click navigates to product page */}
          <div
            style={{
              background: "transparent",
              height: 410,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "cover",
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

            {/* Quick View trigger on hover */}
            {isHovered && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowQuickView(true);
                }}
                style={{
                  position: "absolute",
                  bottom: 8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(0,0,0,0.7)",
                  color: C.white,
                  border: "none",
                  padding: "6px 14px",
                  ...F(10, 400, C.white),
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  zIndex: 2,
                }}
              >
                Quick View
              </button>
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
          <div style={{ padding: "8px 10px 12px" }}>
            <div
              style={{
                ...F(8, 500, C.tan),
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              {product.category}
            </div>
            <div style={{ ...F(11, 500, C.ink), marginBottom: 2 }}>
              {product.name}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              {product.salePrice ? (
                <>
                  <span style={{ ...Ser(13, 300, C.tan) }}>
                    SAR {parseFloat(product.salePrice).toFixed(2)}
                  </span>
                  <span
                    style={{
                      ...F(11, 400, "#888"),
                      textDecoration: "line-through",
                    }}
                  >
                    SAR {parseFloat(product.price).toFixed(2)}
                  </span>
                </>
              ) : (
                <span style={{ ...Ser(13, 300, C.tan) }}>
                  SAR {parseFloat(product.price).toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <QuickViewModal
          product={product}
          onClose={() => setShowQuickView(false)}
        />
      )}
    </>
  );
}