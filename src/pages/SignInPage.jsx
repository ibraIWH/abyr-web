import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { C, F, Ser } from "../designTokens";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      const redirectTo = searchParams.get("redirect") || "/";
      navigate(redirectTo);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
    <div style={{ background: C.sand, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex" }}>
        {/* … same JSX as before, no changes needed ... */}
        {/* Left side */}
        <div style={{ flex: 1, background: `linear-gradient(135deg, ${C.brandRed}, ${C.brandRed})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ ...Ser(64, 300, C.cream) }}>abyr</div>
            <div style={{ ...F(10, 300, C.gold), letterSpacing: 4, marginTop: 8, textTransform: "uppercase" }}>Hargeisa · Online</div>
          </div>
        </div>

        {/* Right side */}
        <div style={{ width: 460, padding: "48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ ...Ser(28, 300, C.ink), marginBottom: 4 }}>Welcome back</div>
          <div style={{ ...F(11, 400, "#888"), marginBottom: 28 }}>Sign in to your Abyr account</div>
          {error && <div style={{ background: "#FFEBEE", color: C.red, padding: "10px 14px", marginBottom: 20, ...F(10, 400) }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <div style={{ ...F(9, 500, C.tan), letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Email</div>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required
                style={{ width: "100%", border: "none", borderBottom: "1px solid #CCC", padding: "8px 0", ...F(13, 400, C.ink), outline: "none", background: "transparent" }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ ...F(9, 500, C.tan), letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Password</div>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" required
                style={{ width: "100%", border: "none", borderBottom: "1px solid #CCC", padding: "8px 0", ...F(13, 400, C.ink), outline: "none", background: "transparent" }} />
            </div>
            <button type="submit" disabled={loading}
              style={{ width: "100%", padding: "14px", background: loading ? "#888" : C.brandRed, color: C.cream, border: "none", ...F(11, 500, C.cream), letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", marginBottom: 20 }}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <div style={{ textAlign: "center", ...F(11, 400, "#888") }}>
            Don't have an account? <Link to="/signup" style={{ color: C.brandRed, fontWeight: 500, textDecoration: "none" }}>Create one</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    </Layout>
  );
}