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
  const currentDotSize = isMobile ? 22 : 28;
  const labelSize = isMobile ? 7 : 9;
  const dateSize = isMobile ? 6 : 7;
  const tagSize = isMobile ? 5 : 6;
  const tagPadding = isMobile ? '1px 6px' : '2px 10px';
  const progress = (currentIndex / (STATUS_STEPS.length - 1)) * 100;

  return (
    <div style={{ padding: `${isMobile ? '12px' : '20px'} 0`, width: '100%' }}>
      <div style={{ position: 'relative', paddingTop: isMobile ? 6 : 10 }}>
        {/* Line — full width, centered */}
        <div
          style={{
            position: 'absolute',
            top: isMobile ? 14 : 20,
            left: '4%',
            right: '4%',
            height: 2,
            background: C.border,
            zIndex: 0,
          }}
        >
          {/* Colored progress */}
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: C.brandRed,
              transition: 'width 0.6s ease',
            }}
          />
        </div>

        {/* Steps */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 1,
            width: '100%',
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
                  maxWidth: '25%',
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
                      ? `0 0 0 ${isMobile ? '3px' : '5px'} rgba(196,168,130,0.2)`
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
                    marginTop: isMobile ? 4 : 8,
                    letterSpacing: 0.2,
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%',
                    width: '100%',
                    padding: '0 2px',
                  }}
                >
                  {step.label}
                </div>

                {/* Date — only for current */}
                {isCurrent && (
                  <div
                    style={{
                      ...F(dateSize, 400, C.tan),
                      marginTop: isMobile ? 2 : 4,
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {date}
                  </div>
                )}

                {/* "Current" tag — only for current */}
                {isCurrent && (
                  <div
                    style={{
                      marginTop: isMobile ? 2 : 4,
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
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}