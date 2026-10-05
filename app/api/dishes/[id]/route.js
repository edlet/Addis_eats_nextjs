import { getDishes } from "@/app/lib/dishes";

export async function GET(_request, { params }) {
  const { id } = await params;
  const dishes = await getDishes();
  const dish = dishes.find((item) => String(item.id) === id);

  if (!dish) {
    return Response.json(
      { error: { code: "DISH_NOT_FOUND", message: "Dish not found." } },
      { status: 404 },
    );
  }

  return Response.json({ dish });
}
