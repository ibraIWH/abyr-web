import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import CategoryNav from '../components/CategoryNav';
import Layout from '../components/Layout';
import NewsletterSection from '../components/NewsletterSection';
import ProductCard from '../components/ProductCard';
import RecentlyViewed from '../components/RecentlyViewed';
import TestimonialsSection from '../components/TestimonialsSection';
import { useSettings } from '../context/SettingsContext';
import { C, F, Ser } from '../designTokens';
import { fluid, PAGE_X, pagePad, useIsMobile } from '../responsive';
// Centred "Show All" link used under each row.
function ShowAll({ to }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'clamp(24px, 4vw, 40px)' }}>
      <Link
        to={to}
        style={{
          ...F(11, 500, C.cream),
          background: C.ink,
          letterSpacing: 2,
          textTransform: 'uppercase',
          padding: '16px 48px',
          textDecoration: 'none',
          display: 'inline-block',
          transition: 'opacity 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.85)}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
      >
        Show All
      </Link>
    </div>
  );
}

export default function HomePage() {
  const isMobile = useIsMobile();
  const { hero, offers, categories } = useSettings();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Products flagged "Best Seller" in the admin.
  const bestSellers = products.filter((p) => p.tag === 'bestSeller');

  // Products the admin has put a sale price on. Newest first, since the
  // products endpoint already sorts by createdAt descending.
  const discounted = products.filter(
    (p) => p.salePrice != null && p.salePrice > 0 && p.salePrice < p.price
  );


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
            minHeight: 'clamp(320px, 52vw, 420px)',
            background: C.brandRed,
            display: 'flex',
            alignItems: 'flex-end',
            padding: `clamp(28px, 5vw, 40px) ${PAGE_X} clamp(36px, 6vw, 60px)`,
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
                objectFit: isMobile ? 'cover' : 'contain',
                objectPosition: isMobile ? 'center 20%' : 'right',
                opacity: isMobile ? 1 : 0.9,
              }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: isMobile
                ? 'linear-gradient(to top, rgba(92,10,20,0.94) 0%, rgba(92,10,20,0.86) 28%, rgba(92,10,20,0.55) 62%, rgba(92,10,20,0.35) 100%)'
                : 'linear-gradient(135deg, rgba(92,10,20,0.7), rgba(92,10,20,0.3))',
            }}
          />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: isMobile ? '100%' : 600 }}>
            <div style={{ ...F(10, 300, C.gold), letterSpacing: isMobile ? 2 : 4, marginBottom: 16 }}>
              {h.eyebrow}
            </div>
            <div style={{ ...Ser(48, 300, C.cream), fontSize: fluid(34, 48, 7) }}>{h.title}</div>
            <div style={{ ...F(12, 300, 'rgba(255,255,255,0.85)'), lineHeight: isMobile ? 1.6 : 1.9, margin: isMobile ? '10px 0 24px' : '12px 0 32px' }}>
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

        {/* Offers — split card: photo on the left fading into a black panel
            on the right, in a horizontal scroll row.
            Sizes: 460px card width, 230px photo width, 260px card height. */}
        {offers && offers.length > 0 && (
          <div style={{ padding: pagePad(20) }}>
            <h2 style={{ ...Ser(28, 300, C.ink), fontSize: fluid(22, 28, 5), marginBottom: 16 }}>Offers</h2>
            <div
              style={{
                display: 'flex',
                gap: 18,
                overflowX: 'auto',
                paddingBottom: 8,
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {offers.map((offer) => (
                <Link
                  key={offer._id}
                  to={offer.link || '#'}
                  style={{
                    flex: isMobile ? '0 0 86vw' : '0 0 460px',
                    scrollSnapAlign: 'start',
                    display: 'flex',
                    minHeight: isMobile ? 220 : 260,
                    overflow: 'hidden',
                    background: C.ink,
                    boxShadow: '0 2px 14px rgba(0,0,0,0.08)',
                    textDecoration: 'none',
                    transition: 'transform 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    const img = e.currentTarget.querySelector('img');
                    if (img) img.style.transform = 'scale(1.04)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    const img = e.currentTarget.querySelector('img');
                    if (img) img.style.transform = 'scale(1)';
                  }}
                >
                  {/* Photo side */}
                  <div
                    style={{
                      flex: isMobile ? '0 0 44%' : '0 0 230px',
                      position: 'relative',
                      background: C.cream,
                      overflow: 'hidden',
                    }}
                  >
                    {offer.imageUrl ? (
                      <img
                        src={offer.imageUrl}
                        alt={offer.title}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'top center',
                          display: 'block',
                          transition: 'transform 0.6s ease',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          ...F(10, 400, '#999'),
                          textAlign: 'center',
                          padding: 8,
                        }}
                      >
                        {offer.title}
                      </div>
                    )}

                    {/* Many-stop fade so the photo dissolves into the panel
                        without visible banding. */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(to right,' +
                          ' rgba(26,26,26,0) 0%,' +
                          ' rgba(26,26,26,0.015) 18%,' +
                          ' rgba(26,26,26,0.05) 30%,' +
                          ' rgba(26,26,26,0.10) 40%,' +
                          ' rgba(26,26,26,0.18) 49%,' +
                          ' rgba(26,26,26,0.28) 57%,' +
                          ' rgba(26,26,26,0.40) 64%,' +
                          ' rgba(26,26,26,0.53) 71%,' +
                          ' rgba(26,26,26,0.66) 78%,' +
                          ' rgba(26,26,26,0.78) 84%,' +
                          ' rgba(26,26,26,0.88) 89%,' +
                          ' rgba(26,26,26,0.95) 94%,' +
                          ' rgba(26,26,26,1) 100%)',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>

                  {/* Text panel — badge top, title middle, CTA pinned to the foot */}
                  <div
                    style={{
                      flex: 1,
                      padding: isMobile ? '20px 18px' : '24px 26px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    {offer.badgeText ? (
                      <span
                        style={{
                          background: C.gold,
                          color: C.ink,
                          ...F(9, 500),
                          letterSpacing: 1.2,
                          padding: '5px 11px',
                          alignSelf: 'flex-start',
                        }}
                      >
                        {offer.badgeText}
                      </span>
                    ) : (
                      <span />
                    )}

                    <div>
                      <div style={{ ...Ser(30, 300, C.cream), fontSize: fluid(22, 30, 4), lineHeight: 1.1 }}>
                        {offer.title}
                      </div>
                      {offer.subtitle && (
                        <div style={{ ...F(11, 400, 'rgba(255,255,255,0.72)'), lineHeight: 1.6, marginTop: 8 }}>
                          {offer.subtitle}
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        ...F(9, 500, C.gold),
                        letterSpacing: 1.6,
                        textTransform: 'uppercase',
                        borderTop: '1px solid rgba(196,168,130,0.28)',
                        paddingTop: 12,
                      }}
                    >
                      Shop now →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Categories section – NARROW DESIGN like mobile app cards */}
        {categories && categories.length > 0 && (
          <div style={{ padding: pagePad(20) }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ ...Ser(28, 300, C.ink), fontSize: fluid(22, 28, 5) }}>Shop by Category</h2>
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
              {categories.map((col) => (
                <Link
                  key={col._id}
                  to={`/category/${col.slug}`}
                  style={{
                    flex: isMobile ? '0 0 52vw' : '0 0 200px',
                    textDecoration: 'none',
                    color: C.ink,
                    scrollSnapAlign: 'start',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      aspectRatio: '3/4',
                      overflow: 'hidden',
                      background: C.cream,
                      boxShadow: '0 2px 14px rgba(0,0,0,0.08)',
                    }}
                    onMouseEnter={(e) => {
                      const img = e.currentTarget.querySelector('img');
                      if (img) img.style.transform = 'scale(1.06)';
                    }}
                    onMouseLeave={(e) => {
                      const img = e.currentTarget.querySelector('img');
                      if (img) img.style.transform = 'scale(1)';
                    }}
                  >
                    {col.imageUrl ? (
                      <img
                        src={col.imageUrl}
                        alt={col.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'top center',
                          display: 'block',
                          transition: 'transform 0.7s ease',
                        }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: C.cream }} />
                    )}

                    {/* Scrim: transparent over the garment, deepening at the foot
                        of the card so the name stays legible on any photo. */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(to top,' +
                          ' rgba(16,10,11,0.88) 0%,' +
                          ' rgba(16,10,11,0.72) 10%,' +
                          ' rgba(16,10,11,0.50) 20%,' +
                          ' rgba(16,10,11,0.30) 30%,' +
                          ' rgba(16,10,11,0.15) 40%,' +
                          ' rgba(16,10,11,0.05) 50%,' +
                          ' rgba(16,10,11,0) 62%)',
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Name, set into the photo */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 18,
                        textAlign: 'center',
                        padding: '0 12px',
                        pointerEvents: 'none',
                      }}
                    >
                      <div style={{ ...Ser(19, 400, C.cream), lineHeight: 1.2 }}>{col.name}</div>
                      <div
                        style={{
                          width: 26,
                          height: 1,
                          background: C.gold,
                          margin: '8px auto 0',
                          opacity: 0.85,
                        }}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Products grid */}
        <div style={{ padding: pagePad(40) }}>
          <h2 style={{ ...Ser(32, 300, C.ink), fontSize: fluid(24, 32, 5), marginBottom: 28 }}>New Arrivals</h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, ...F(14, 400, '#888') }}>Loading...</div>
          ) : (
            <>
              {/* One scrolling row, same as the offers and category strips.
                  The full catalogue lives behind Show All. */}
              <div
                style={{
                  display: 'flex',
                  gap: 'clamp(10px, 2.5vw, 20px)',
                  overflowX: 'auto',
                  paddingBottom: 8,
                  scrollSnapType: 'x mandatory',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {products.map((product) => (
                  <div
                    key={product._id}
                    style={{
                      flex: isMobile ? '0 0 62vw' : '0 0 240px',
                      scrollSnapAlign: 'start',
                    }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              <ShowAll to="/category/all" />
            </>
          )}
        </div>

        {/* Best Sellers — products tagged in the admin */}
        {!loading && bestSellers.length > 0 && (
          <div style={{ padding: pagePad(20) }}>
            <h2 style={{ ...Ser(28, 300, C.ink), fontSize: fluid(22, 28, 5), marginBottom: 20 }}>Best Sellers</h2>
            <div
              style={{
                display: 'flex',
                gap: 'clamp(10px, 2.5vw, 20px)',
                overflowX: 'auto',
                paddingBottom: 8,
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {bestSellers.map((product) => (
                <div
                  key={product._id}
                  style={{
                    flex: isMobile ? '0 0 62vw' : '0 0 240px',
                    scrollSnapAlign: 'start',
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            <ShowAll to="/category/all?tag=bestSeller" />
          </div>
        )}

        {/* On Sale — only products carrying a discount */}
        {!loading && discounted.length > 0 && (
          <div style={{ padding: pagePad(20) }}>
            <h2 style={{ ...Ser(28, 300, C.ink), fontSize: fluid(22, 28, 5), marginBottom: 20 }}>On Sale</h2>
            <div
              style={{
                display: 'flex',
                gap: 'clamp(10px, 2.5vw, 20px)',
                overflowX: 'auto',
                paddingBottom: 8,
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {discounted.map((product) => (
                <div
                  key={product._id}
                  style={{
                    flex: isMobile ? '0 0 62vw' : '0 0 240px',
                    scrollSnapAlign: 'start',
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            <ShowAll to="/category/all?sale=true" />
          </div>
        )}

        <RecentlyViewed />
        <TestimonialsSection />
        <NewsletterSection />
      </div>
    </Layout>
  );
}