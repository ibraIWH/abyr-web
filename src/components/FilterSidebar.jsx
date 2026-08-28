import { useState } from "react";
import { C, F } from "../designTokens";
import { useIsMobile } from "../responsive";

export default function FilterSidebar({ onFilter, products }) {
  const isMobile = useIsMobile();
  // On a phone the filters start collapsed — otherwise they fill the whole
  // screen and the customer has to scroll past them to reach any product.
  const [open, setOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  const colors = ["Black", "White", "Beige", "Navy", "Burgundy"];
  const sizes = ["XS", "S", "M", "L", "XL"];

  const toggleArray = (item, arr, setArr) => {
    if (arr.includes(item)) setArr(arr.filter((i) => i !== item));
    else setArr([...arr, item]);
  };

  const applyFilters = () => {
    let filtered = [...products];
    if (selectedColors.length) {
      filtered = filtered.filter((p) => selectedColors.some((c) => p.color?.includes(c)));
    }
    // size filtering would require a sizes array in product – skip for now
    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    onFilter(filtered);
  };

  return (
    <div
      style={{
        padding: isMobile ? "12px clamp(16px, 4vw, 32px)" : "20px",
        borderRight: isMobile ? "none" : `0.5px solid ${C.border}`,
        borderBottom: isMobile ? `0.5px solid ${C.border}` : "none",
        width: isMobile ? "100%" : 220,
        flexShrink: 0,
      }}
    >
      {isMobile ? (
        <button
          onClick={() => setOpen(!open)}
          style={{
            ...F(11, 500, C.ink),
            width: "100%",
            background: "none",
            border: `0.5px solid ${C.border}`,
            padding: "12px 14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          Filters
          <span style={{ fontSize: 13 }}>{open ? "−" : "+"}</span>
        </button>
      ) : (
        <div style={{ ...F(11, 500, C.ink), marginBottom: 20 }}>Filters</div>
      )}

      <div style={{ display: isMobile && !open ? "none" : "block", marginTop: isMobile ? 18 : 0 }}>

      {/* Price */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ ...F(9, 500, C.tan), letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Price</div>
        <input type="range" min="0" max="500" value={priceRange[1]} onChange={(e) => setPriceRange([0, Number(e.target.value)])} style={{ width: "100%", accentColor: C.brandRed }} />
        <div style={{ display: "flex", justifyContent: "space-between", ...F(9, 400, "#888") }}>
          <span>SAR 0</span>
          <span>SAR {priceRange[1]}</span>
        </div>
      </div>

      {/* Colors */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ ...F(9, 500, C.tan), letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Colour</div>
        {colors.map((color) => (
          <label key={color} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, cursor: "pointer" }}>
            <input type="checkbox" checked={selectedColors.includes(color)} onChange={() => toggleArray(color, selectedColors, setSelectedColors)} />
            <span style={{ ...F(10, 400, C.ink) }}>{color}</span>
          </label>
        ))}
      </div>

      {/* Sizes */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ ...F(9, 500, C.tan), letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Size</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {sizes.map((s) => (
            <div
              key={s}
              onClick={() => toggleArray(s, selectedSizes, setSelectedSizes)}
              style={{
                padding: "4px 8px",
                border: `1px solid ${selectedSizes.includes(s) ? C.ink : C.border}`,
                background: selectedSizes.includes(s) ? C.ink : "transparent",
                color: selectedSizes.includes(s) ? C.white : C.ink,
                ...F(10, 400),
                cursor: "pointer",
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={applyFilters}
        style={{
          width: "100%",
          padding: "10px",
          background: C.brandRed,
          color: C.cream,
          border: "none",
          ...F(10, 500, C.cream),
          letterSpacing: 1,
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        Apply
      </button>
      </div>
    </div>
  );
}