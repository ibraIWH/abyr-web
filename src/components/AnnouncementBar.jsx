import { C, F } from "../designTokens";

export default function AnnouncementBar() {
  return (
    <>
      {/* Scrolling animation keyframes */}
      <style>{`
        @keyframes scrollAnnouncement {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .announcement-track {
          display: inline-block;
          white-space: nowrap;
          animation: scrollAnnouncement 25s linear infinite;
        }
      `}</style>

      <div style={{
        background: C.ink,            // ← ink black for a more editorial look
        color: C.cream,
        overflow: "hidden",
        whiteSpace: "nowrap",
        position: "sticky",
        top: 0,
        zIndex: 1001,
        padding: "8px 0",
      }}>
        <div className="announcement-track" style={{ ...F(10, 400, C.cream), letterSpacing: 1.5 }}>
          FREE DELIVERY OVER SAR 200 &nbsp;·&nbsp; NEW COLLECTION &nbsp;·&nbsp; EASY RETURNS &nbsp;·&nbsp;
          FREE DELIVERY OVER SAR 200 &nbsp;·&nbsp; NEW COLLECTION &nbsp;·&nbsp; EASY RETURNS &nbsp;·&nbsp;
          FREE DELIVERY OVER SAR 200 &nbsp;·&nbsp; NEW COLLECTION &nbsp;·&nbsp; EASY RETURNS
        </div>
      </div>
    </>
  );
}