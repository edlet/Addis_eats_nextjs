import Day40Shell from "../Day40Shell";
import MenuSidebar from "./MenuSidebar";

export default function MenuLayout({ children }) {
  return (
    <Day40Shell>
      <div className="menu-shell">
        <aside className="menu-sidebar"><MenuSidebar /></aside>
        <div className="menu-route-content">{children}</div>
      </div>
    </Day40Shell>
  );
}
