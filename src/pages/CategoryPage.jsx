import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { C, F, Ser } from "../designTokens";

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products", { params: { category: slug } })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);
<Breadcrumb items={[
  { label: "Home", to: "/" },
  { label: slug },
]} />
  return (
    <div style={{ background: C.sand, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ padding: "28px 64px" }}>
        <h1 style={{ ...Ser(32, 300, C.ink), marginBottom: 28, textTransform: "capitalize" }}>
          {slug}
        </h1>
        {loading ? (
          <div style={{ textAlign: "center", padding: 40, ...F(14, 400, "#888") }}>Loading...</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, ...F(14, 400, "#888") }}>
            No products found in this category.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
        <div style={{ marginTop: 28 }}>
          <Link to="/" style={{ ...F(10, 400, C.tan), textDecoration: "underline" }}>← Back to Home</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}