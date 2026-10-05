import Link from "next/link";
import Day40Shell from "../../Day40Shell";
import { requireStaff } from "../../lib/session";
import { getAllOrders, ORDER_STATUS_TRANSITIONS } from "../../lib/orders";
import StaffOrderCard from "./StaffOrderCard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Order desk | Addis Eats" };

export default async function StaffOrdersPage() {
  await requireStaff("/staff/orders");
  const orders = await getAllOrders();

  return <Day40Shell><main className="page-section staff-orders-page">
    <div className="staff-orders-heading">
      <div>
        <p className="section-kicker">Addis Eats operations</p>
        <h1>Order desk</h1>
        <p>Review incoming orders and keep customers updated as each one moves through the kitchen.</p>
      </div>
      <Link href="/menu" className="text-button">View customer menu</Link>
    </div>
    {!orders.length ? (
      <section className="state-screen staff-empty-state"><h2>No orders yet</h2><p>New customer orders will appear here.</p></section>
    ) : (
      <div className="staff-orders-list">
        {orders.map((order) => <StaffOrderCard key={order.id} order={order} nextStatuses={ORDER_STATUS_TRANSITIONS[order.status] || []} />)}
      </div>
    )}
  </main></Day40Shell>;
}