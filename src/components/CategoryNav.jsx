import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { C, F } from "../designTokens";

// Shown while the API loads, and kept if the request fails,
// so the nav is never empty on the live site.
const FALLBACK = [
  { label: "Abaya", slug: "abaya" },
  { label: "Jalabiya", slug: "jalabiya" },
  { label: "Niqab", slug: "niqab" },
  { label: "Bisht", slug: "bisht" },
  { label: "Gloves", slug: "gloves" },
  { label: "School", slug: "school" },
];

const toSlug = (name = "") =>
  name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export default function CategoryNav() {
  const [categories, setCategories] = useState(FALLBACK);

  useEffect(() => {
    // `alive` stops us updating state if the user navigates away mid-request.
    let alive = true;

    api
      .get("/categories") // public endpoint: only active ones, already sorted by "order"
      .then((res) => {
        if (!alive) return;
        const list = (res.data || [])
          .filter((c) => c.name)
          .map((c) => ({ label: c.name, slug: c.slug || toSlug(c.name) }));
        if (list.length) setCategories(list); // only replace if we actually got some
      })
      .catch(() => {
        /* network error — keep the fallback list */
      });

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div
      style={{
        background: C.white,
        borderBottom: `0.5px solid ${C.border}`,
        position: "sticky",
        top: 80, // height of the main navbar
        zIndex: 900,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        padding: "10px 0",
        flexWrap: "wrap",
      }}
    >
      {/* Category links */}
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          to={`/category/${cat.slug}`}
          style={{
            ...F(10, 400, C.ink),
            letterSpacing: 1.5,
            textTransform: "uppercase",
            textDecoration: "none",
            borderBottom: "1.5px solid transparent",
            paddingBottom: 2,
            transition: "border-color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderBottomColor = C.brandRed)}
          onMouseLeave={(e) => (e.currentTarget.style.borderBottomColor = "transparent")}
        >
          {cat.label}
        </Link>
      ))}
    </div>
  );
}
