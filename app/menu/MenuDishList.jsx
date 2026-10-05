import DishList from "./DishList";
import { getMenuDishes } from "./dishes";

export default async function MenuDishList({ category, search }) {
  const dishes = await getMenuDishes();
  const normalizedSearch = search.toLowerCase();
  const visibleDishes = dishes.filter((dish) =>
    (category === "All" || dish.category === category) && dish.name.toLowerCase().includes(normalizedSearch)
  );
  return <DishList dishes={visibleDishes} />;
}
