import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import api from "../api";
import CategoryNav from "../components/CategoryNav";
import FilterSidebar from "../components/FilterSidebar";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import { C, F, Ser } from "../designTokens";
import { useIsMobile } from "../responsive";

export default function CategoryPage() {
  const isMobile = useIsMobile();
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const tag = searchParams.get("tag");     // e.g. ?tag=bestSeller
  const sale = searchParams.get("sale");   // ?sale=true
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("relevance");

  useEffect(() => {
    api.get("/products", { params: { category: slug } })
      .then((res) => {
        // Narrow the list when the home page links here with a filter.
        let list = res.data;
        if (tag) list = list.filter((p) => p.tag === tag);
        if (sale === "true") {
          list = list.filter(
            (p) => p.salePrice != null && p.salePrice > 0 && p.salePrice < p.price
          );
        }
        setProducts(list);
        setFilteredProducts(list);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug, tag, sale]);

  // Title reflects the filter rather than the raw slug.
  const heading =
    tag === "bestSeller" ? "Best Sellers"
    : tag === "sellingFast" ? "Selling Fast"
    : sale === "true" ? "On Sale"
    : slug;

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

        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", flex: 1, overflow: isMobile ? "visible" : "hidden" }}>
          <FilterSidebar
            products={products}
            onFilter={(filtered) => setFilteredProducts(filtered)}
          />
          <div style={{ flex: 1, overflowY: "auto", padding: "28px clamp(16px, 4vw, 32px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h1 style={{ ...Ser(28, 300, C.ink), textTransform: "capitalize", marginBottom: 4 }}>
                  {heading}
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
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(220px, 46%), 1fr))", gap: "clamp(10px, 2.5vw, 16px)" }}>
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