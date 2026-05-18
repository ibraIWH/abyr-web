import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { C, F, Ser } from "../designTokens";

export default function ModernSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Debounced search as user types
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      setLoading(true);
      api
        .get("/products", { params: { search: query } })
        .then((res) => setResults(res.data.slice(0, 8)))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Focus input when opening
  useEffect(() => {
    if (open && inputRef.current) {
      // tiny delay to let the overlay render
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setOpen(false);
      setQuery("");
    }
  };

  return (
    <>
      {/* Trigger – just a text link */}
      <div
        onClick={() => setOpen(true)}
        style={{
          ...F(10, 400, C.ink),
          cursor: "pointer",
          letterSpacing: 1,
          textDecoration: "none",
        }}
      >
        SEARCH
      </div>

      {/* Full‑screen overlay (covers viewport below navbar) */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: 52,           // start below the navbar (Navbar height)
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(12px)",
            zIndex: 999,
            display: "flex",
            flexDirection: "column",
          }}
          onClick={() => { setOpen(false); setQuery(""); }}  // close on backdrop click
        >
          {/* Search panel – stops click propagation */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: C.sand,
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              animation: "slideDown 0.25s ease",
            }}
          >
            {/* Search bar */}
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "16px 64px",
                borderBottom: `0.5px solid ${C.border}`,
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke={C.gold}
                strokeWidth="1.5"
                style={{ marginRight: 12 }}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search abayas, jalabiya..."
                style={{
                  flex: 1,
                  border: "none",
                  background: "transparent",
                  ...F(18, 300, C.ink),
                  outline: "none",
                }}
              />
              {/* Close button */}
              <div
                onClick={() => { setOpen(false); setQuery(""); }}
                style={{
                  ...F(14, 400, "#888"),
                  cursor: "pointer",
                  marginLeft: 12,
                }}
              >
                ✕
              </div>
            </form>

            {/* Results area */}
            <div style={{ padding: "20px 64px", maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
              {loading ? (
                <div style={{ textAlign: "center", padding: 40, ...F(13, 400, "#888") }}>
                  Searching...
                </div>
              ) : query && results.length === 0 ? (
                <div style={{ textAlign: "center", padding: 40, ...F(13, 400, "#888") }}>
                  No products found for “{query}”
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 16 }}>
                  {results.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => {
                        navigate(`/product/${product._id}`);
                        setOpen(false);
                        setQuery("");
                      }}
                      style={{
                        cursor: "pointer",
                        background: C.white,
                        padding: 12,
                        border: `0.5px solid ${C.border}`,
                        transition: "box-shadow 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.boxShadow =
                          "0 4px 12px rgba(0,0,0,0.08)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.boxShadow = "none")
                      }
                    >
                      <div
                        style={{
                          background: "#EDE8E0",
                          height: 160,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: 8,
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
                            width="24"
                            height="56"
                            viewBox="0 0 80 180"
                            fill="none"
                            stroke="rgba(0,0,0,0.1)"
                            strokeWidth="1.5"
                          >
                            <path d="M40 10 C24 10 16 24 16 36 L8 44 L0 44 L0 160 L80 160 L80 44 L72 44 L64 36 C64 24 56 10 40 10Z" />
                          </svg>
                        )}
                      </div>
                      <div style={{ ...F(9, 400, C.tan), letterSpacing: 1 }}>
                        {product.category?.toUpperCase()}
                      </div>
                      <div
                        style={{
                          ...F(11, 500, C.ink),
                          marginBottom: 2,
                          lineHeight: 1.3,
                        }}
                      >
                        {product.name}
                      </div>
                      <div style={{ ...Ser(14, 300, C.tan) }}>
                        SAR {parseFloat(product.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Simple slide‑down animation */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}