import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api";
import Layout from "../components/Layout";
import { C, F, Ser } from "../designTokens";

export default function EmailVerifyPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "your email";
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");
  const [verifying, setVerifying] = useState(false);

  // Auto-verify if the URL contains the token
  useEffect(() => {
    const token = window.location.pathname.split("/verify-email/")[1];
    if (token) {
      setVerifying(true);
      setMessage("Verifying your email...");
      api
        .post(`/auth/verify-email/${token}`)
        .then(() => {
          setMessage("Email verified! Redirecting to home...");
          window.dispatchEvent(new Event("userUpdated"));   // <-- update user in context
          setTimeout(() => navigate("/"), 3000);
        })
        .catch((err) => {
          setMessage(err.response?.data?.message || "Invalid or expired link.");
        })
        .finally(() => setVerifying(false));
    }
  }, [navigate]);

  const handleResend = async () => {
    setResending(true);
    try {
      await api.post("/auth/resend-email-verification");
      setMessage("Verification email resent. Please check your inbox.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to resend.");
    } finally {
      setResending(false);
    }
  };

  return (
    <Layout>
    <div style={{ background: C.sand, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <div style={{ width: 80, height: 80, border: `1px solid ${C.gold}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <div style={{ ...Ser(32, 300, C.ink), marginBottom: 12 }}>Verify your email</div>

          {verifying ? (
            <p style={{ ...F(14, 400, "#888") }}>Verifying your email...</p>
          ) : (
            <>
              <p style={{ ...F(13, 400, "#888"), lineHeight: 1.8, marginBottom: 8 }}>
                We sent a verification link to <strong style={{ color: C.ink }}>{email}</strong>.
              </p>
              {message && (
                <div style={{ background: "#E8F5E9", color: "#2E7D32", padding: 10, marginBottom: 16, ...F(11, 400) }}>
                  {message}
                </div>
              )}
              <button
                onClick={() => navigate("/")}
                style={{
                  width: "100%", maxWidth: 320, margin: "0 auto", padding: "14px",
                  background: C.brandRed, color: C.cream, border: "none",
                  ...F(11, 500, C.cream), letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", marginBottom: 16
                }}
              >
                Continue Shopping
              </button>
              <div style={{ ...F(11, 400, "#888") }}>
                Didn't receive the email?{" "}
                <span onClick={handleResend} style={{ color: C.brandRed, cursor: "pointer", fontWeight: 500 }}>
                  {resending ? "Resending..." : "Resend"}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
   
    </div>
    </Layout>
  );
}