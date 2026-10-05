import { Link, useSearchParams } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { formatCurrency } from "../utils/formatCurrency";

export default function Cart() {
  const [searchParams] = useSearchParams();

  if (searchParams.get("fail") === "cart") {
    throw new Error("Deliberate cart failure for boundary testing.");
  }

  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const total = items.reduce(
    (sum, dish) => sum + dish.price * (dish.quantity || 1),
    0
  );

  return (
    <main className="menu cart-page">
      <div className="menu-header">
        <div>
          <p className="section-kicker">Your order</p>
          <h2>Shopping Cart</h2>
        </div>
        <strong>{formatCurrency(total)}</strong>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <p>Your cart is empty.</p>
          <Link to="/menu">Browse the menu</Link>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {items.map((dish) => {
              const quantity = dish.quantity || 1;

              return (
                <article key={dish.id} className="cart-line">
                  <div className="cart-line-copy">
                    <h3>{dish.name}</h3>
                    <p>{formatCurrency(dish.price)} each</p>
                  </div>

                  <div className="quantity-control" aria-label={`Quantity for ${dish.name}`}>
                    <button type="button" aria-label={`Decrease ${dish.name}`} onClick={() => updateQuantity(dish.id, quantity - 1)}>
                      −
                    </button>
                    <span aria-live="polite">{quantity}</span>
                    <button type="button" aria-label={`Increase ${dish.name}`} onClick={() => updateQuantity(dish.id, quantity + 1)}>
                      +
                    </button>
                  </div>

                  <strong className="cart-line-total">{formatCurrency(dish.price * quantity)}</strong>

                  <button type="button" className="remove-item-button" onClick={() => removeItem(dish.id)}>
                    Remove
                  </button>
                </article>
              );
            })}
          </div>

          <div className="cart-actions">
            <strong className="order-total">Total: {formatCurrency(total)}</strong>
            <button type="button" className="text-button" onClick={clearCart}>
              Clear cart
            </button>
          </div>

          <section className="cart-next-step" aria-labelledby="cart-next-step-title">
            <div>
              <h3 id="cart-next-step-title">Ready to place your order?</h3>
              <p>Continue to checkout or return to the menu to add more dishes.</p>
            </div>
            <div className="cart-next-step-actions">
              <Link to="/checkout" className="add-button cart-checkout-link">
                Checkout
              </Link>
              <Link to="/menu" className="text-button">
                Back to Menu
              </Link>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
