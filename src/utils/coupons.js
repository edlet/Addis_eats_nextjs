export const coupons = [
  {
    code: "ADDIS10",
    description: "Save 10% on your food subtotal.",
    type: "percentage",
    value: 10,
  },
  {
    code: "WELCOME50",
    description: "Save 50 ETB when your food subtotal is at least 300 ETB.",
    type: "fixed",
    value: 50,
    minimumSubtotal: 300,
  },
];

export function applyCoupon(code, subtotal) {
  const normalizedCode = code.trim().toUpperCase();
  const coupon = coupons.find((item) => item.code === normalizedCode);

  if (!coupon) {
    return { valid: false, message: "That coupon code is not valid." };
  }

  if (coupon.minimumSubtotal && subtotal < coupon.minimumSubtotal) {
    return {
      valid: false,
      message: `${coupon.code} requires a food subtotal of at least ${coupon.minimumSubtotal} ETB.`,
    };
  }

  const discount = coupon.type === "percentage"
    ? Math.round((subtotal * coupon.value) / 100)
    : coupon.value;

  return { valid: true, coupon, discount: Math.min(discount, subtotal) };
}
