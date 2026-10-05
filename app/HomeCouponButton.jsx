"use client";

import Link from "next/link";
import { useState } from "react";

const coupons = [
  { code: "ADDIS10", description: "Save 10% on your food subtotal." },
  { code: "WELCOME50", description: "Save 50 ETB when your food subtotal is at least 300 ETB." },
];

function CouponDialog({ onClose }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="coupon-dialog-title" onKeyDown={(event) => event.key === "Escape" && onClose()}>
        <div className="modal-header">
          <h2 id="coupon-dialog-title">Available coupons</h2>
          <button type="button" onClick={onClose} autoFocus>Close</button>
        </div>
        <div className="coupon-list">
          {coupons.map((coupon) => (
            <article key={coupon.code} className="coupon-card">
              <strong>{coupon.code}</strong>
              <p>{coupon.description}</p>
              <Link href={`/checkout?coupon=${coupon.code}`} onClick={onClose}>Continue to checkout</Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function HomeCouponButton() {
  const [showCoupons, setShowCoupons] = useState(false);

  return (
    <>
      <button type="button" className="coupon-button" onClick={() => setShowCoupons(true)}>% View Coupons</button>
      {showCoupons && <CouponDialog onClose={() => setShowCoupons(false)} />}
    </>
  );
}
