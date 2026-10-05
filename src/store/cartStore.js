import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],

      addItem: (dish) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === dish.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === dish.id
                  ? { ...item, quantity: (item.quantity || 1) + 1 }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { ...dish, quantity: 1 }],
          };
        }),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.id !== id)
              : state.items.map((item) =>
                  item.id === id
                    ? { ...item, quantity }
                    : item
                ),
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter(
            (dish) => dish.id !== id
          ),
        })),

      clearCart: () =>
        set({
          items: [],
        }),
    }),
    {
      name: "addis-eats-cart",
    }
  )
);