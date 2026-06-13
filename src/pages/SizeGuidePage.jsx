import Layout from "../components/Layout";
import { C, F, Ser } from "../designTokens";

export default function SizeGuidePage() {
  return (
    <Layout>
    <div style={{ background: C.sand, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "28px 64px", flex: 1 }}>
        <h1 style={{ ...Ser(32, 300, C.ink), marginBottom: 24 }}>Size Guide</h1>

        <p style={{ ...F(13, 400, "#888"), marginBottom: 32 }}>
          Find your perfect fit. All measurements are in centimetres.
        </p>

        <table style={{ width: "100%", maxWidth: 600, borderCollapse: "collapse", marginBottom: 48 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.ink}` }}>
              {["Size", "Bust", "Waist", "Hips", "Length"].map((header) => (
                <th key={header} style={{ ...F(10, 500, C.ink), padding: "8px 4px", textAlign: "left", letterSpacing: 1, textTransform: "uppercase" }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["XS", "88", "70", "94", "140"],
              ["S", "92", "74", "98", "142"],
              ["M", "96", "78", "102", "144"],
              ["L", "100", "82", "106", "146"],
              ["XL", "104", "86", "110", "148"],
            ].map((row, i) => (
              <tr key={i} style={{ borderBottom: `0.5px solid ${C.border}` }}>
                {row.map((cell, j) => (
                  <td key={j} style={{ ...F(12, j === 0 ? 500 : 400, j === 0 ? C.ink : "#888"), padding: "10px 4px" }}>
                    {cell} {j > 0 ? "cm" : ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <h2 style={{ ...Ser(24, 300, C.ink), marginBottom: 16 }}>How to Measure</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: 24 }}>
          {[
            { title: "Bust", text: "Measure around the fullest part of your bust, keeping the tape horizontal." },
            { title: "Waist", text: "Measure around your natural waistline – the narrowest part of your torso." },
            { title: "Hips", text: "Stand with feet together and measure around the widest part of your hips." },
            { title: "Length", text: "Measure from the top of your shoulder to your desired hemline." },
          ].map((item) => (
            <div key={item.title} style={{ background: C.white, padding: "20px", border: `0.5px solid ${C.border}` }}>
              <div style={{ ...F(11, 500, C.ink), marginBottom: 6 }}>{item.title}</div>
              <div style={{ ...F(11, 400, "#888"), lineHeight: 1.8 }}>{item.text}</div>
            </div>
          ))}
        </div>
      </div>
     
    </div>
    </Layout>
  );
}