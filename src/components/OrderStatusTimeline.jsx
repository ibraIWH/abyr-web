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

  // Fixed heights for each row — keeps everything aligned
  const dotRowHeight = isMobile ? 30 : 40;
  const labelRowHeight = isMobile ? 20 : 28;
  const extraRowHeight = isMobile ? 28 : 36;
  const totalStepHeight = dotRowHeight + labelRowHeight + extraRowHeight;

  return (
    <div style={{ padding: `${isMobile ? '12px' : '20px'} 0`, width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
        {/* Line — centered in the dot row */}
        <div
          style={{
            position: 'absolute',
            top: dotRowHeight / 2,
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

        {/* Steps */}
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
                height: totalStepHeight,
                justifyContent: 'flex-start',
              }}
            >
              {/* Row 1: Dot */}
              <div
                style={{
                  height: dotRowHeight,
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

              {/* Row 2: Label */}
              <div
                style={{
                  height: labelRowHeight,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  ...F(labelSize, isActive ? 500 : 400, isActive ? C.ink : '#999'),
                  letterSpacing: 0.2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  padding: '0 2px',
                }}
              >
                {step.label}
              </div>

              {/* Row 3: Extra (date + current tag) — fixed height so all steps align */}
              <div
                style={{
                  height: extraRowHeight,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  gap: isMobile ? 1 : 2,
                }}
              >
                {isCurrent && (
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
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}