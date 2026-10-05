"use client";

import Link from "next/link";
import { useCart } from "./providers";

export default function CartBadge() {
  const { items } = useCart();
  const count = items.reduce((total, item) => total + item.quantity, 0);
  return <Link href="/cart" className="cart-badge">Cart <span className="cart-count">{count}</span></Link>;
}
