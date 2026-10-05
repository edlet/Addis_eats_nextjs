import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useFavoritesStore = create(
  persist(
    (set) => ({
      items: [],

      toggleFavorite: (dish) =>
        set((state) => {
          const exists = state.items.some(
            (item) => item.id === dish.id
          );

          return {
            items: exists
              ? state.items.filter((item) => item.id !== dish.id)
              : [...state.items, dish],
          };
        }),

      removeFavorite: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
    }),
    {
      name: "addis-eats-favorites",
    }
  )
);
