import { useOrdersStore } from "../store/ordersStore";
import { formatCurrency } from "../utils/formatCurrency";

const statuses = ["Pending", "Preparing", "Delivering", "Delivered"];

export default function OrderManager() {
  const orders = useOrdersStore((state) => state.orders);
  const updateOrderStatus = useOrdersStore((state) => state.updateOrderStatus);
  const removeOrder = useOrdersStore((state) => state.removeOrder);

  return (
    <section className="admin-page">
      <div className="admin-page-heading"><div><p className="section-kicker">Fulfillment</p><h2>Order management</h2><p>Review customer details and move orders through delivery.</p></div><span className="admin-live-badge">{orders.length} total</span></div>
      {orders.length === 0 ? <div className="admin-panel admin-empty"><h3>No orders yet</h3><p>Customer orders will appear here after checkout.</p></div> : <div className="admin-order-list">{orders.map((order) => <article className="admin-order-card" key={order.id}><div className="admin-order-heading"><div><p className="section-kicker">{order.id}</p><h3>{order.name || "Customer"}</h3><p>{order.phone} · {order.area}</p></div><strong>{formatCurrency(order.total)}</strong></div><div className="admin-order-items">{order.items.map((item, index) => <span key={`${item.id}-${index}`}>{item.name} × {item.quantity || 1}</span>)}</div>{order.specialInstructions && <p className="admin-note"><strong>Note:</strong> {order.specialInstructions}</p>}<div className="admin-order-actions"><label>Status<select value={order.status} onChange={(event) => updateOrderStatus(order.id, event.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label><button type="button" className="table-action danger" onClick={() => window.confirm(`Delete order ${order.id}?`) && removeOrder(order.id)}>Delete order</button></div></article>)}</div>}
    </section>
  );
}
