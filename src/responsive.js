import { useEffect, useState } from 'react';

/**
 * Responsive helpers for a codebase built on inline styles.
 *
 * Inline styles cannot contain media queries — there is no way to write
 * "64px on desktop, 16px on phones" inside a style object. Two ways round it:
 *
 * 1. clamp() — plain CSS, works fine inline, no JavaScript, no re-renders.
 *    Use it for anything that should scale smoothly: padding, font size,
 *    card widths. This handles most of the work.
 *
 * 2. useMediaQuery — only for structural changes clamp can't express,
 *    like swapping a row for a column or hiding a desktop menu.
 */

// Page gutter: 16px on a small phone, growing with the viewport, capped at 64px.
export const PAGE_X = 'clamp(16px, 5vw, 64px)';

// Vertical rhythm that tightens on small screens.
export const SECTION_Y = 'clamp(28px, 5vw, 56px)';

/** Standard horizontal page padding with a chosen vertical value. */
export const pagePad = (y = 20) => `${y}px ${PAGE_X}`;

/** Fluid font size: shrinks on phones, never past min or max. */
export const fluid = (min, max, vw = 4) => `clamp(${min}px, ${vw}vw, ${max}px)`;

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export const useIsMobile = () => useMediaQuery('(max-width: 640px)');
export const useIsTablet = () => useMediaQuery('(min-width: 641px) and (max-width: 1024px)');