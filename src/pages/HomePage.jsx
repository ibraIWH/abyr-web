import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import CategoryNav from '../components/CategoryNav';
import CategoryTiles from "../components/CategoryTiles";
import Layout from '../components/Layout';
import NewsletterSection from '../components/NewsletterSection';
import ProductCard from '../components/ProductCard';
import RecentlyViewed from '../components/RecentlyViewed';
import TestimonialsSection from '../components/TestimonialsSection';
import { useSettings } from '../context/SettingsContext';
import { C, F, Ser } from '../designTokens';
export default function HomePage() {
  const { hero, offers, collections } = useSettings();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const h = hero || {
    eyebrow: 'NEW COLLECTION · SUMMER 2026',
    title: 'abyr',
    subtitle: 'Handcrafted abayas designed for the modern woman. Free delivery over SAR 200.',
    imageUrl: '',
    ctaText: 'SHOP NOW',
    ctaLink: '/category/all',
  };

  return (
    <Layout>
      <div style={{ background: C.sand, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Hero */}
        <div
          style={{
            position: 'relative',
            minHeight: '420px',
            background: C.brandRed,
            display: 'flex',
            alignItems: 'flex-end',
            padding: '40px 64px 60px 32px',
            color: C.cream,
            overflow: 'hidden',
          }}
        >
          {h.imageUrl && (
            <img
              src={h.imageUrl}
              alt="Hero"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'right',
                opacity: 0.9,
              }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(92,10,20,0.7), rgba(92,10,20,0.3))',
            }}
          />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 600 }}>
            <div style={{ ...F(10, 300, C.gold), letterSpacing: 4, marginBottom: 16 }}>
              {h.eyebrow}
            </div>
            <div style={{ ...Ser(48, 300, C.cream) }}>{h.title}</div>
            <div style={{ ...F(12, 300, 'rgba(255,255,255,0.8)'), lineHeight: 1.9, margin: '12px 0 32px' }}>
              {h.subtitle}
            </div>
            <Link
              to={h.ctaLink || '/category/all'}
              style={{
                ...F(11, 500, C.ink),
                background: C.gold,
                padding: '13px 28px',
                display: 'inline-block',
                cursor: 'pointer',
                textDecoration: 'none',
              }}
            >
              {h.ctaText}
            </Link>
          </div>
        </div>

        <CategoryNav />
                <CategoryTiles />

        {/* Offers section */}
        {offers && offers.length > 0 && (
          <div style={{ padding: '20px 64px' }}>
            <h2 style={{ ...Ser(28, 300, C.ink), marginBottom: 16 }}>Offers</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 16 }}>
              {offers.map((offer) => (
                <Link
                  key={offer._id}
                  to={offer.link || '#'}
                  style={{
                    position: 'relative',
                    aspectRatio: '16/5',
                    overflow: 'hidden',
                    textDecoration: 'none',
                    color: C.white,
                    background: C.brandRed,
                    display: 'block',
                    borderRadius: 8,
                  }}
                >
                  {offer.imageUrl && (
                    <img
                      src={offer.imageUrl}
                      alt={offer.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
                    />
                  )}
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} />
                  <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
                    {offer.badgeText && (
                      <span style={{ background: C.gold, color: C.ink, padding: '2px 10px', ...F(9, 500), display: 'inline-block', marginBottom: 6, borderRadius: 4 }}>
                        {offer.badgeText}
                      </span>
                    )}
                    <div style={{ ...Ser(22, 300, C.white) }}>{offer.title}</div>
                    {offer.subtitle && <div style={{ ...F(11, 400, 'rgba(255,255,255,0.7)') }}>{offer.subtitle}</div>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Collections section – NARROW DESIGN like mobile app cards */}
        {collections && collections.length > 0 && (
          <div style={{ padding: '20px 64px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ ...Ser(28, 300, C.ink) }}>Shop by Collection</h2>
              <Link
                to="/category/all"
                style={{ ...F(10, 400, C.tan), textDecoration: 'none', letterSpacing: 1 }}
              >
                View All →
              </Link>
            </div>
            <div
              style={{
                display: 'flex',
                gap: 12,
                overflowX: 'auto',
                paddingBottom: 8,
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {collections.map((col) => (
                <Link
                  key={col._id}
                  to={`/category/${col.slug}`}
                  style={{
                    flex: '0 0 130px', // ← narrower (was 200px)
                    textDecoration: 'none',
                    color: C.ink,
                    scrollSnapAlign: 'start',
                  }}
                >
                  <div
                    style={{
                      aspectRatio: '3/4', // ← portrait, like a phone app card
                      borderRadius: 12,
                      overflow: 'hidden',
                      background: C.cream,
                      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                      transition: 'transform 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    {col.imageUrl ? (
                      <img
                        src={col.imageUrl}
                        alt={col.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          ...F(10, 400, '#999'),
                          textAlign: 'center',
                          padding: 8,
                        }}
                      >
                        {col.name}
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      ...F(10, 500, C.ink),
                      marginTop: 8,
                      textAlign: 'center',
                      letterSpacing: 0.3,
                    }}
                  >
                    {col.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Products grid */}
        <div style={{ padding: '40px 64px' }}>
          <h2 style={{ ...Ser(32, 300, C.ink), marginBottom: 28 }}>New Arrivals</h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, ...F(14, 400, '#888') }}>Loading...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: 20 }}>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>

        <RecentlyViewed />
        <TestimonialsSection />
        <NewsletterSection />
      </div>
    </Layout>
  );
}