import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";

export default function CartBadge() {
  const items = useCartStore(
    (state) => state.items
  );

  const itemCount = items.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  return (
    <Link
      to="/cart"
      className="cart-badge"
      aria-label={`Cart with ${itemCount} item${itemCount === 1 ? "" : "s"}`}
    >
      <span aria-hidden="true">🛒</span>
      <span>Cart</span>
      <span className="cart-count">{itemCount}</span>
    </Link>
  );
}