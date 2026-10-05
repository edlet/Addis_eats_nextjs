"use client";

import { useActionState } from "react";
import { cancelOrder } from "../actions/orders";

export default function CancelOrderButton({ orderId }) {
  const [state, action, pending] = useActionState(cancelOrder, { success: false });
  return <form action={action}><input type="hidden" name="orderId" value={orderId} /><button className="text-button" disabled={pending}>{pending ? "Cancelling..." : "Cancel order"}</button>{state.message && <p className={state.success ? "success-message" : "error-message"}>{state.message}</p>}</form>;
}
