import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import CategoryNav from "../components/CategoryNav";
import FilterSidebar from "../components/FilterSidebar";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import { C, F, Ser } from "../designTokens";

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("relevance");

  useEffect(() => {
    api.get("/products", { params: { category: slug } })
      .then((res) => {
        setProducts(res.data);
        setFilteredProducts(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleSort = (order) => {
    setSortBy(order);
    let sorted = [...filteredProducts];
    if (order === "price-low") sorted.sort((a, b) => a.price - b.price);
    else if (order === "price-high") sorted.sort((a, b) => b.price - a.price);
    else sorted = [...filteredProducts];
    setFilteredProducts(sorted);
  };

  return (
    <Layout>
      <div style={{ background: C.sand, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* CategoryNav – no longer sticky, scrolls with the page */}
        <CategoryNav />

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <FilterSidebar
            products={products}
            onFilter={(filtered) => setFilteredProducts(filtered)}
          />
          <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h1 style={{ ...Ser(28, 300, C.ink), textTransform: "capitalize", marginBottom: 4 }}>
                  {slug}
                </h1>
                <div style={{ ...F(11, 400, "#888") }}>{filteredProducts.length} items</div>
              </div>
              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                style={{
                  border: `0.5px solid ${C.border}`,
                  padding: "6px 12px",
                  ...F(10, 400, C.ink),
                  outline: "none",
                  background: C.white,
                }}
              >
                <option value="relevance">Sort by: Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: 40, ...F(14, 400, "#888") }}>Loading...</div>
            ) : filteredProducts.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, ...F(14, 400, "#888") }}>
                No products found with these filters.
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: 16 }}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
        
      </div>
    </Layout>
  );
}