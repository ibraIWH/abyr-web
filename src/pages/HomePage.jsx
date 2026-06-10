import { useEffect, useState } from "react";
import api from "../api";
import CategoryNav from "../components/CategoryNav";
import Footer from "../components/Footer";
import Layout from "../components/Layout"; // ← THIS WAS MISSING
import NewsletterSection from "../components/NewsletterSection";
import ProductCard from "../components/ProductCard";
import RecentlyViewed from "../components/RecentlyViewed";
import TestimonialsSection from "../components/TestimonialsSection";
import { C, F, Ser } from "../designTokens";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div
        style={{
          background: C.sand,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Hero */}
        <div
          style={{
            background: `linear-gradient(135deg, ${C.brandRed}, ${C.brandRed})`,
            padding: "52px 64px",
            color: C.cream,
          }}
        >
          <div style={{ maxWidth: 600 }}>
            <div
              style={{
                ...F(10, 300, C.gold),
                letterSpacing: 4,
                marginBottom: 16,
              }}
            >
              NEW COLLECTION · SPRING 2026
            </div>
            <div style={{ ...Ser(48, 300, C.cream) }}>abyr</div>
            <div
              style={{
                ...F(12, 300, "rgba(255,255,255,0.4)"),
                lineHeight: 1.9,
                margin: "12px 0 32px",
              }}
            >
              Handcrafted abayas designed for the modern woman. Free delivery over
              SAR 200.
            </div>
            <div
              style={{
                ...F(11, 500, C.ink),
                background: C.gold,
                padding: "13px 28px",
                display: "inline-block",
                cursor: "pointer",
              }}
            >
              SHOP NOW
            </div>
          </div>
        </div>

        <CategoryNav />

        {/* Products grid */}
        <div style={{ padding: "40px 64px" }}>
          <h2 style={{ ...Ser(32, 300, C.ink), marginBottom: 28 }}>
            New Arrivals
          </h2>
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: 40,
                ...F(14, 400, "#888"),
              }}
            >
              Loading...
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: 20,
              }}
            >
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* Additional sections */}
        <RecentlyViewed />
        <TestimonialsSection />
        <NewsletterSection />

        <Footer />
      </div>
    </Layout>
  );
}