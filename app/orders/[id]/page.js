import Link from "next/link";
import { notFound } from "next/navigation";
import { getOwnedOrder } from "../../lib/orders";
import { requireSession } from "../../lib/session";
import OrderStatus from "./OrderStatus";

export const metadata = { title: "Order status | Addis Eats" };
export const dynamic = "force-dynamic";

export default async function OrderStatusPage({ params }) {
  const { id } = await params;
  const session = await requireSession(`/orders/${id}`);
  const order = await getOwnedOrder(id, session.userId);
  if (!order) notFound();
  const initialData = { order };
  return <main className="page-section"><p className="section-kicker">Live order tracking</p><OrderStatus orderId={id} initialData={initialData} /><Link href="/orders" className="text-button">Back to order history</Link></main>;
}
