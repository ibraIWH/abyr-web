import { C, F, Ser } from '../designTokens';

export default function SplashScreen() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: C.sand,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div style={{ ...Ser(56, 300, C.brandRed), marginBottom: 12 }}>abyr</div>
      <div style={{ ...F(10, 300, C.gold), letterSpacing: 4, textTransform: 'uppercase', marginBottom: 32 }}>
        Modest Fashion
      </div>
      <div
        style={{
          width: 32,
          height: 32,
          border: `2px solid ${C.border}`,
          borderTopColor: C.brandRed,
          borderRadius: '50%',
          animation: 'spin 0.9s linear infinite',
        }}
      />
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}