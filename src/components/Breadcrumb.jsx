import { Link } from "react-router-dom";
import { C, F } from "../designTokens";

export default function Breadcrumb({ items }) {
  return (
    <div style={{ padding: "12px 64px", borderBottom: `0.5px solid ${C.border}`, background: C.white }}>
      <span style={{ ...F(9, 400, "#888") }}>
        {items.map((item, i) => (
          <span key={i}>
            {i > 0 && " › "}
            {item.to ? (
              <Link to={item.to} style={{ color: "#888", textDecoration: "none" }}>
                {item.label}
              </Link>
            ) : (
              <span style={{ color: C.ink }}>{item.label}</span>
            )}
          </span>
        ))}
      </span>
    </div>
  );
}