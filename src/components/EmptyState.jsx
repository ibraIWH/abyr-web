import { Link } from 'react-router-dom';
import { designTokens } from '../styles/designTokens';

const EmptyState = ({ title, message, icon, showShopButton = true }) => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '3rem 1rem',
      backgroundColor: designTokens.colors.sand,
      borderRadius: '12px',
      margin: '2rem auto',
      maxWidth: '500px',
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{icon || '🛍️'}</div>
      <h3 style={{ fontFamily: designTokens.fonts.heading, color: designTokens.colors.red }}>{title}</h3>
      <p style={{ fontFamily: designTokens.fonts.body, color: designTokens.colors.ink }}>{message}</p>
      {showShopButton && (
        <Link to="/">
          <button style={{
            backgroundColor: designTokens.colors.red,
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            fontFamily: designTokens.fonts.body,
            cursor: 'pointer',
            marginTop: '1rem',
          }}>Shop Now</button>
        </Link>
      )}
    </div>
  );
};

export default EmptyState;