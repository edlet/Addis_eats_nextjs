"use client";

import { useLiveQuery } from "../../lib/live-query";

export default function OrderStatus({ orderId, initialData }) {
  const { data, error, isValidating } = useLiveQuery(`/api/orders/${orderId}`, {
    fallbackData: initialData,
    refreshInterval: 5_000,
    staleTime: 0,
  });
  const order = data?.order || initialData.order;
  return <article className="order-card">
    <div className="order-card-heading"><div><p>Order #{order.id.slice(0, 8)}</p><h1>Order status</h1></div><strong>{order.status}</strong></div>
    <p>{order.items.map((item) => `${item.name} x ${item.quantity}`).join(", ")}</p>
    <p>{isValidating ? "Checking for updates…" : "Status updates every five seconds."}</p>
    {error && <p className="error-message" role="alert">Status could not refresh. The last received status is shown.</p>}
  </article>;
}
