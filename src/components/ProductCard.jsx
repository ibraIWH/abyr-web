import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { designTokens } from '../styles/designTokens';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [currentImage, setCurrentImage] = useState(product.imageUrl);
  const [isAnimating, setIsAnimating] = useState(false);

  const hoverImage = product.imageUrl2 || product.imageUrl;

  const handleAddToCart = () => {
    setIsAnimating(true);
    addToCart(product, 1);
    addToast('Added to cart!', 'success');
    setTimeout(() => setIsAnimating(false), 200);
  };

  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: '#fff',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      <Link to={`/product/${product._id}`}>
        <div
          onMouseEnter={() => setCurrentImage(hoverImage)}
          onMouseLeave={() => setCurrentImage(product.imageUrl)}
          style={{ height: '300px', overflow: 'hidden' }}
        >
          <img
            src={currentImage}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
            }}
          />
        </div>
      </Link>

      {product.salePrice && (
        <span
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: designTokens.colors.red,
            color: designTokens.colors.gold,
            padding: '4px 8px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            borderRadius: '4px',
          }}
        >
          SALE
        </span>
      )}

      <div style={{ padding: '1rem' }}>
        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
          <h3
            style={{
              fontFamily: designTokens.fonts.body,
              fontSize: '1rem',
              margin: '0 0 0.5rem',
              color: designTokens.colors.ink,
            }}
          >
            {product.name}
          </h3>
        </Link>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
          {product.salePrice ? (
            <>
              <span style={{ color: designTokens.colors.red, fontWeight: 'bold' }}>
                {product.salePrice} SAR
              </span>
              <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.8rem' }}>
                {product.price} SAR
              </span>
            </>
          ) : (
            <span style={{ fontWeight: 'bold' }}>{product.price} SAR</span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          style={{
            width: '100%',
            padding: '0.5rem',
            backgroundColor: designTokens.colors.red,
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
            transition: 'transform 0.1s',
            fontFamily: designTokens.fonts.body,
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;