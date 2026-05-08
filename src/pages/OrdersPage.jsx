import { Link } from "react-router-dom";
import { C, F, Ser } from "../designTokens";

export default function OrdersPage() {
  const lastOrder = JSON.parse(localStorage.getItem("lastOrder") || "null");
  const orders = lastOrder ? [lastOrder] : [];

  return (
    <div>
      <div style={{ ...Ser(28, 300, C.ink), marginBottom: 24 }}>My Orders</div>
      {orders.length === 0 ? (
        <div style={{ ...F(13, 400, "#888") }}>
          No orders yet.{" "}
          <Link to="/" style={{ color: C.brandRed, textDecoration: "underline" }}>
            Start shopping
          </Link>
        </div>
      ) : (
        orders.map((order, i) => (
          <div key={i} style={{ border: `0.5px solid ${C.border}`, background: C.white, padding: "16px", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ ...F(11, 500, C.ink) }}>Order #{order.id}</span>
              <span style={{ ...F(10, 400, "#888") }}>{order.date}</span>
            </div>
            <div style={{ ...F(10, 400, "#888"), marginBottom: 4 }}>{order.items?.length} item(s)</div>
            <div style={{ ...Ser(16, 300, C.tan) }}>SAR {order.total}</div>
            <Link to={`/tracking?order=${order.id}`} style={{ ...F(10, 400, C.brandRed), textDecoration: "underline", marginTop: 8, display: "inline-block" }}>
              Track Order →
            </Link>
          </div>
        ))
      )}
    </div>
  );
}