import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { designTokens } from '../styles/designTokens';
import MegaMenu from './MegaMenu';
import ModernSearch from './ModernSearch';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navbarStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1000,
    transition: 'all 0.3s ease',
    background: isScrolled ? designTokens.colors.sand : 'transparent',
    color: isScrolled ? designTokens.colors.ink : 'white',
    boxShadow: isScrolled ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
  };

  const containerStyle = {
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const linkStyle = {
    color: 'inherit',
    textDecoration: 'none',
    fontFamily: designTokens.fonts.body,
    fontSize: '0.9rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  };

  const logoStyle = {
    fontFamily: designTokens.fonts.heading,
    fontSize: '1.8rem',
    margin: 0,
    color: 'inherit',
    textDecoration: 'none',
  };

  return (
    <div style={navbarStyles}>
      <div style={containerStyle}>
        <Link to="/" style={logoStyle}>Abyr Line</Link>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <MegaMenu textColor={isScrolled ? designTokens.colors.ink : 'white'} />
          <ModernSearch />
          <Link to="/favourites" style={linkStyle}>❤️</Link>
          <Link to="/cart" style={linkStyle}>🛒 {cartCount > 0 && <span>({cartCount})</span>}</Link>
          {user ? (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => navigate('/account')} style={linkStyle}>{user.name}</button>
              <button onClick={logout} style={linkStyle}>Logout</button>
            </div>
          ) : (
            <Link to="/signin" style={linkStyle}>Sign In</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;