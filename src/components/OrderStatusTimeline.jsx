import { C, F } from '../designTokens';
import { useIsMobile } from '../responsive';

const STATUS_STEPS = [
  { key: 'placed', label: 'Placed' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
];

export default function OrderStatusTimeline({ status, createdAt }) {
  const isMobile = useIsMobile();
  const currentIndex = STATUS_STEPS.findIndex((s) => s.key === status);
  const date = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Responsive sizes
  const dotSize = isMobile ? 18 : 24;
  const currentDotSize = isMobile ? 24 : 32;
  const labelSize = isMobile ? 8 : 10;
  const dateSize = isMobile ? 7 : 9;
  const tagSize = isMobile ? 6 : 7;
  const tagPadding = isMobile ? '1px 6px' : '2px 10px';

  const progressPercent = (currentIndex / (STATUS_STEPS.length - 1)) * 100;

  return (
    <div
      style={{
        padding: isMobile ? '16px 0' : '24px 0',
        position: 'relative',
      }}
    >
      {/* ----- Line (full width, behind dots) ----- */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: 2,
          background: C.border,
          transform: 'translateY(-50%)',
          zIndex: 0,
        }}
      />

      {/* ----- Progress line (colored portion) ----- */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          height: 2,
          background: C.brandRed,
          width: `${progressPercent}%`,
          transform: 'translateY(-50%)',
          zIndex: 0,
          transition: 'width 0.6s ease',
        }}
      />

      {/* ----- Dots + Labels (on top of line) ----- */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {STATUS_STEPS.map((step, index) => {
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const size = isCurrent ? currentDotSize : dotSize;

          return (
            <div
              key={step.key}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                minWidth: 0,
              }}
            >
              {/* Dot */}
              <div
                style={{
                  width: size,
                  height: size,
                  borderRadius: '50%',
                  background: isActive ? C.brandRed : C.border,
                  border: isCurrent ? `2px solid ${C.gold}` : 'none',
                  boxShadow: isCurrent
                    ? `0 0 0 ${isMobile ? '4px' : '6px'} rgba(196,168,130,0.2)`
                    : 'none',
                  transition: 'all 0.3s ease',
                  flexShrink: 0,
                }}
              />

              {/* Label */}
              <div
                style={{
                  ...F(labelSize, isActive ? 500 : 400, isActive ? C.ink : '#999'),
                  textAlign: 'center',
                  marginTop: isMobile ? 6 : 10,
                  letterSpacing: isMobile ? 0 : 0.3,
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {step.label}
              </div>

              {/* Date — only for current step */}
              {isCurrent && (
                <div
                  style={{
                    ...F(dateSize, 400, C.tan),
                    marginTop: isMobile ? 2 : 4,
                    textAlign: 'center',
                  }}
                >
                  {date}
                </div>
              )}

              {/* "Current" tag */}
              {isCurrent && (
                <div
                  style={{
                    marginTop: isMobile ? 2 : 6,
                    background: C.gold,
                    color: C.ink,
                    ...F(tagSize, 700),
                    letterSpacing: isMobile ? 0.3 : 1,
                    textTransform: 'uppercase',
                    padding: tagPadding,
                    borderRadius: 10,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Current
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}