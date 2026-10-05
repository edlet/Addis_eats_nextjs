import { getDishes } from "@/app/lib/dishes";

export async function GET(request) {
  const params = new URL(request.url).searchParams;
  const query = (params.get("q") || "").trim().toLowerCase();
  const category = params.get("category") || "All";
  const page = Math.max(1, Number.parseInt(params.get("page") || "1", 10) || 1);
  const pageSize = 6;
  const all = (await getDishes()).filter((dish) =>
    (category === "All" || dish.category === category) && dish.name.toLowerCase().includes(query)
  );
  const pages = Math.max(1, Math.ceil(all.length / pageSize));
  const currentPage = Math.min(page, pages);
  const dishes = all.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  return Response.json({ dishes, page: currentPage, pages, total: all.length });
}
