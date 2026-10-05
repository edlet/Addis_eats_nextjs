import MenuContents from "./MenuContents";
import MenuLiveList from "./MenuLiveList";
import { dishes, getMenuCategories } from "./dishes";

export const metadata = { title: "Menu | Addis Eats" };
export const revalidate = 60;

export default async function MenuPage({ searchParams }) {
  const params = await searchParams;
  const categories = await getMenuCategories();
  const selectedCategory = categories.includes(params.category) ? params.category : "All";
  const search = typeof params.search === "string" ? params.search : "";
  const page = Math.max(1, Number.parseInt(params.page || "1", 10) || 1);
  const filtered = dishes.filter((dish) => (selectedCategory === "All" || dish.category === selectedCategory) && dish.name.toLowerCase().includes(search.toLowerCase()));
  const pages = Math.max(1, Math.ceil(filtered.length / 6));
  const currentPage = Math.min(page, pages);
  const initialData = { dishes: filtered.slice((currentPage - 1) * 6, currentPage * 6), page: currentPage, pages, total: filtered.length };
  return <MenuContents><MenuLiveList categories={categories} selectedCategory={selectedCategory} initialSearch={search} page={currentPage} initialData={initialData} /></MenuContents>;
}
