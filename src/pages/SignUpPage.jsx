import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { C, F, Ser } from "../designTokens";

const API_BASE = "https://abbayah-backend.onrender.com/api";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/register`, { name, email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: C.sand, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ flex: 1, display: "flex" }}>
        {/* Left – brand side */}
        <div style={{ flex: 1, background: `linear-gradient(135deg, ${C.brandRed}, ${C.brandRed})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ ...Ser(64, 300, C.cream) }}>abyr</div>
            <div style={{ ...F(10, 300, C.gold), letterSpacing: 4, marginTop: 8, textTransform: "uppercase" }}>Join us</div>
          </div>
        </div>

        {/* Right – form */}
        <div style={{ width: 460, padding: "48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ ...Ser(28, 300, C.ink), marginBottom: 4 }}>Create Account</div>
          <div style={{ ...F(11, 400, "#888"), marginBottom: 28 }}>Join Abyr Line for exclusive access</div>

          {error && (
            <div style={{ background: "#FFEBEE", color: C.red, padding: "10px 14px", marginBottom: 20, ...F(10, 400) }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <div style={{ ...F(9, 500, C.tan), letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Full Name</div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                style={{ width: "100%", border: "none", borderBottom: "1px solid #CCC", padding: "8px 0", ...F(13, 400, C.ink), outline: "none", background: "transparent" }}
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ ...F(9, 500, C.tan), letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Email</div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                style={{ width: "100%", border: "none", borderBottom: "1px solid #CCC", padding: "8px 0", ...F(13, 400, C.ink), outline: "none", background: "transparent" }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ ...F(9, 500, C.tan), letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Password</div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
                style={{ width: "100%", border: "none", borderBottom: "1px solid #CCC", padding: "8px 0", ...F(13, 400, C.ink), outline: "none", background: "transparent" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: loading ? "#888" : C.brandRed,
                color: C.cream,
                border: "none",
                ...F(11, 500, C.cream),
                letterSpacing: 2,
                textTransform: "uppercase",
                cursor: "pointer",
                marginBottom: 20,
              }}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div style={{ textAlign: "center", ...F(11, 400, "#888") }}>
            Already a member?{" "}
            <Link to="/signin" style={{ color: C.brandRed, fontWeight: 500, textDecoration: "none" }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}