import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useOrdersStore = create(
  persist(
    (set) => ({
      orders: [],

      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
        })),

      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, status } : order
          ),
        })),

      removeOrder: (id) =>
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== id),
        })),
    }),
    {
      name: "addis-eats-orders",
    }
  )
);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key !== "addis-eats-orders" || !event.newValue) {
      return;
    }

    try {
      const persisted = JSON.parse(event.newValue);

      if (Array.isArray(persisted.state?.orders)) {
        useOrdersStore.setState({ orders: persisted.state.orders });
      }
    } catch {
      return;
    }
  });
}
