"use client";

import { createContext, useContext, useEffect } from "react";
import { useAdminDishesStore } from "./admin/adminDishesStore";

const DishesContext = createContext([]);

export function DishesProvider({ dishes, children }) {
  const savedDishes = useAdminDishesStore((state) => state.dishes);
  const seedDishes = useAdminDishesStore((state) => state.seedDishes);

  useEffect(() => {
    if (!savedDishes.length) seedDishes(dishes);
  }, [dishes, savedDishes.length, seedDishes]);

  return <DishesContext.Provider value={dishes}>{children}</DishesContext.Provider>;
}

export function useServerDishes() {
  return useContext(DishesContext);
}

export function useMenuData() {
  const seedDishes = useServerDishes();
  const savedDishes = useAdminDishesStore((state) => state.dishes);
  return { data: savedDishes.length ? savedDishes : seedDishes, loading: false, error: "" };
}
