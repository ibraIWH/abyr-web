import { C, F } from '../designTokens';

const STATUS_STEPS = [
  { key: 'placed', label: 'Placed' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
];

export default function OrderStatusTimeline({ status, createdAt }) {
  const currentIndex = STATUS_STEPS.findIndex((s) => s.key === status);
  const date = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const isMobile = window.innerWidth <= 640;

  return (
    <div style={{ padding: '20px 0', width: '100%' }}>
      <div style={{ position: 'relative', paddingTop: 12 }}>
        {/* Horizontal line */}
        <div
          style={{
            position: 'absolute',
            top: 18,
            left: '5%',
            right: '5%',
            height: 2,
            background: C.border,
            zIndex: 0,
          }}
        >
          {/* Progress fill */}
          <div
            style={{
              width: `${(currentIndex / (STATUS_STEPS.length - 1)) * 100}%`,
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
          }}
        >
          {STATUS_STEPS.map((step, index) => {
            const isActive = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const size = isCurrent ? 24 : 16;

            return (
              <div
                key={step.key}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1,
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
                      ? `0 0 0 4px rgba(196,168,130,0.2)`
                      : 'none',
                    transition: 'all 0.3s ease',
                    marginBottom: 8,
                  }}
                />

                {/* Label */}
                <div
                  style={{
                    ...F(9, isActive ? 500 : 400, isActive ? C.ink : '#999'),
                    textAlign: 'center',
                    letterSpacing: 0.3,
                    whiteSpace: 'nowrap',
                    fontSize: isMobile ? 7 : 9,
                  }}
                >
                  {step.label}
                </div>

                {/* Date - only for current */}
                {isCurrent && (
                  <div
                    style={{
                      ...F(7, 400, C.tan),
                      textAlign: 'center',
                      marginTop: 4,
                      fontSize: isMobile ? 6 : 7,
                    }}
                  >
                    {date}
                  </div>
                )}

                {/* "Current" tag */}
                {isCurrent && (
                  <div
                    style={{
                      marginTop: 4,
                      background: C.gold,
                      color: C.ink,
                      ...F(6, 700),
                      letterSpacing: 0.5,
                      textTransform: 'uppercase',
                      padding: '1px 8px',
                      borderRadius: 10,
                      whiteSpace: 'nowrap',
                      fontSize: isMobile ? 5 : 6,
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