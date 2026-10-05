import {
  Link,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import Image from "next/image";


import Home from "./Addis_Eat/Home";
import Menu from "./Menu";
import DishDetail from "./Addis_Eat/DishDetail";
import Cart from "./Addis_Eat/Cart";
import Login from "./Addis_Eat/Login";
import NotFound from "./Addis_Eat/NotFound";

import Layout from "./Layout";
import RequireAuth from "./routes/RequireAuth";
import { useFavoritesStore } from "./store/favoritesStore";
import { useOrdersStore } from "./store/ordersStore";
import { useCartStore } from "./store/cartStore";
import { formatCurrency } from "./utils/formatCurrency";
import ErrorBoundary from "./ui/ErrorBoundary";
import RequireAdmin from "./admin/RequireAdmin";

const orderStatuses = ["Pending", "Preparing", "Delivering", "Delivered"];

const Checkout = lazy(() => import("./Addis_Eat/Checkout"));
const Receipt = lazy(() => import("./Addis_Eat/Receipt"));
const AdminLogin = lazy(() => import("./admin/AdminLogin"));
const AdminLayout = lazy(() => import("./admin/AdminLayout"));
const Dashboard = lazy(() => import("./admin/Dashboard"));
const DishManager = lazy(() => import("./admin/DishManager"));
const OrderManager = lazy(() => import("./admin/OrderManager"));

function Favorites() {
  const favorites = useFavoritesStore((state) => state.items);
  const toggleFavorite = useFavoritesStore(
    (state) => state.toggleFavorite
  );

  return (
    <main className="collection-page">
      <p className="section-kicker">Saved for later</p>
      <div className="collection-heading">
        <div>
          <h1>Favorites</h1>
          <p>Keep the dishes you want to come back to.</p>
        </div>
        <span className="order-tag">{favorites.length} saved</span>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state collection-empty">
          <h2>No favorites yet</h2>
          <p>Tap the heart on a dish to save it here.</p>
          <Link to="/menu" className="primary-button">Browse the menu</Link>
        </div>
      ) : (
        <div className="collection-grid">
          {favorites.map((dish) => (
            <article key={dish.id} className="collection-card">
              {dish.image && (
                <div className="collection-image"><Image src={dish.image} alt={`${dish.name}, ${dish.category} saved dish`} width={1200} height={900} sizes="(max-width: 760px) 92vw, 30vw" className="media-image" /></div>
              )}
              <div className="collection-card-body">
                <div>
                  <h2>{dish.name}</h2>
                  <p>{dish.description}</p>
                </div>
                <div className="collection-card-footer">
                  <strong>{dish.price} ETB</strong>
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => toggleFavorite(dish)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

function Orders() {
  const orders = useOrdersStore((state) => state.orders);
  const addItem = useCartStore((state) => state.addItem);
  const navigate = useNavigate();

  function handleReorder(order) {
    order.items.forEach((item) => {
      const quantity = item.quantity || 1;

      for (let index = 0; index < quantity; index += 1) {
        addItem(item);
      }
    });

    navigate("/cart");
  }

  return (
    <main className="collection-page">
      <p className="section-kicker">Your order history</p>
      <div className="collection-heading">
        <div>
          <h1>Orders</h1>
          <p>Track the meals you have ordered from Addis Eats.</p>
        </div>
        <span className="order-tag">{orders.length} orders</span>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state collection-empty">
          <h2>No orders yet</h2>
          <p>Your completed orders will appear here.</p>
          <Link to="/menu" className="primary-button">Start an order</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article key={order.id} className="order-card">
              <div className="order-card-heading">
                <div>
                  <p className="section-kicker">Order #{order.id}</p>
                  <h2>{new Date(order.createdAt).toLocaleDateString()}</h2>
                </div>
                <span className="status-badge">{order.status}</span>
              </div>
              <div className="order-items">
                {order.items.map((item, index) => (
                  <span key={`${item.id}-${index}`}>
                    {item.name}
                  </span>
                ))}
              </div>
              <div className="customer-status-track" aria-label={`Order status: ${order.status}`}>
                {orderStatuses.map((status, index) => (
                  <div
                    key={status}
                    className={index <= orderStatuses.indexOf(order.status) ? "status-step active" : "status-step"}
                  >
                    <span>{index + 1}</span>
                    <small>{status}</small>
                  </div>
                ))}
              </div>
              <div className="order-card-footer">
                <span>{order.area} · {order.payment}</span>
                <strong>{formatCurrency(order.total)}</strong>
              </div>
              <button
                type="button"
                className="reorder-button"
                onClick={() => handleReorder(order)}
              >
                Reorder
              </button>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

function RouteSkeleton() {
  return (
    <main className="state-screen" aria-live="polite">
      <h1>Preparing your order...</h1>
      <p className="loading">Loading checkout details...</p>
    </main>
  );
}

function AdminRouteSkeleton() {
  return (
    <main className="state-screen" aria-live="polite">
      <h1>Loading admin tools...</h1>
      <p className="loading">Preparing the dashboard...</p>
    </main>
  );
}

function MenuUnavailable() {
  return (
    <main className="state-screen" role="alert">
      <h1>Menu unavailable</h1>
      <p>We could not load the menu, but your cart and account are still available.</p>
      <button type="button" onClick={() => window.location.reload()}>
        Try again
      </button>
    </main>
  );
}

function CartUnavailable() {
  return (
    <main className="state-screen" role="alert">
      <h1>Cart unavailable</h1>
      <p>We could not display your cart. Your saved order has not been changed.</p>
      <button type="button" onClick={() => window.location.reload()}>
        Reload cart
      </button>
    </main>
  );
}

function RouteUnavailable() {
  return (
    <main className="state-screen" role="alert">
      <h1>Page unavailable</h1>
      <p>We could not load this page. Your cart and menu are still available.</p>
      <button type="button" onClick={() => window.location.reload()}>
        Try again
      </button>
    </main>
  );
}

function LazyCheckout() {
  return (
    <Suspense fallback={<RouteSkeleton />}>
      <RequireAuth>
        <Checkout />
      </RequireAuth>
    </Suspense>
  );
}

function LazyReceipt() {
  return (
    <Suspense fallback={<RouteSkeleton />}>
      <Receipt />
    </Suspense>
  );
}

export default function App() {
  return (
    <Routes>
            <Route
              path="/admin/login"
              element={
                <Suspense fallback={<AdminRouteSkeleton />}>
                  <AdminLogin />
                </Suspense>
              }
            />

            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <Suspense fallback={<AdminRouteSkeleton />}>
                    <AdminLayout />
                  </Suspense>
                </RequireAdmin>
              }
            >
              <Route
                index
                element={
                  <Suspense fallback={<AdminRouteSkeleton />}>
                    <Dashboard />
                  </Suspense>
                }
              />
              <Route
                path="menu"
                element={
                  <Suspense fallback={<AdminRouteSkeleton />}>
                    <DishManager />
                  </Suspense>
                }
              />
              <Route
                path="orders"
                element={
                  <Suspense fallback={<AdminRouteSkeleton />}>
                    <OrderManager />
                  </Suspense>
                }
              />
            </Route>

            <Route
              path="/"
              element={<Layout />}
            >
              <Route
                index
                element={<Home />}
              />

              <Route
                path="menu"
                element={
                  <ErrorBoundary fallback={<MenuUnavailable />}>
                    <Menu />
                  </ErrorBoundary>
                }
              />

              <Route
                path="menu/:id"
                element={<DishDetail />}
              />

              <Route
                path="cart"
                element={
                  <ErrorBoundary fallback={<CartUnavailable />}>
                    <Cart />
                  </ErrorBoundary>
                }
              />

              <Route
                path="favorites"
                element={<Favorites />}
              />

              <Route
                path="orders"
                element={<Orders />}
              />

              <Route
                path="login"
                element={<Login />}
              />

              <Route
                path="checkout"
                element={
                  <ErrorBoundary fallback={<RouteUnavailable />}>
                    <LazyCheckout />
                  </ErrorBoundary>
                }
              />
              <Route
                path="receipt"
                element={
                  <ErrorBoundary fallback={<RouteUnavailable />}>
                    <LazyReceipt />
                  </ErrorBoundary>
                }
              />

              <Route
                path="*"
                element={<NotFound />}
              />
            </Route>
    </Routes>
  );
}
