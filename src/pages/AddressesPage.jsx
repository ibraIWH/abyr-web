import { useState } from "react";
import { C, F, Ser } from "../designTokens";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState(
    JSON.parse(localStorage.getItem("savedAddresses") || "[]")
  );
  const [showForm, setShowForm] = useState(false);
  const [newAddr, setNewAddr] = useState({ name: "", line1: "", city: "", phone: "" });

  const save = () => {
    if (!newAddr.name || !newAddr.line1 || !newAddr.city) return;
    const updated = [...addresses, newAddr];
    localStorage.setItem("savedAddresses", JSON.stringify(updated));
    setAddresses(updated);
    setShowForm(false);
    setNewAddr({ name: "", line1: "", city: "", phone: "" });
  };

  const deleteAddr = (index) => {
    const updated = addresses.filter((_, i) => i !== index);
    localStorage.setItem("savedAddresses", JSON.stringify(updated));
    setAddresses(updated);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ ...Ser(28, 300, C.ink) }}>Addresses</div>
        <div
          onClick={() => setShowForm(!showForm)}
          style={{
            border: `0.5px solid ${C.brandRed}`,
            padding: "9px 18px",
            ...F(9, 400, C.brandRed),
            letterSpacing: 2,
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          + ADD ADDRESS
        </div>
      </div>

      {showForm && (
        <div style={{ background: C.white, border: "0.5px solid #DDD", padding: "20px", marginBottom: 20 }}>
          {["name", "line1", "city", "phone"].map((field) => (
            <input
              key={field}
              placeholder={field === "phone" ? "Phone (optional)" : field}
              value={newAddr[field]}
              onChange={(e) => setNewAddr({ ...newAddr, [field]: e.target.value })}
              style={{
                width: "100%",
                border: "0.5px solid #DDD",
                padding: "10px",
                marginBottom: 12,
                ...{ fontFamily: "'DM Sans', sans-serif", fontSize: 13 },
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          ))}
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={save} style={{ background: C.brandRed, color: C.cream, border: "none", padding: "10px 20px", ...F(11, 500), cursor: "pointer" }}>
              Save
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{ border: "0.5px solid #CCC", background: "white", padding: "10px 20px", ...F(11, 400, "#888"), cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {addresses.map((addr, index) => (
        <div key={index} style={{ border: `0.5px solid ${C.border}`, padding: "16px", marginBottom: 12, background: C.white }}>
          <div style={{ ...F(12, 500, C.ink), marginBottom: 6 }}>{addr.name}</div>
          <div style={{ ...F(11, 400, "#888"), lineHeight: 1.6 }}>{addr.line1}, {addr.city}</div>
          {addr.phone && <div style={{ ...F(11, 400, "#888") }}>{addr.phone}</div>}
          <div style={{ marginTop: 12, display: "flex", gap: 16 }}>
            <span style={{ ...F(10, 400, C.tan), cursor: "pointer", letterSpacing: 1 }}>EDIT</span>
            <span onClick={() => deleteAddr(index)} style={{ ...F(10, 400, C.red), cursor: "pointer", letterSpacing: 1 }}>DELETE</span>
          </div>
        </div>
      ))}
      {addresses.length === 0 && !showForm && (
        <div style={{ ...F(13, 400, "#888") }}>No addresses saved yet.</div>
      )}
    </div>
  );
}