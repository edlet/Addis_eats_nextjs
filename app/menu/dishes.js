// Keep Day 40's server menu in sync with the existing project dataset.
import dishes from "../../public/dishes.json";

export { dishes };
export async function getDish(id) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const value = String(id).toLowerCase();
  return dishes.find((dish) => String(dish.id) === value || dish.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") === value);
}

export async function getMenuDishes() {
  await new Promise((resolve) => setTimeout(resolve, 700));
  return dishes;
}

export async function getMenuCategories() {
  return ["All", ...new Set(dishes.map((dish) => dish.category))];
}
