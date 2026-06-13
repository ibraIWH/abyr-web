import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { C, F, Ser } from "../designTokens";
import AddressesPage from "./AddressesPage";
import FavouritesPage from "./FavouritesPage";
import OrdersPage from "./OrdersPage";
import SettingsPage from "./SettingsPage";

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("account");
  const [resendingEmail, setResendingEmail] = useState(false);
  const [emailMsg, setEmailMsg] = useState("");

  if (!user) {
    return (
      <Layout>
        <div style={{ background: C.sand, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
            <div style={{ ...Ser(28, 300, C.ink), marginBottom: 12 }}>Not signed in</div>
            <div style={{ ...F(12, 400, "#888"), marginBottom: 24 }}>Please sign in to view your account.</div>
            <Link to="/signin" style={{ background: C.brandRed, color: C.cream, padding: "12px 28px", textDecoration: "none", ...F(11, 500), letterSpacing: 2, textTransform: "uppercase" }}>
              Sign In
            </Link>
          </div>
          
        </div>
      </Layout>
    );
  }

  const handleSignOut = () => {
    logout();
  };

  const resendVerificationEmail = async () => {
    setResendingEmail(true);
    setEmailMsg("");
    try {
      await api.post("/auth/resend-email-verification");
      setEmailMsg("Verification email sent! Check your inbox.");
    } catch (err) {
      setEmailMsg(err.response?.data?.message || "Failed to resend.");
    } finally {
      setResendingEmail(false);
    }
  };

  return (
    <Layout>
      <div style={{ background: C.sand, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "28px 64px", display: "grid", gridTemplateColumns: "220px 1fr", gap: 48 }}>
          {/* Sidebar */}
          <div style={{ borderRight: `0.5px solid ${C.border}`, paddingRight: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, paddingBottom: 20, borderBottom: `0.5px solid ${C.border}` }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.brandRed, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ ...Ser(16, 400, C.cream) }}>{user.name?.charAt(0) || "U"}</span>
              </div>
              <div>
                <div style={{ ...F(12, 500, C.ink) }}>{user.name}</div>
                <div style={{ ...F(10, 400, "#888") }}>{user.email}</div>
              </div>
            </div>

            {[
              { label: "My account", key: "account" },
              { label: "Orders", key: "orders" },
              { label: "Favourites", key: "favourites" },
              { label: "Addresses", key: "addresses" },
              { label: "Settings", key: "settings" },
            ].map((item) => (
              <div key={item.key} onClick={() => setActiveSection(item.key)}
                style={{ padding: "12px 0", borderBottom: "0.5px solid #F0EDE8", ...F(11, 400, activeSection === item.key ? C.brandRed : "#888"), cursor: "pointer" }}>
                {item.label}
              </div>
            ))}
            <div onClick={handleSignOut}
              style={{ marginTop: 14, paddingTop: 14, borderTop: `0.5px solid ${C.border}`, ...F(11, 400, C.red), cursor: "pointer" }}>
              Sign Out
            </div>
          </div>

          {/* Main content */}
          <div>
            {activeSection === "account" && (
              <div>
                <div style={{ ...Ser(28, 300, C.ink), marginBottom: 24 }}>My Account</div>

                {/* Email Verification Warning */}
                {!user.emailVerified && (
                  <div style={{ background: "#FFF3E0", border: `0.5px solid ${C.amber}`, padding: "14px 16px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ ...F(11, 500, C.amber), marginBottom: 4 }}>⚠️ Email not verified</div>
                      <div style={{ ...F(10, 400, "#888") }}>Check your inbox or resend the verification link.</div>
                      {emailMsg && <div style={{ ...F(10, 400, "#2E7D32"), marginTop: 4 }}>{emailMsg}</div>}
                    </div>
                    <button onClick={resendVerificationEmail} disabled={resendingEmail}
                      style={{ background: C.amber, color: C.white, border: "none", padding: "6px 14px", ...F(10, 500), cursor: "pointer", letterSpacing: 1 }}>
                      {resendingEmail ? "Sending..." : "Resend"}
                    </button>
                  </div>
                )}

                {/* Phone Verification Warning */}
                {!user.phoneVerified && (
                  <div style={{ background: "#FFF3E0", border: `0.5px solid ${C.amber}`, padding: "14px 16px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ ...F(11, 500, C.amber), marginBottom: 4 }}>📱 Phone not verified</div>
                      <div style={{ ...F(10, 400, "#888") }}>Verify your phone number to enable SMS updates.</div>
                    </div>
                    <button onClick={() => navigate("/verify-phone")}
                      style={{ background: C.amber, color: C.white, border: "none", padding: "6px 14px", ...F(10, 500), cursor: "pointer", letterSpacing: 1 }}>
                      Verify Now
                    </button>
                  </div>
                )}

                {/* User Info Fields */}
                {[["Full Name", user.name], ["Email", user.email], ["Role", user.role]].map(([label, val], i) => (
                  <div key={i} style={{ marginBottom: 18 }}>
                    <div style={{ ...F(9, 500, C.tan), letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
                    <div style={{ borderBottom: "1px solid #DDD", paddingBottom: 10, ...F(13, 400, C.ink) }}>{val}</div>
                  </div>
                ))}

                {/* Verification Status */}
                <div style={{ marginTop: 12 }}>
                  <div style={{ ...F(11, 400, C.ink), marginBottom: 6 }}>
                    Email: {user.emailVerified ? "✅ Verified" : "❌ Not verified"}
                  </div>
                  <div style={{ ...F(11, 400, C.ink) }}>
                    Phone: {user.phoneVerified ? "✅ Verified" : (user.phone ? "❌ Not verified" : "❌ Not set")}
                  </div>
                </div>
              </div>
            )}
            {activeSection === "orders" && <OrdersPage standalone={false} />}
            {activeSection === "favourites" && <FavouritesPage standalone={false} />}
            {activeSection === "addresses" && <AddressesPage standalone={false} />}
            {activeSection === "settings" && <SettingsPage standalone={false} />}
          </div>
        </div>

      </div>
    </Layout>
  );
}