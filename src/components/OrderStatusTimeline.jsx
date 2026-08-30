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

  const dotSize = isMobile ? 16 : 22;
  const labelSize = isMobile ? 8 : 10;
  const dateSize = isMobile ? 7 : 9;
  const tagSize = isMobile ? 6 : 7;
  const tagPadding = isMobile ? '1px 6px' : '2px 10px';
  const progress = (currentIndex / (STATUS_STEPS.length - 1)) * 100;

  // Fixed height for every step — prevents any misalignment
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
        {/* Progress line */}
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
          const isCurrent = index === currentIndex;

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
                height: STEP_HEIGHT,
                justifyContent: 'flex-start',
              }}
            >
              {/* Dot — filled ONLY for current step */}
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
                    width: dotSize,
                    height: dotSize,
                    borderRadius: '50%',
                    background: isCurrent ? C.brandRed : 'transparent',
                    border: `2px solid ${isCurrent ? C.brandRed : C.border}`,
                    boxShadow: isCurrent
                      ? `0 0 0 ${isMobile ? '3px' : '5px'} rgba(196,168,130,0.2)`
                      : 'none',
                    transition: 'all 0.3s ease',
                    flexShrink: 0,
                  }}
                />
              </div>

              {/* Label — all labels stay in the same position */}
              <div
                style={{
                  ...F(labelSize, isCurrent ? 500 : 400, isCurrent ? C.ink : '#999'),
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

              {/* Extra content — date + "Current" tag (fixed height so it never pushes anything) */}
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
                      Current   {/* ← Fixed: was "SUBMIT" — now correctly "Current" */}
                    </div>
                  </>
                ) : (
                  /* Empty spacer — keeps every step the same height */
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