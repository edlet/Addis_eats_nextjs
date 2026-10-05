"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { placeOrder } from "../actions/orders";
import { useCart } from "../providers";

const initialState = { success: false, fieldErrors: {} };

export default function CheckoutForm({ deliveryArea = "Bole", initialItems = [] }) {
  const { items, clearCart } = useCart();
  const [state, formAction, pending] = useActionState(placeOrder, initialState);
  const checkoutItems = items.length ? items : initialItems;
  const total = checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const fieldErrors = state.fieldErrors || {};

  useEffect(() => { if (state.success) clearCart(); }, [state.success, clearCart]);

  if (state.success) return <main className="state-screen"><p className="section-kicker">Order confirmed</p><h1>Thank you!</h1><p>Your order #{state.orderId.slice(0, 8)} has been received and the kitchen is getting started.</p><Link href="/orders" className="primary-button">View my orders</Link></main>;
  if (!checkoutItems.length) return <main className="state-screen"><h1>Checkout</h1><p>Add a dish before checking out.</p><Link href="/menu" className="primary-button">Browse the menu</Link></main>;

  return (
    <main className="checkout-page">
      <p className="section-kicker">Final step</p><h1>Checkout</h1>
      <section className="order-summary"><h2>Order summary</h2>{checkoutItems.map((item) => <p key={item.id}>{item.name} x {item.quantity} - {item.price * item.quantity} ETB</p>)}<strong>Total: {total} ETB</strong></section>
      <form action={formAction}>
        <input type="hidden" name="items" value={JSON.stringify(checkoutItems.map(({ id, quantity }) => ({ id, quantity })))} />
        <label>Full name<input name="customerName" required aria-invalid={Boolean(fieldErrors.customerName)} placeholder="Your full name" /></label>{fieldErrors.customerName && <p className="error-message">{fieldErrors.customerName}</p>}
        <label>Phone number<input name="phone" required type="tel" aria-invalid={Boolean(fieldErrors.phone)} placeholder="0911223344" /></label>{fieldErrors.phone && <p className="error-message">{fieldErrors.phone}</p>}
        <label>Delivery area<select name="deliveryArea" defaultValue={deliveryArea} aria-invalid={Boolean(fieldErrors.deliveryArea)}><option>Bole</option><option>Kazanchis</option><option>Piazza</option><option>CMC</option></select></label>{fieldErrors.deliveryArea && <p className="error-message">{fieldErrors.deliveryArea}</p>}
        <label>Payment method<select name="paymentMethod" required defaultValue=""><option value="" disabled>Select payment method</option><option>TeleBirr</option><option>CBE</option><option>Cash on Delivery</option></select></label>{fieldErrors.paymentMethod && <p className="error-message">{fieldErrors.paymentMethod}</p>}
        {fieldErrors.items && <p className="error-message">{fieldErrors.items}</p>}{state.message && <p className="error-message">{state.message}</p>}
        <button className="primary-button" type="submit" disabled={pending}>{pending ? "Placing order..." : `Place order - ${total} ETB`}</button>
      </form>
    </main>
  );
}
