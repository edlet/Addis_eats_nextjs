"use client";

import { useActionState } from "react";
import { updateStaffOrderStatus } from "../../actions/orders";

export default function StaffOrderCard({ order, nextStatuses }) {
  const [state, formAction, pending] = useActionState(updateStaffOrderStatus, { success: false, message: "" });
  const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return <article className="staff-order-card">
    <div className="staff-order-heading">
      <div><p className="section-kicker">Order #{order.id.slice(0, 8)}</p><h2>{order.customerName}</h2></div>
      <span className="status-badge">{order.status}</span>
    </div>
    <div className="staff-order-facts">
      <a href={`tel:${order.phone}`}>{order.phone}</a>
      <span>{order.deliveryArea}</span>
      <span>{order.paymentMethod}</span>
      <strong>{total} ETB</strong>
    </div>
    <ul className="staff-order-items">
      {order.items.map((item) => <li key={item.id}>{item.name} <span>x {item.quantity}</span></li>)}
    </ul>
    {nextStatuses.length > 0 ? <form className="staff-order-update" action={formAction}>
      <input type="hidden" name="orderId" value={order.id} />
      <label><span>Move order to</span><select name="status" defaultValue={nextStatuses[0]}>{nextStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
      <button className="primary-button" type="submit" disabled={pending}>{pending ? "Updating..." : "Update status"}</button>
    </form> : <p className="staff-order-complete">This order is {order.status.toLowerCase()}.</p>}
    {state.message && <p className={state.success ? "success-message" : "error-message"} role="status">{state.message}</p>}
  </article>;
}