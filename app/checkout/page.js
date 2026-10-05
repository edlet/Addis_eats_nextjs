import CheckoutForm from "./CheckoutForm";
import { cookies, headers } from "next/headers";
import { dishes } from "../menu/dishes";
import { requireSession } from "../lib/session";

export const metadata = { title: "Checkout | Addis Eats" };
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  await requireSession("/checkout");
  // Reading the request header personalizes the delivery-area default, so checkout must be dynamic.
  const requestHeaders = await headers();
  const deliveryArea = requestHeaders.get("x-addis-delivery-area") || "Bole";
  const cookieStore = await cookies();
  let cartItems = [];
  try {
    const encodedCart = cookieStore.get("addis-eats-cart")?.value;
    const requestedItems = encodedCart ? JSON.parse(decodeURIComponent(encodedCart)) : [];
    if (Array.isArray(requestedItems)) {
      cartItems = requestedItems.flatMap(({ id, quantity }) => {
        const dish = dishes.find((candidate) => candidate.id === Number(id));
        return dish && Number.isInteger(quantity) && quantity > 0 ? [{ ...dish, quantity }] : [];
      });
    }
  } catch {
    cartItems = [];
  }
  return <CheckoutForm deliveryArea={deliveryArea} initialItems={cartItems} />;
}
