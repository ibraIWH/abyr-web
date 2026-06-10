import { Link } from "react-router-dom";
import { C, F } from "../designTokens";

const categories = [
  { label: "Abaya", slug: "abaya" },
  { label: "Jalabiya", slug: "jalabiya" },
  { label: "Niqab", slug: "niqab" },
  { label: "Bisht", slug: "bisht" },
  { label: "Gloves", slug: "gloves" },
  { label: "School", slug: "school" },
];

export default function CategoryNav() {
  return (
    <div
      style={{
        background: C.white,
        borderBottom: `0.5px solid ${C.border}`,
        position: "sticky",
        top: 80,           // height of the main navbar
        zIndex: 900,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        padding: "10px 0",
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
        >
          {cat.label}
        </Link>
      ))}
    </div>
  );
}