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
  const currentDotSize = isMobile ? 22 : 30;
  const labelSize = isMobile ? 8 : 10;
  const dateSize = isMobile ? 7 : 9;
  const tagSize = isMobile ? 6 : 7;
  const tagPadding = isMobile ? '1px 6px' : '2px 10px';
  const progress = (currentIndex / (STATUS_STEPS.length - 1)) * 100;

  // Grid styles: 4 columns, 3 rows
  const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gridTemplateRows: isMobile ? '30px 24px 40px' : '40px 32px 50px',
    position: 'relative',
    padding: '0 4%',
  };

  // Line overlay (absolute positioned across the grid)
  const lineStyle = {
    position: 'absolute',
    top: isMobile ? 15 : 20,
    left: '8%',
    right: '8%',
    height: 2,
    background: C.border,
    zIndex: 0,
  };

  const progressStyle = {
    width: `${progress}%`,
    height: '100%',
    background: C.brandRed,
    transition: 'width 0.6s ease',
  };

  // Helper to get dot for a step
  const getDot = (index) => {
    const isActive = index <= currentIndex;
    const isCurrent = index === currentIndex;
    const size = isCurrent ? currentDotSize : dotSize;
    return (
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
    );
  };

  return (
    <div style={{ padding: `${isMobile ? '12px' : '20px'} 0`, width: '100%' }}>
      <div style={{ position: 'relative' }}>
        {/* Line */}
        <div style={lineStyle}>
          <div style={progressStyle} />
        </div>

        {/* Grid */}
        <div style={gridContainerStyle}>
          {/* Row 1: Dots */}
          {STATUS_STEPS.map((step, index) => (
            <div
              key={`dot-${step.key}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gridRow: 1,
                gridColumn: index + 1,
                zIndex: 1,
              }}
            >
              {getDot(index)}
            </div>
          ))}

          {/* Row 2: Labels */}
          {STATUS_STEPS.map((step, index) => {
            const isActive = index <= currentIndex;
            return (
              <div
                key={`label-${step.key}`}
                style={{
                  gridRow: 2,
                  gridColumn: index + 1,
                  ...F(labelSize, isActive ? 500 : 400, isActive ? C.ink : '#999'),
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  padding: '0 2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1,
                }}
              >
                {step.label}
              </div>
            );
          })}

          {/* Row 3: Extra content (date + tag for current, empty for others) */}
          {STATUS_STEPS.map((step, index) => {
            const isCurrent = index === currentIndex;
            return (
              <div
                key={`extra-${step.key}`}
                style={{
                  gridRow: 3,
                  gridColumn: index + 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1,
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
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}