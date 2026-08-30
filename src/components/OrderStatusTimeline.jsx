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
    <div style={{ padding: '16px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
        {/* Progress line */}
        <div
          style={{
            position: 'absolute',
            top: 10,
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
              {/* Dot */}
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: isActive ? C.brandRed : C.border,
                  border: isCurrent ? `3px solid ${C.gold}` : 'none',
                  transition: 'all 0.3s ease',
                }}
              />

              {/* Label */}
              <div
                style={{
                  ...F(9, isActive ? 500 : 400, isActive ? C.ink : '#999'),
                  textAlign: 'center',
                  marginTop: 8,
                  letterSpacing: 0.3,
                }}
              >
                {step.label}
              </div>

              {/* Date — shown only for the current/active step */}
              {isCurrent && (
                <div
                  style={{
                    ...F(8, 400, C.tan),
                    marginTop: 2,
                    textAlign: 'center',
                  }}
                >
                  {date}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}