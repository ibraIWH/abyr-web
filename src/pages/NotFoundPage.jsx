import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import { C, F, Ser } from "../designTokens";

export default function NotFoundPage() {
  return (
    <Layout>
    <div style={{ background: C.sand, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
   
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <h1 style={{ ...Ser(72, 300, C.ink), marginBottom: 16 }}>404</h1>
        <p style={{ ...F(16, 400, "#888"), marginBottom: 32 }}>Page not found</p>
        <Link
          to="/"
          style={{
            background: C.brandRed,
            color: C.cream,
            padding: "12px 32px",
            textDecoration: "none",
            ...F(11, 500, C.cream),
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Back to Home
        </Link>
      </div>
      <Footer />
    </div>
    </Layout>
  );
}