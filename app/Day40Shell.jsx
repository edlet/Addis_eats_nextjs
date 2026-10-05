import Header from "./Header";
import Footer from "./Footer";
import MobileNavigation from "./MobileNavigation";

export default function Day40Shell({ children }) {
  return (
    <div className="app-layout">
      <Header />
      {children}
      <Footer />
      <MobileNavigation />
    </div>
  );
}
