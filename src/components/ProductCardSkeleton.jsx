const ProductCardSkeleton = () => {
    return (
      <div style={{
        width: '100%',
        maxWidth: '280px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}>
        <div style={{
          height: '300px',
          backgroundColor: '#e0e0e0',
          animation: 'pulse 1.5s infinite ease-in-out',
        }} />
        <div style={{ padding: '1rem' }}>
          <div style={{
            height: '20px',
            width: '80%',
            backgroundColor: '#e0e0e0',
            marginBottom: '0.5rem',
            animation: 'pulse 1.5s infinite ease-in-out',
          }} />
          <div style={{
            height: '16px',
            width: '50%',
            backgroundColor: '#e0e0e0',
            animation: 'pulse 1.5s infinite ease-in-out',
          }} />
        </div>
      </div>
    );
  };
  
  export default ProductCardSkeleton;