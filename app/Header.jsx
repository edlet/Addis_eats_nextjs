import Link from "next/link";
import CartBadge from "./CartBadge";
import DeliveryAreaSelect from "./DeliveryAreaSelect";
import { signOut } from "./actions/auth";
import { getSession } from "./lib/session";

export default async function Header() {
  const session = await getSession();
  return (
    <header className="topbar">
      <div className="brand-wrap">
        <Link href="/" className="brand-link" aria-label="Addis Eats home">
          <span className="brand-mark">AE</span>
          <span className="brand-stack"><span className="brand-name">Addis Eats</span><span className="brand-tag">Ethiopian food delivery</span></span>
        </Link>
      </div>
      <div className="delivery-pill"><span className="delivery-icon" aria-hidden="true">+</span><span><small>Delivering to</small><DeliveryAreaSelect compact /></span></div>
      <nav className="topbar-actions" aria-label="Primary navigation">
        <Link href="/menu" className="search-button">Browse menu</Link>
        <Link href="/favorites" className="search-button">Favorites</Link>
        <Link href="/orders" className="search-button">Orders</Link>
        {session?.role === "staff" && <Link href="/staff/orders" className="search-button">Order desk</Link>}
        {session ? (
          <>
            <span className="account-greeting">Hi, {session.name || "there"}</span>
            <form action={signOut}>
              <button className="search-button account-signout" type="submit">Sign out</button>
            </form>
          </>
        ) : (
          <Link href="/sign-in" className="search-button account-link">Sign in</Link>
        )}
        <CartBadge />
      </nav>
    </header>
  );
}
