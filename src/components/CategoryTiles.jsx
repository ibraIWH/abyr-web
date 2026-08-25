import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { C, F, Ser } from "../designTokens";

const toSlug = (name = "") =>
  name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/**
 * "Shop by Category" — the picture tiles.
 * Everything here (name, photo, order, visibility) is managed from the
 * admin dashboard under Collections. The section renders nothing until at
 * least one category has an image, so the live site never shows empty boxes.
 */
export default function CategoryTiles() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let alive = true;

    api
      .get("/collections") // active only, sorted by "order"
      .then((res) => {
        if (!alive) return;
        const withImages = (res.data || []).filter((c) => c.name && c.imageUrl);
        setItems(withImages);
      })
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, []);

  if (!items.length) return null; // nothing to show yet — stay invisible

  return (
    <section style={{ background: C.sand, padding: "56px 32px 48px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ ...F(9, 500, C.tan), letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 10 }}>
            Explore
          </div>
          <h2 style={{ ...Ser(32, 300, C.ink), lineHeight: 1.15, margin: 0 }}>Shop by Category</h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 18,
          }}
        >
          {items.map((cat) => (
            <Link
              key={cat._id}
              to={`/category/${cat.slug || toSlug(cat.name)}`}
              style={{
                position: "relative",
                display: "block",
                aspectRatio: "3 / 4",
                overflow: "hidden",
                background: C.cream,
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector("img");
                if (img) img.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector("img");
                if (img) img.style.transform = "scale(1)";
              }}
            >
              <img
                src={cat.imageUrl}
                alt={cat.name}
                loading="lazy"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.5s ease",
                }}
              />

              {/* Dark fade so the name stays readable over any photo */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(20,5,8,0.55) 0%, rgba(20,5,8,0.10) 45%, rgba(20,5,8,0) 70%)",
                }}
              />

              <div style={{ position: "absolute", left: 0, right: 0, bottom: 16, textAlign: "center", padding: "0 10px" }}>
                <div
                  style={{
                    ...F(11, 500, C.cream),
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  {cat.name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}