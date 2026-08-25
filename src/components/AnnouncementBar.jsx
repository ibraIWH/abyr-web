import { useSettings } from '../context/SettingsContext';
import { C, F } from '../designTokens';

export default function AnnouncementBar() {
  const { newsText, newsActive } = useSettings();

  // If news is disabled by admin, hide the bar completely
  if (!newsActive) return null;

  const message = newsText || 'FREE DELIVERY OVER SAR 200 · NEW COLLECTION · EASY RETURNS';

  return (
    <>
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

      <div
        style={{
          background: C.ink,
          color: C.cream,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          position: 'sticky',
          top: 0,
          zIndex: 1001,
          padding: '8px 0',
        }}
      >
        <div className="announcement-track" style={{ ...F(10, 400, C.cream), letterSpacing: 1.5 }}>
          {message} &nbsp;·&nbsp; {message} &nbsp;·&nbsp; {message}
        </div>
      </div>
    </>
  );
}