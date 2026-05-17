import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { C, F, Ser } from "../designTokens";

export default function PhoneVerifyPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState(user?.phone || "");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("phone");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!user) {
    return (
      <div style={{ background: C.sand, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ ...Ser(28, 300, C.ink), marginBottom: 12 }}>Please log in first</div>
            <div onClick={() => navigate("/signin")} style={{ background: C.brandRed, color: C.cream, padding: "12px 28px", display: "inline-block", cursor: "pointer", ...F(11, 500), letterSpacing: 2, textTransform: "uppercase" }}>
              Sign In
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSendSMS = async () => {
    if (!phone.trim()) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await api.post("/auth/send-sms", { phone });
      setMessage(res.data.message || "Code sent!");
      setStep("code");
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to send SMS. Please try again.";
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await api.post("/auth/verify-sms", { code });
      setMessage(res.data.message || "Phone verified! Redirecting...");
      setTimeout(() => navigate("/account"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: C.sand, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <div style={{ maxWidth: 420, width: "100%", background: C.white, padding: "36px", border: `0.5px solid ${C.border}` }}>
          <div style={{ ...Ser(28, 300, C.ink), marginBottom: 24 }}>Phone Verification</div>
          {message && (
            <div style={{ background: "#F5F5F3", padding: 10, marginBottom: 20, ...F(11, 400) }}>{message}</div>
          )}

          {step === "phone" ? (
            <>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+9665XXXXXXXX"
                style={{ width: "100%", borderBottom: "1px solid #CCC", padding: "8px 0", marginBottom: 20, ...F(13, 400, C.ink), outline: "none", background: "transparent" }}
                type="tel"
              />
              <button
                onClick={handleSendSMS}
                disabled={loading}
                style={{ width: "100%", padding: "14px", background: C.brandRed, color: C.cream, border: "none", ...F(11, 500), letterSpacing: 2, cursor: "pointer", marginBottom: 16 }}
              >
                {loading ? "Sending..." : "Send Verification Code"}
              </button>
            </>
          ) : (
            <>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                style={{ width: "100%", borderBottom: "1px solid #CCC", padding: "8px 0", marginBottom: 20, ...F(18, 500, C.ink), textAlign: "center", outline: "none", background: "transparent" }}
              />
              <button
                onClick={handleVerify}
                disabled={loading}
                style={{ width: "100%", padding: "14px", background: C.brandRed, color: C.cream, border: "none", ...F(11, 500), letterSpacing: 2, cursor: "pointer", marginBottom: 16 }}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
              <div style={{ textAlign: "center", ...F(11, 400, "#888") }}>
                Didn't receive the code?{" "}
                <span onClick={() => setStep("phone")} style={{ color: C.brandRed, cursor: "pointer", fontWeight: 500 }}>
                  Change number
                </span>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}