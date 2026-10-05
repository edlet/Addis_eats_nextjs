import { useRef, useState } from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

import { useCartStore } from "../store/cartStore";
import { useOrdersStore } from "../store/ordersStore";
import { getDeliveryEstimate } from "../utils/deliveryEstimate";
import { formatCurrency } from "../utils/formatCurrency";
import { applyCoupon } from "../utils/coupons";
import Field from "./Field";
import { validate } from "./validate";

const initialForm = {
  name: "",
  phone: "",
  area: "Bole",
  payment: "",
  specialInstructions: "",
};

export default function Checkout() {
  const items = useCartStore(
    (state) => state.items
  );

  const [searchParams] = useSearchParams();

  const clearCart = useCartStore(
    (state) => state.clearCart
  );
  const addOrder = useOrdersStore(
    (state) => state.addOrder
  );
  const orderCount = useOrdersStore(
    (state) => state.orders.length
  );

  const [form, setForm] = useState(initialForm);
  const [couponCode, setCouponCode] = useState(
    () => searchParams.get("coupon")?.toUpperCase() || ""
  );
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    const code = searchParams.get("coupon")?.toUpperCase();

    return code ? { code } : null;
  });
  const [couponMessage, setCouponMessage] = useState("");
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);

  const firstInvalidRef = useRef(null);
  const submitErrorRef = useRef(null);

  const errors = validate(form);

  const subtotal = items.reduce(
    (sum, dish) => sum + dish.price * (dish.quantity || 1),
    0
  );

  const delivery = getDeliveryEstimate(form.area);
  const couponResult = appliedCoupon
    ? applyCoupon(appliedCoupon.code, subtotal)
    : null;
  const discount = couponResult?.valid ? couponResult.discount : 0;
  const total = subtotal + delivery.fee - discount;

  const hasErrors =
    Object.keys(errors).length > 0;

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setSubmitError("");
    setSuccess(false);
  }

  function handleBlur(event) {
    const { name } = event.target;

    setTouched((currentTouched) => ({
      ...currentTouched,
      [name]: true,
    }));
  }

  function handleApplyCoupon() {
    const result = applyCoupon(couponCode, subtotal);

    if (!result.valid) {
      setAppliedCoupon(null);
      setCouponMessage(result.message);
      return;
    }

    setAppliedCoupon(result.coupon);
    setCouponCode(result.coupon.code);
    setCouponMessage(`${result.coupon.code} applied: you save ${formatCurrency(result.discount)}.`);
  }

  function showError(field) {
    return touched[field] && errors[field];
  }

  function focusFirstInvalidField() {
    const firstInvalidField = Object.keys(errors)[0];

    if (firstInvalidField) {
      firstInvalidRef.current =
        document.getElementById(firstInvalidField);

      firstInvalidRef.current?.focus();
    } else {
      submitErrorRef.current?.focus();
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setTouched({
      name: true,
      phone: true,
      area: true,
      payment: true,
    });

    if (hasErrors) {
      setSubmitError(
        "Please correct the highlighted fields."
      );

      setTimeout(() => {
        focusFirstInvalidField();
      }, 0);

      return;
    }

    if (submitting) {
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    setSuccess(false);

    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          const shouldFail =
            searchParams.get("simulateFailure") === "true";

          if (shouldFail) {
            reject(
              new Error(
                "The order could not be submitted. Please try again."
              )
            );
          } else {
            resolve();
          }
        }, 1000);
      });

      addOrder({
        id: `ORDER-${String(orderCount + 1).padStart(4, "0")}`,
        items: [...items],
        subtotal,
        couponCode: appliedCoupon?.code || null,
        discount,
        deliveryFee: delivery.fee,
        estimatedMinutes: delivery.minutes,
        total,
        name: form.name,
        phone: form.phone,
        area: form.area,
        payment: form.payment,
        specialInstructions: form.specialInstructions,
        status: "Preparing",
        createdAt: new Date().toISOString(),
      });
      setSuccess(true);
      clearCart();
      setForm(initialForm);
      setTouched({});
    } catch (error) {
      setSubmitError(error.message);

      setTouched({
        name: true,
        phone: true,
        area: true,
        payment: true,
      });

      setTimeout(() => {
        focusFirstInvalidField();
      }, 0);
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0 && !success) {
    return (
      <main className="state-screen">
        <h1>Checkout</h1>

        <p>
          Your cart is empty. Add a dish before checking out.
        </p>

        <Link to="/menu">
          Browse the menu
        </Link>
      </main>
    );
  }

  return (
    <main className="menu">
      <p className="section-kicker">
        Final Step
      </p>

      <h1>Checkout</h1>

      <section className="card">
        <h2>Order Summary</h2>

        {items.map((dish) => (
          <p key={dish.id}>
            {dish.name} × {dish.quantity || 1} — {formatCurrency(dish.price * (dish.quantity || 1))}
          </p>
        ))}

        <p>Subtotal: {formatCurrency(subtotal)}</p>
        {discount > 0 && (
          <p className="discount-line">
            Coupon ({appliedCoupon.code}): -{formatCurrency(discount)}
          </p>
        )}
        <p>Delivery: {formatCurrency(delivery.fee)}</p>
        <p>Estimated delivery: {delivery.minutes} minutes</p>
        <h2>Total: {formatCurrency(total)}</h2>
      </section>

      <form
        className="order-form"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="form-field coupon-field">
          <label htmlFor="coupon">Coupon Code</label>
          <div className="coupon-control">
            <input
              id="coupon"
              name="coupon"
              type="text"
              value={couponCode}
              onChange={(event) => {
                setCouponCode(event.target.value.toUpperCase());
                setAppliedCoupon(null);
                setCouponMessage("");
              }}
              placeholder="e.g. ADDIS10"
            />
            <button type="button" onClick={handleApplyCoupon}>
              Apply
            </button>
          </div>
          <p className="coupon-help">Try ADDIS10 for 10% off, or WELCOME50 for 50 ETB off orders over 300 ETB.</p>
          {couponMessage && (
            <p className={appliedCoupon ? "success-message" : "error-message"} role="status">
              {couponMessage}
            </p>
          )}
        </div>

        <Field
          label="Full Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name}
          touched={touched.name}
          placeholder="Your full name"
        />

        <Field
          label="Phone Number"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.phone}
          touched={touched.phone}
          placeholder="0911223344"
        />

        <Field
          label="Delivery Area"
          name="area"
          value={form.area}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.area}
          touched={touched.area}
          placeholder="Bole"
        />

        <p className="delivery-estimate" aria-live="polite">
          Delivery to {form.area || "your area"}: {formatCurrency(delivery.fee)} · approximately {delivery.minutes} minutes
        </p>

        <div className="form-field">
          <label htmlFor="specialInstructions">
            Special Instructions (optional)
          </label>
          <textarea
            id="specialInstructions"
            name="specialInstructions"
            value={form.specialInstructions}
            onChange={handleChange}
            placeholder="Less spicy, no onions, or delivery notes"
            rows="3"
          />
        </div>

        <div className="form-field">
          <label htmlFor="payment">
            Payment Method
          </label>

          <select
            id="payment"
            name="payment"
            value={form.payment}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(showError("payment"))}
            aria-describedby={
              showError("payment")
                ? "payment-error"
                : undefined
            }
          >
            <option value="">
              Select payment method
            </option>

            <option value="telebirr">
              TeleBirr
            </option>

            <option value="cash">
              Cash on Delivery
            </option>
          </select>

          {showError("payment") && (
            <p
              id="payment-error"
              className="error-message"
              role="alert"
            >
              {errors.payment}
            </p>
          )}
        </div>

        {submitError && (
          <p
            className="error-message"
            role="alert"
            tabIndex="-1"
            ref={(node) => {
              submitErrorRef.current = node;

              if (node) {
                node.focus();
              }
            }}
          >
            {submitError}
          </p>
        )}

        {success && (
          <p
            className="success-message"
            role="status"
          >
            Your order was placed successfully.
          </p>
        )}

        {success && (
          <Link to="/orders" className="track-order-link">
            Track your order status
          </Link>
        )}

        <button
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? `Placing order — ${formatCurrency(total)}`
            : `Place order — ${formatCurrency(total)}`}
        </button>
      </form>
    </main>
  );
}
