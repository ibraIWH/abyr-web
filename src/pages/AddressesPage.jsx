import { useState } from "react";
import Layout from "../components/Layout";
import { C, F, Ser } from "../designTokens";

export default function AddressesPage({ standalone = true }) {
  const [addresses, setAddresses] = useState(
    JSON.parse(localStorage.getItem("savedAddresses") || "[]")
  );

  const content = (
    <div style={{ padding: standalone ? "28px 64px" : "0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ ...Ser(28, 300, C.ink) }}>Addresses</div>
        <div style={{ border: `0.5px solid ${C.brandRed}`, padding: "9px 18px", ...F(9, 400, C.brandRed), letterSpacing: 2, textTransform: "uppercase", cursor: "pointer" }}>
          + ADD ADDRESS
        </div>
      </div>
      {addresses.length === 0 ? (
        <div style={{ ...F(13, 400, "#888") }}>No addresses saved yet.</div>
      ) : (
        addresses.map((addr, index) => (
          <div key={index} style={{ border: `0.5px solid ${C.border}`, padding: "16px", marginBottom: 12, background: C.white }}>
            <div style={{ ...F(12, 500, C.ink), marginBottom: 6 }}>{addr.name}</div>
            <div style={{ ...F(11, 400, "#888"), lineHeight: 1.6 }}>{addr.line1}, {addr.city}</div>
            {addr.phone && <div style={{ ...F(11, 400, "#888") }}>{addr.phone}</div>}
            <div style={{ marginTop: 12, display: "flex", gap: 16 }}>
              <span style={{ ...F(10, 400, C.tan), cursor: "pointer", letterSpacing: 1 }}>EDIT</span>
              <span style={{ ...F(10, 400, C.red), cursor: "pointer", letterSpacing: 1 }}>DELETE</span>
            </div>
          </div>
        ))
      )}
    </div>
  );

  if (!standalone) return content;

  return (
    <Layout>
    <div style={{ background: C.sand, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
     
      {content}
      
    </div>
    </Layout>
  );
}