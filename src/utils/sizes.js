// Sizes a product can be bought in.
// Each product stores its own list in the admin (abayas use 54–60, jalabiyas S–XL),
// so the store reads product.sizes instead of assuming XS–XL everywhere.
export const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL"];

export const sizesOf = (product) => {
  const saved = Array.isArray(product?.sizes)
    ? product.sizes.map((s) => String(s).trim()).filter(Boolean)
    : [];
  return saved.length > 0 ? saved : DEFAULT_SIZES;
};

// The size that starts selected: the middle of the list
// (M for XS–XL, 56 for 54–60).
export const defaultSizeOf = (product) => {
  const sizes = sizesOf(product);
  return sizes[Math.floor((sizes.length - 1) / 2)];
};
