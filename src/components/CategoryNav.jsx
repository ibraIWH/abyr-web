import { Link } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import { C, F } from "../designTokens";

const toSlug = (name = "") =>
  name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export default function CategoryNav() {
  // No fetch of its own — the app already loads categories once in
  // SettingsContext. Fetching here as well meant a second request and a
  // second, differently-timed loading state, which is what caused the
  // menu to change in front of the customer a few seconds after load.
  const { categories, loading } = useSettings();

  const barStyle = {
    background: C.white,
    borderBottom: `0.5px solid ${C.border}`,
    position: "sticky",
    top: 80,
    zIndex: 900,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    padding: "10px 0",
    flexWrap: "wrap",
    minHeight: 41, // reserved height so the page never jumps when items arrive
  };

  // While loading, show neutral placeholders instead of an out-of-date list.
  if (loading) {
    return (
      <div style={barStyle}>
        {[64, 78, 56, 70, 60, 52].map((w, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              width: w,
              height: 10,
              borderRadius: 3,
              background: C.border,
              opacity: 0.7,
            }}
          />
        ))}
      </div>
    );
  }

  if (!categories.length) return null;

  return (
    <div style={barStyle}>
      {categories.map((cat) => (
        <Link
          key={cat._id || cat.slug}
          to={`/category/${cat.slug || toSlug(cat.name)}`}
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
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
