import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { C, F, Ser } from "../designTokens";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("cart");
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/");
  };

  return (
    <div>
      <div style={{ ...Ser(28, 300, C.ink), marginBottom: 24 }}>Settings</div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ ...F(11, 400, "#888"), marginBottom: 8 }}>Account security</div>
        <div style={{ ...F(13, 400, C.ink), padding: "12px 0", borderBottom: "0.5px solid #EEE", cursor: "not-allowed", opacity: 0.6 }}>
          Change password
        </div>
      </div>
      <button
        onClick={() => setShowConfirm(true)}
        style={{
          background: C.red,
          color: C.white,
          border: "none",
          padding: "12px 28px",
          ...F(11, 500),
          letterSpacing: 2,
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        Sign Out
      </button>
      {showConfirm && (
        <div style={{ marginTop: 12, background: "#FFEBEE", padding: 12 }}>
          <div style={{ ...F(10, 400, C.red), marginBottom: 8 }}>Are you sure you want to sign out?</div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={handleSignOut} style={{ background: C.red, color: C.white, border: "none", padding: "6px 14px", ...F(10, 500), cursor: "pointer" }}>
              Yes, Sign Out
            </button>
            <button onClick={() => setShowConfirm(false)} style={{ background: "#EEE", color: "#666", border: "none", padding: "6px 14px", ...F(10, 500), cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}