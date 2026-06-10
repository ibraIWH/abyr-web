import { useState } from "react";
import { C, F, Ser } from "../designTokens";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ background: C.cream, padding: "48px 64px", textAlign: "center" }}>
        <h2 style={Ser(28, 300, C.ink)}>Thank You</h2>
        <p style={F(13, 400, "#888")}>You're on the list. We'll keep you posted.</p>
      </div>
    );
  }

  return (
    <div style={{ background: C.brandRed, padding: "48px 64px", textAlign: "center" }}>
      <h2 style={Ser(28, 300, C.cream)}>Join the Abyr List</h2>
      <p style={{ ...F(13, 400, C.cream), opacity: 0.8, marginBottom: 24 }}>
        Be the first to know about new collections and exclusive offers.
      </p>
      <form onSubmit={handleSubmit} style={{ display: "flex", justifyContent: "center", maxWidth: 480, margin: "0 auto" }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          style={{
            flex: 1,
            padding: "10px 16px",
            border: "none",
            background: "rgba(255,255,255,0.15)",
            color: C.cream,
            ...F(13, 400, C.cream),
            outline: "none",
          }}
        />
        <button
          type="submit"
          style={{
            background: C.gold,
            color: C.ink,
            border: "none",
            padding: "10px 24px",
            ...F(11, 500, C.ink),
            letterSpacing: 2,
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}