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

  const dotSize = isMobile ? 14 : 20;
  const currentDotSize = isMobile ? 20 : 28;
  const labelSize = isMobile ? 8 : 10;
  const dateSize = isMobile ? 7 : 9;
  const tagSize = isMobile ? 6 : 7;
  const tagPadding = isMobile ? '1px 6px' : '2px 10px';
  const progress = (currentIndex / (STATUS_STEPS.length - 1)) * 100;

  // FIXED: Every step gets the same height
  const STEP_HEIGHT = isMobile ? 90 : 120;

  return (
    <div style={{ padding: `${isMobile ? '12px' : '20px'} 0`, width: '100%' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        {/* Line — centered vertically in the dot area */}
        <div
          style={{
            position: 'absolute',
            top: isMobile ? 16 : 22,
            left: '4%',
            right: '4%',
            height: 2,
            background: C.border,
            zIndex: 0,
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: C.brandRed,
              transition: 'width 0.6s ease',
            }}
          />
        </div>

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
                width: '25%',
                position: 'relative',
                zIndex: 1,
                height: STEP_HEIGHT, // ← FIXED HEIGHT for every step
                justifyContent: 'flex-start',
              }}
            >
              {/* Dot */}
              <div
                style={{
                  height: isMobile ? 30 : 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    width: size,
                    height: size,
                    borderRadius: '50%',
                    background: isActive ? C.brandRed : C.border,
                    border: isCurrent ? `2px solid ${C.gold}` : 'none',
                    boxShadow: isCurrent
                      ? `0 0 0 ${isMobile ? '3px' : '5px'} rgba(196,168,130,0.2)`
                      : 'none',
                    transition: 'all 0.3s ease',
                    flexShrink: 0,
                  }}
                />
              </div>

              {/* Label */}
              <div
                style={{
                  ...F(labelSize, isActive ? 500 : 400, isActive ? C.ink : '#999'),
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  padding: '0 2px',
                  lineHeight: 1.3,
                  height: isMobile ? 20 : 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                {step.label}
              </div>

              {/* Extra content (date + tag) — same height for all steps */}
              <div
                style={{
                  height: isMobile ? 36 : 48,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  gap: isMobile ? 1 : 2,
                }}
              >
                {isCurrent ? (
                  <>
                    <div
                      style={{
                        ...F(dateSize, 400, C.tan),
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {date}
                    </div>
                    <div
                      style={{
                        background: C.gold,
                        color: C.ink,
                        ...F(tagSize, 700),
                        letterSpacing: 0.3,
                        textTransform: 'uppercase',
                        padding: tagPadding,
                        borderRadius: 8,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Current
                    </div>
                  </>
                ) : (
                  /* Empty spacer so the step keeps its height */
                  <div style={{ height: isMobile ? 32 : 44 }} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}