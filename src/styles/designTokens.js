export const designTokens = {
  colors: {
    red: '#5C0A14',
    gold: '#C4A882',
    tan: '#8B7355',
    cream: '#F5F0E8',
    sand: '#FAFAF8',
    ink: '#1A1A1A',
  },
  fonts: {
    heading: "'Cormorant Garamond', serif",
    body: "'DM Sans', sans-serif",
  },
};

export const Cap = (str) => {
  if (!str) return '';
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};