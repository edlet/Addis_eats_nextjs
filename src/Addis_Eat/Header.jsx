import { Link } from "react-router-dom";
import CartBadge from "./CartBadge";

export default function Header() {
  return (
    <header className="topbar">
      <div className="brand-wrap">
        <Link to="/" className="brand-link" aria-label="Addis Eats home">
          <span className="brand-mark" aria-hidden="true">
            <span>AE</span>
          </span>
          <span className="brand-stack">
            <span className="brand-name">Addis Eats</span>
            <span className="brand-tag">Ethiopian food delivery</span>
          </span>
        </Link>
      </div>

      <div className="delivery-pill">
        <span className="delivery-icon" aria-hidden="true">⌖</span>
        <span>
          <small>Delivering to</small>
          Bole, Addis Ababa
        </span>
      </div>

      <div className="topbar-actions">
        <Link to="/menu" className="search-button" aria-label="Search menu">
          <span aria-hidden="true">⌕</span>
          <span>Search</span>
        </Link>
        <CartBadge />
      </div>
    </header>
  );
}