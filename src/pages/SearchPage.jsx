import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api";
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import { C, F, Ser } from "../designTokens";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const performSearch = (term) => {
    if (!term.trim()) {
      setProducts([]);
      return;
    }
    setLoading(true);
    api.get("/products", { params: { search: term } })
      .then(res => setProducts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update the URL without reloading the page
    navigate(`/search?q=${encodeURIComponent(query)}`);
    performSearch(query);
  };

  return (
    <Layout>
    <div style={{ background: C.sand, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "28px 64px" }}>
        {/* Search Input */}
        <form onSubmit={handleSubmit} style={{ display: "flex", marginBottom: 24 }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search abayas, jalabiya..."
            style={{
              flex: 1,
              border: `0.5px solid ${C.border}`,
              padding: "10px 16px",
              ...F(14, 400, C.ink),
              outline: "none",
              background: C.white,
            }}
          />
          <button
            type="submit"
            style={{
              background: C.brandRed,
              color: C.cream,
              border: "none",
              padding: "10px 24px",
              ...F(11, 500, C.cream),
              letterSpacing: 2,
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </form>

        {/* Results Header */}
        {query && (
          <h1 style={{ ...Ser(28, 300, C.ink), marginBottom: 24 }}>
            {loading ? "Searching..." : `Results for "${query}"`}
          </h1>
        )}

        {/* Results */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 40, ...F(14, 400, "#888") }}>
            Searching...
          </div>
        ) : products.length === 0 && query ? (
          <div style={{ textAlign: "center", padding: 40, ...F(14, 400, "#888") }}>
            No products found. Try a different keyword.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
    </Layout>
  );
}