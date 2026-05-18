import { useState } from "react";
import { Link } from "react-router-dom";
import { C, F, Ser } from "../designTokens";

export default function QuickViewModal({ product, onClose }) {
  const [selectedSize, setSelectedSize] = useState("M");
  const sizes = ["XS", "S", "M", "L", "XL"];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.white,
          maxWidth: 800,
          width: "90%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 0,
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        {/* Left: Image */}
        <div
          style={{
            background: "#EDE8E0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 400,
          }}
        >
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "cover" }}
            />
          ) : (
            <svg
              width="60"
              height="120"
              viewBox="0 0 80 180"
              fill="none"
              stroke="rgba(0,0,0,0.08)"
              strokeWidth="1.5"
            >
              <path d="M40 10 C24 10 16 24 16 36 L8 44 L0 44 L0 160 L80 160 L80 44 L72 44 L64 36 C64 24 56 10 40 10Z" />
            </svg>
          )}
        </div>

        {/* Right: Info */}
        <div style={{ padding: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ ...F(9, 500, C.tan), letterSpacing: 2, textTransform: "uppercase" }}>
              {product.category}
            </div>
            <span onClick={onClose} style={{ cursor: "pointer", ...F(14, 400, "#888") }}>
              ✕
            </span>
          </div>
          <h2 style={{ ...Ser(24, 300, C.ink), marginBottom: 8 }}>{product.name}</h2>
          <div style={{ ...Ser(22, 300, C.tan), marginBottom: 20 }}>
            SAR {parseFloat(product.price).toFixed(2)}
          </div>

          <div style={{ ...F(9, 500, C.tan), letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
            Size
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
            {sizes.map((size) => (
              <div
                key={size}
                onClick={() => setSelectedSize(size)}
                style={{
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `1px solid ${selectedSize === size ? C.ink : C.border}`,
                  background: selectedSize === size ? C.ink : "transparent",
                  ...F(10, 400, selectedSize === size ? C.white : "#444"),
                  cursor: "pointer",
                }}
              >
                {size}
              </div>
            ))}
          </div>

          <Link
            to={`/product/${product._id}`}
            style={{
              display: "block",
              textAlign: "center",
              padding: "12px",
              background: C.brandRed,
              color: C.cream,
              textDecoration: "none",
              ...F(11, 500, C.cream),
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            View Full Details
          </Link>
        </div>
      </div>
    </div>
  );
}