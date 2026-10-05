const areas = ["Bole", "Kazanchis", "Piazza", "CMC"];
const payments = ["TeleBirr", "CBE", "Cash on Delivery"];

function text(value) { return typeof value === "string" ? value.trim() : ""; }

// Shared by the route handler and server action so both return the same named errors.
export function validateOrder(input) {
  const fieldErrors = {};
  const customerName = text(input.customerName);
  const phone = text(input.phone);
  const deliveryArea = text(input.deliveryArea);
  const paymentMethod = text(input.paymentMethod);
  let items = input.items;

  if (typeof items === "string") {
    try { items = JSON.parse(items); } catch { items = null; }
  }

  if (customerName.length < 2) fieldErrors.customerName = "Enter your full name.";
  if (!/^09\d{8}$/.test(phone)) fieldErrors.phone = "Use an Ethiopian mobile number, for example 0911223344.";
  if (!areas.includes(deliveryArea)) fieldErrors.deliveryArea = "Choose a delivery area.";
  if (!payments.includes(paymentMethod)) fieldErrors.paymentMethod = "Choose a payment method.";
  if (!Array.isArray(items) || !items.length) fieldErrors.items = "Add at least one dish before ordering.";
  else if (items.some((item) => !Number.isInteger(item.id) || !Number.isInteger(item.quantity) || item.quantity < 1)) fieldErrors.items = "Your cart contains an invalid dish.";

  if (Object.keys(fieldErrors).length) return { success: false, fieldErrors };
  return { success: true, data: { customerName, phone, deliveryArea, paymentMethod, items } };
}

export const orderFields = { areas, payments };
