import { C, F, Ser } from "../designTokens";
export default function Footer() {
  return (
    <div style={{ background: C.ink, padding: "40px 64px", marginTop: "auto" }}>
      <div style={{ ...Ser(28, 300, C.cream), marginBottom: 12 }}>abyr</div>
      <div style={{ ...F(10, 400, "rgba(255,255,255,0.3)") }}>© 2026 Abyr Line. All rights reserved.</div>
    </div>
  );
}