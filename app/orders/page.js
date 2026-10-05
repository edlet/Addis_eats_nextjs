import Link from "next/link";
import { unstable_cache } from "next/cache";
import CancelOrderButton from "./CancelOrderButton";
import { getOrdersFor } from "../lib/orders";
import { requireSession } from "../lib/session";

export const revalidate = 60;
export const metadata = { title: "My orders | Addis Eats" };

const getCachedOrders = unstable_cache(async (userId) => getOrdersFor(userId), ["customer-orders"], { revalidate: 60, tags: ["customer-orders"] });

export default async function OrdersPage() {
  const session = await requireSession("/orders");
  const orders = await getCachedOrders(session.userId);
  if (!orders.length) return <main className="state-screen"><p className="section-kicker">Order history</p><h1>No orders yet.</h1><p>Your completed order will appear here right away.</p><Link href="/menu" className="primary-button">Browse the menu</Link></main>;
  return <main className="page-section"><p className="section-kicker">Order history</p><h1>My orders</h1><div className="orders-list">{orders.map((order) => <article className="order-card" key={order.id}><div className="order-card-heading"><div><p>{new Date(order.createdAt).toLocaleString()}</p><h2><Link href={`/orders/${order.id}`}>Order #{order.id.slice(0, 8)}</Link></h2></div><strong>{order.status}</strong></div><p className="order-items">{order.items.map((item) => `${item.name} x ${item.quantity}`).join(", ")}</p>{order.status === "Received" && <CancelOrderButton orderId={order.id} />}</article>)}</div></main>;
}
