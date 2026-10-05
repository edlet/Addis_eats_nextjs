"use server";

import { revalidatePath, updateTag } from "next/cache";
import { cookies } from "next/headers";
import { cancelOwnedOrder, createOrder } from "../lib/orders";
import { validateOrder } from "../lib/order-schema";
import { getSession } from "../lib/session";

export async function placeOrder(_previousState, formData) {
  const session = await getSession();
  if (!session) return { success: false, message: "Please sign in before placing an order." };
  const result = validateOrder(Object.fromEntries(formData));
  if (!result.success) return { success: false, fieldErrors: result.fieldErrors };
  const order = createOrder(result.data, session.userId);
  if (!order) return { success: false, fieldErrors: { items: "One or more dishes are unavailable." } };
  const cookieStore = await cookies();
  cookieStore.set("addis-eats-cart", "", { path: "/", maxAge: 0, sameSite: "lax" });
  updateTag("customer-orders");
  revalidatePath("/orders");
  return { success: true, orderId: order.id };
}

export async function cancelOrder(_previousState, formData) {
  const session = await getSession();
  if (!session) return { success: false, message: "You are not authorized to cancel this order." };
  const order = cancelOwnedOrder(formData.get("orderId"), session.userId);
  if (!order) return { success: false, message: "Order not found or you do not own it." };
  updateTag("customer-orders");
  revalidatePath("/orders");
  return { success: true, message: "Order cancelled." };
}
