import { C, F } from '../designTokens';

const STATUS_STEPS = [
  { key: 'placed', label: 'Order Placed' },
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

  return (
    <div style={{ padding: '20px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
        {/* Progress line */}
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: 0,
            right: 0,
            height: 2,
            background: C.border,
            zIndex: 0,
          }}
        >
          <div
            style={{
              width: `${(currentIndex / (STATUS_STEPS.length - 1)) * 100}%`,
              height: '100%',
              background: C.brandRed,
              transition: 'width 0.5s ease',
            }}
          />
        </div>

        {STATUS_STEPS.map((step, index) => {
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;

          // Determine dot size: larger for current step
          const dotSize = isCurrent ? 28 : 16;

          return (
            <div
              key={step.key}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 1,
                flex: 1,
              }}
            >
              {/* Dot — larger and with a ring for current step */}
              <div
                style={{
                  width: dotSize,
                  height: dotSize,
                  borderRadius: '50%',
                  background: isActive ? C.brandRed : C.border,
                  border: isCurrent ? `3px solid ${C.gold}` : 'none',
                  boxShadow: isCurrent ? '0 0 0 6px rgba(196,168,130,0.3)' : 'none',
                  transition: 'all 0.3s ease',
                }}
              />

              {/* Label */}
              <div
                style={{
                  ...F(10, isActive ? 500 : 400, isActive ? C.ink : '#999'),
                  textAlign: 'center',
                  marginTop: 10,
                  letterSpacing: 0.5,
                  fontWeight: isCurrent ? 700 : 'normal',
                }}
              >
                {step.label}
              </div>

              {/* Date — shown only for the current step */}
              {isCurrent && (
                <div
                  style={{
                    ...F(9, 400, C.tan),
                    marginTop: 4,
                    textAlign: 'center',
                  }}
                >
                  {date}
                </div>
              )}

              {/* "Current" tag — optional, for extra clarity */}
              {isCurrent && (
                <div
                  style={{
                    marginTop: 6,
                    background: C.gold,
                    color: C.ink,
                    ...F(7, 700),
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    padding: '2px 10px',
                    borderRadius: 10,
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