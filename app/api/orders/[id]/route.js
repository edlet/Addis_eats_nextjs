import { getOwnedOrder } from "../../../lib/orders";
import { getSession } from "../../../lib/session";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const session = await getSession();
  if (!session) return Response.json({ error: { message: "Authentication required." } }, { status: 401 });
  const { id } = await params;
  let order;
  try {
    order = await getOwnedOrder(id, session.userId);
  } catch (cause) {
    console.error("Failed to read order:", cause);
    return Response.json({ error: { message: "Order service is temporarily unavailable." } }, { status: 503 });
  }
  if (!order) return Response.json({ error: { message: "Order not found." } }, { status: 404 });
  return Response.json({ order }, { headers: { "Cache-Control": "no-store" } });
}
