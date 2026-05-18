import { useState } from "react";
import { C, F } from "../designTokens";

export default function FilterSidebar({ onFilter, products }) {
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
    <div style={{ padding: "20px", borderRight: `0.5px solid ${C.border}`, width: 220, flexShrink: 0 }}>
      <div style={{ ...F(11, 500, C.ink), marginBottom: 20 }}>Filters</div>

      {/* Price */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ ...F(9, 500, C.tan), letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Price</div>
        <input type="range" min="0" max="500" value={priceRange[1]} onChange={(e) => setPriceRange([0, Number(e.target.value)])} style={{ width: "100%" }} />
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
  );
}