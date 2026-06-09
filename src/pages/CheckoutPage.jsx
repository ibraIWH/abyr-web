import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { designTokens } from '../styles/designTokens';

const CheckoutPage = () => {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [guestEmail, setGuestEmail] = useState('');
  const [shipping, setShipping] = useState({
    fullName: user?.name || '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Saudi Arabia',
  });
  const [submitting, setSubmitting] = useState(false);

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const delivery = subtotal > 100 ? 0 : 10;
  const total = subtotal + delivery;

  const handleChange = (e) => setShipping({ ...shipping, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user && !guestEmail) {
      addToast('Please enter your email address', 'error');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      clearCart();
      addToast('Order placed successfully!', 'success');
      navigate('/order-confirmed');
      setSubmitting(false);
    }, 1500);
  };

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/')} style={{ background: designTokens.colors.red, color: 'white', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ fontFamily: designTokens.fonts.heading, color: designTokens.colors.red }}>Checkout</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
        <form onSubmit={handleSubmit} style={{ flex: 2, minWidth: '280px' }}>
          {!user && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email for updates</label>
              <input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} required style={{ width: '100%', padding: '0.75rem', border: `1px solid ${designTokens.colors.tan}`, borderRadius: '4px' }} />
            </div>
          )}
          <h3>Shipping Address</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input name="fullName" placeholder="Full Name" value={shipping.fullName} onChange={handleChange} required style={inputStyle} />
            <input name="address" placeholder="Street Address" value={shipping.address} onChange={handleChange} required style={inputStyle} />
            <input name="city" placeholder="City" value={shipping.city} onChange={handleChange} required style={inputStyle} />
            <input name="postalCode" placeholder="Postal Code" value={shipping.postalCode} onChange={handleChange} style={inputStyle} />
            <select name="country" value={shipping.country} onChange={handleChange} style={inputStyle}>
              <option>Saudi Arabia</option>
              <option>UAE</option>
              <option>Kuwait</option>
              <option>Qatar</option>
              <option>Bahrain</option>
              <option>Oman</option>
            </select>
          </div>
          <button type="submit" disabled={submitting} style={{ marginTop: '1.5rem', width: '100%', padding: '1rem', background: designTokens.colors.red, color: 'white', border: 'none', borderRadius: '4px', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>{submitting ? 'Processing...' : `Place Order – ${total.toFixed(2)} SAR`}</button>
        </form>
        <div style={{ flex: 1, background: designTokens.colors.sand, padding: '1.5rem', borderRadius: '8px' }}>
          <h3>Order Summary</h3>
          {cart.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>{item.name} x{item.quantity}</span>
              <span>{(item.price * item.quantity).toFixed(2)} SAR</span>
            </div>
          ))}
          <hr />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>{subtotal.toFixed(2)} SAR</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Shipping</span><span>{delivery === 0 ? 'Free' : `${delivery.toFixed(2)} SAR`}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: '1rem' }}><span>Total</span><span>{total.toFixed(2)} SAR</span></div>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontFamily: 'DM Sans, sans-serif',
};

export default CheckoutPage;