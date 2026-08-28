import { C, F, Ser } from "../designTokens";

const reviews = [
  { text: "The quality is exceptional. Every detail is perfectly crafted.", name: "Nour A.", location: "Riyadh" },
  { text: "Beautiful abayas, fast delivery. Exactly as described.", name: "Hana M.", location: "Jeddah" },
  { text: "My go-to for all occasions. The Fleuri Breeze is stunning.", name: "Sara K.", location: "Dammam" },
];

export default function TestimonialsSection() {
  return (
    <div style={{ background: C.linen, padding: "clamp(36px, 6vw, 52px) clamp(16px, 5vw, 64px)", textAlign: "center" }}>
      <div style={{ ...F(9, 500, C.tan), letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Reviews</div>
      <h2 style={{ ...Ser(30, 300, C.ink), marginBottom: 36 }}>What Our Customers Say</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 20 }}>
        {reviews.map((review, i) => (
          <div key={i} style={{ background: C.white, padding: "28px 24px", textAlign: "left", border: `0.5px solid ${C.border}` }}>
            <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
              {[1,2,3,4,5].map((star) => (
                <svg key={star} width="12" height="12" viewBox="0 0 24 24" fill={C.gold}>
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <div style={{ ...Ser(16, 300, C.ink), lineHeight: 1.8, marginBottom: 14 }}>"{review.text}"</div>
            <div style={{ ...F(10, 400, "#888") }}>{review.name} · {review.location}</div>
          </div>
        ))}
      </div>
    </div>
  );
}