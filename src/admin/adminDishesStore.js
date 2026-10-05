import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAdminDishesStore = create(
  persist(
    (set) => ({
      dishes: [],

      syncSeedDishes: (dishes) =>
        set((state) => ({
          dishes: state.dishes.length
            ? state.dishes.map((dish) => {
                const updatedDish = dishes.find(
                  (item) => String(item.id) === String(dish.id)
                );

                return updatedDish
                  ? { ...dish, image: updatedDish.image }
                  : dish;
              })
            : dishes,
        })),

      addDish: (dish) =>
        set((state) => ({
          dishes: [
            ...state.dishes,
            { ...dish, id: Math.max(0, ...state.dishes.map((item) => item.id)) + 1 },
          ],
        })),

      updateDish: (id, changes) =>
        set((state) => ({
          dishes: state.dishes.map((dish) =>
            dish.id === id ? { ...dish, ...changes } : dish
          ),
        })),

      deleteDish: (id) =>
        set((state) => ({
          dishes: state.dishes.filter((dish) => dish.id !== id),
        })),
    }),
    {
      name: "addis-eats-admin-dishes",
    }
  )
);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key !== "addis-eats-admin-dishes" || !event.newValue) {
      return;
    }

    try {
      const persisted = JSON.parse(event.newValue);

      if (Array.isArray(persisted.state?.dishes)) {
        useAdminDishesStore.setState({ dishes: persisted.state.dishes });
      }
    } catch {
      return;
    }
  });
}
