import Link from "next/link";
import SidebarVisitCounter from "./SidebarVisitCounter";

export default function MenuSidebar() {
  return <div><p className="section-kicker">Browse Addis Eats</p><h2>Menu guide</h2><nav className="sidebar-links" aria-label="Menu navigation"><Link href="/menu">All dishes</Link><Link href="/menu/kitfo">Featured: Kitfo</Link><Link href="/cart">View cart</Link></nav><SidebarVisitCounter /></div>;
}
