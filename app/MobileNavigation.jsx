import Link from "next/link";

// This stays server-rendered: it is a set of ordinary links, not browser state.
export default function MobileNavigation() {
  return (
    <nav className="mobile-navigation" aria-label="Quick navigation">
      <Link href="/" aria-label="Home"><span aria-hidden="true">⌂</span><small>Home</small></Link>
      <Link href="/menu" aria-label="Menu"><span aria-hidden="true">☷</span><small>Menu</small></Link>
      <Link href="/favorites" aria-label="Favorites"><span aria-hidden="true">♡</span><small>Saved</small></Link>
      <Link href="/orders" aria-label="Order history"><span aria-hidden="true">◷</span><small>Orders</small></Link>
      <Link href="/cart" aria-label="Cart"><span aria-hidden="true">▱</span><small>Cart</small></Link>
    </nav>
  );
}
