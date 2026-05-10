import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { C, F, Ser } from "../designTokens";

export default function EmailVerifyPage() {
  const navigate = useNavigate();

  return (
    <div style={{ background: C.sand, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 480, padding: "0 24px" }}>
          <div style={{ width: 80, height: 80, border: `1px solid ${C.gold}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <div style={{ ...Ser(32, 300, C.ink), marginBottom: 12 }}>Verify your email</div>
          <div style={{ ...F(12, 400, "#888"), lineHeight: 1.8, marginBottom: 28 }}>
            We've sent a verification link to your email. Please click the link to activate your account.
          </div>
          <button
            onClick={() => navigate("/")}
            style={{
              width: "100%", padding: "14px",
              background: C.brandRed, color: C.cream, border: "none",
              ...F(11, 500, C.cream), letterSpacing: 2, textTransform: "uppercase", cursor: "pointer"
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}