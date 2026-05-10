import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { C, F, Ser } from "../designTokens";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    api.get("/products", { params: { search: query } })
      .then(res => setProducts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div style={{ background: C.sand, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ padding: "28px 64px" }}>
        <h1 style={{ ...Ser(28, 300, C.ink), marginBottom: 24 }}>
          {query ? `Search results for "${query}"` : "Search"}
        </h1>
        {loading ? (
          <div style={{ textAlign: "center", padding: 40, ...F(14, 400, "#888") }}>Searching...</div>
        ) : products.length === 0 ? (
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
  );
}