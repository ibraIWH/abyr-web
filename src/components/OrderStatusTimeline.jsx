import { C, F } from '../designTokens';

const STATUS_STEPS = [
  { key: 'placed', label: 'Order Placed', icon: '📦' },
  { key: 'confirmed', label: 'Confirmed', icon: '✅' },
  { key: 'shipped', label: 'Shipped', icon: '🚚' },
  { key: 'delivered', label: 'Delivered', icon: '🏠' },
];

export default function OrderStatusTimeline({ status, createdAt }) {
  const currentIndex = STATUS_STEPS.findIndex((s) => s.key === status);
  const date = new Date(createdAt).toLocaleDateString();

  return (
    <div style={{ padding: '20px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
        {/* Progress line */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            right: 20,
            height: 3,
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
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: isActive ? C.brandRed : C.border,
                  color: isActive ? C.cream : '#999',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  border: isCurrent ? `3px solid ${C.gold}` : 'none',
                  transition: 'all 0.3s ease',
                }}
              >
                {step.icon}
              </div>
              <div
                style={{
                  ...F(9, isActive ? 500 : 400, isActive ? C.ink : '#999'),
                  textAlign: 'center',
                  marginTop: 8,
                  letterSpacing: 0.5,
                }}
              >
                {step.label}
              </div>
              {isCurrent && (
                <div
                  style={{
                    ...F(8, 400, C.tan),
                    marginTop: 4,
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