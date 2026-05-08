export const C = {
    brandRed: "#5C0A14",
    gold: "#C4A882",
    tan: "#8B7355",
    cream: "#F5F0E8",
    sand: "#FAFAF8",
    ink: "#1A1A1A",
    border: "#E8E8E4",
    white: "#FFFFFF",
    green: "#1B5E20",
    amber: "#E65100",
    red: "#C62828",
  };
  export const F = (s, w = 400, c = C.ink) => ({
    fontFamily: "'DM Sans', sans-serif",
    fontSize: s,
    fontWeight: w,
    color: c,
  });
  export const Ser = (s, w = 300, c = C.ink) => ({
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: s,
    fontWeight: w,
    color: c,
    fontStyle: "italic",
  });