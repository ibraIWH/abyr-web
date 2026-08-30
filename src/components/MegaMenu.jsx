import { Link } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import { C, F, Ser } from "../designTokens";
import { PAGE_X, useIsMobile } from "../responsive";

const toSlug = (name = "") =>
  name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export default function MegaMenu({ open, onClose }) {
  const { categories, loading } = useSettings();
  const isMobile = useIsMobile();

  if (!open) return null;

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", zIndex: 998 }} />
      <div
        style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          background: C.white,
          borderBottom: `0.5px solid ${C.border}`,
          boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
          zIndex: 999,
          padding: `28px ${PAGE_X} 32px`,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(24px, 5vw, 48px)",
            alignItems: "flex-start",
          }}
        >
          {/* Categories with images */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <div
              style={{
                ...F(9, 500, C.tan),
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              Categories
            </div>

            {loading ? (
              <div style={{ ...F(11, 400, "#999") }}>Loading…</div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                  gap: "clamp(12px, 1.5vw, 20px)",
                }}
              >
                {categories.map((cat) => (
                  <Link
                    key={cat._id || cat.slug}
                    to={`/category/${cat.slug || toSlug(cat.name)}`}
                    onClick={onClose}
                    style={{
                      textDecoration: "none",
                      color: C.ink,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      transition: "transform 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      const img = e.currentTarget.querySelector("img");
                      if (img) img.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      const img = e.currentTarget.querySelector("img");
                      if (img) img.style.transform = "scale(1)";
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "3/4",
                        background: C.cream,
                        overflow: "hidden",
                        borderRadius: 8,
                        marginBottom: 8,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      }}
                    >
                      {cat.imageUrl ? (
                        <img
                          src={cat.imageUrl}
                          alt={cat.name}
                          loading="lazy"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "top center",
                            transition: "transform 0.4s ease",
                            display: "block",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            ...F(10, 400, "#999"),
                          }}
                        >
                          {cat.name}
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        ...F(10, 500, C.ink),
                        letterSpacing: 0.3,
                        lineHeight: 1.3,
                      }}
                    >
                      {cat.name}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Featured / New Collection panel */}
          <div
            style={{
              width: isMobile ? "100%" : 220,
              borderLeft: isMobile ? "none" : `0.5px solid ${C.border}`,
              paddingLeft: isMobile ? 0 : 28,
              marginTop: isMobile ? 20 : 0,
              paddingTop: isMobile ? 20 : 0,
              borderTop: isMobile ? `0.5px solid ${C.border}` : "none",
            }}
          >
            <div
              style={{
                ...F(9, 500, C.tan),
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              New Collection
            </div>
            <div
              style={{
                ...Ser(22, 300, C.ink),
                lineHeight: 1.2,
                marginBottom: 10,
              }}
            >
              Spring 2026
            </div>
            <div
              style={{
                ...F(11, 400, "#888"),
                marginBottom: 18,
                lineHeight: 1.6,
              }}
            >
              Discover the latest abayas crafted with care.
            </div>
            <Link
              to="/category/all"
              onClick={onClose}
              style={{
                background: C.brandRed,
                color: C.cream,
                padding: "10px 20px",
                textDecoration: "none",
                ...F(10, 500, C.cream),
                letterSpacing: 2,
                textTransform: "uppercase",
                display: "inline-block",
                textAlign: "center",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.85)}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}