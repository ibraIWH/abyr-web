import { useEffect, useState } from "react";
import api from "../api";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";
import { C, F, Ser } from "../designTokens";

export default function FavouritesPage() {
  const { user } = useAuth();
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api.get("/favourites")
      .then(res => setFavourites(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: 40, ...F(14, 400, "#888") }}>
        Please sign in to view your favourites.
      </div>
    );
  }

  return (
    <div style={{ background: C.sand, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ padding: "28px 64px" }}>
        <h1 style={{ ...Ser(32, 300, C.ink), marginBottom: 28 }}>My Favourites</h1>
        {loading ? (
          <div style={{ textAlign: "center", padding: 40, ...F(14, 400, "#888") }}>Loading...</div>
        ) : favourites.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, ...F(14, 400, "#888") }}>
            No favourites yet. Tap the heart on any product to add it here.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
            {favourites.map(fav => (
              <ProductCard key={fav._id} product={fav.product} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}