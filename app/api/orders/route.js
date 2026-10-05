import { createOrder } from "../../lib/orders";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateOrder } from "../../lib/order-schema";
import { getSession } from "../../lib/session";

function error(message, status, fieldErrors) {
  const code = status === 401 ? "UNAUTHORIZED" : status === 422 ? "VALIDATION_ERROR" : "REQUEST_ERROR";
  return Response.json({ error: { code, message, ...(fieldErrors ? { fieldErrors } : {}) } }, { status });
}

export async function POST(request) {
  const session = await getSession();
  if (!session) return error("Authentication required.", 401);
  let body;
  try { body = await request.json(); } catch { return error("Request body must be valid JSON.", 422, { body: "Invalid JSON." }); }
  const result = validateOrder(body);
  if (!result.success) return error("Please correct the highlighted fields.", 422, result.fieldErrors);
  const order = createOrder(result.data, session.userId);
  if (!order) return error("One or more dishes are unavailable.", 422, { items: "Your cart contains an unknown dish." });
  revalidateTag("customer-orders", { expire: 0 });
  revalidatePath("/orders");
  return Response.json({ order }, { status: 201 });
}
