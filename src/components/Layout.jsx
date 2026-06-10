import AnnouncementBar from "./AnnouncementBar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      {children}
    </>
  );
}