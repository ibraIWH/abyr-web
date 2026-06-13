import AnnouncementBar from "./AnnouncementBar";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AnnouncementBar />
      <Navbar />
      {/* flex: 1 makes the children area fill remaining space */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {children}
      </div>
      {/* Footer is now part of the Layout, always pushed to the bottom */}
      <Footer />
    </div>
  );
}