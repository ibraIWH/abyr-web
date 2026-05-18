import { C, F } from "../designTokens";

export default function AnnouncementBar() {
  return (
    <div style={{
      background: C.brandRed,
      color: C.cream,
      textAlign: "center",
      padding: "8px 0",
      ...F(10, 400, C.cream),
      letterSpacing: 1.5,
      position: "sticky",
      top: 0,
      zIndex: 1001,
    }}>
      FREE DELIVERY OVER SAR 200 · NEW COLLECTION · EASY RETURNS
    </div>
  );
}