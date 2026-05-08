import { C, F, Ser } from "../designTokens";

export default function FavouritesPage() {
  return (
    <div>
      <div style={{ ...Ser(28, 300, C.ink), marginBottom: 24 }}>Favourites</div>
      <div style={{ ...F(13, 400, "#888") }}>
        You haven't favourited any items yet. Browse our collection and tap the heart icon.
      </div>
    </div>
  );
}