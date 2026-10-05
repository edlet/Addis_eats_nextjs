"use client";

import { useLiveQuery } from "../../lib/live-query";

const milestones = ["Received", "Confirmed", "Preparing", "Ready for pickup", "Out for delivery", "Delivered"];
const descriptions = {
  Received: "Your order has reached the restaurant.",
  Confirmed: "The restaurant has confirmed your order.",
  Preparing: "The kitchen is preparing your food.",
  "Ready for pickup": "Your order is packed and ready for the courier.",
  "Out for delivery": "Your order is on the way.",
  Delivered: "Your order has been delivered. Enjoy your meal!",
  Cancelled: "This order was cancelled.",
};

export default function OrderStatus({ orderId, initialData }) {
  const { data, error, isValidating } = useLiveQuery(`/api/orders/${orderId}`, {
    fallbackData: initialData,
    refreshInterval: 5_000,
    staleTime: 0,
  });
  const order = data?.order || initialData.order;
  const currentIndex = milestones.indexOf(order.status);
  const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return <article className="order-card tracking-card">
    <div className="tracking-heading"><div><p className="section-kicker">Order #{order.id.slice(0, 8)}</p><h1>Track your order</h1></div><span className={`status-badge${order.status === "Cancelled" ? " cancelled" : ""}`}>{order.status}</span></div>
    <p className="tracking-message" aria-live="polite">{descriptions[order.status] || "Your order status has been updated."}</p>
    {currentIndex >= 0 ? <ol className="tracking-timeline" aria-label="Order progress">
      {milestones.map((milestone, index) => <li className={`${index < currentIndex ? "complete" : ""}${index === currentIndex ? " current" : ""}`} key={milestone} aria-current={index === currentIndex ? "step" : undefined}>
        <span className="tracking-marker">{index < currentIndex ? "OK" : String(index + 1)}</span>
        <span className="tracking-step-copy"><strong>{milestone}</strong><small>{descriptions[milestone]}</small></span>
      </li>)}
    </ol> : <p className="tracking-cancelled">This order is no longer active.</p>}
    <div className="tracking-order-summary">
      <h2>Order details</h2>
      <ul>{order.items.map((item) => <li key={item.id}><span>{item.name} x {item.quantity}</span><strong>{item.price * item.quantity} ETB</strong></li>)}</ul>
      <div className="tracking-total"><span>Total</span><strong>{total} ETB</strong></div>
      <dl><div><dt>Delivery area</dt><dd>{order.deliveryArea}</dd></div><div><dt>Payment</dt><dd>{order.paymentMethod}</dd></div></dl>
    </div>
    <p className="tracking-refresh" role="status">{isValidating ? "Checking for an update..." : "This page checks for order updates automatically."}</p>
    {error && <p className="error-message" role="alert">Status could not refresh. The last received status is shown.</p>}
  </article>;
}
