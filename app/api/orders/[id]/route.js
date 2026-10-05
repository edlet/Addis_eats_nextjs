import { getOwnedOrder } from "../../../lib/orders";
import { getSession } from "../../../lib/session";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const session = await getSession();
  if (!session) return Response.json({ error: { message: "Authentication required." } }, { status: 401 });
  const { id } = await params;
  const order = getOwnedOrder(id, session.userId);
  if (!order) return Response.json({ error: { message: "Order not found." } }, { status: 404 });
  return Response.json({ order }, { headers: { "Cache-Control": "no-store" } });
}
