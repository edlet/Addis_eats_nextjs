import { dishes } from "./menu/dishes";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const toAbsoluteUrl = (path) => new URL(path, siteUrl).toString();
const toDishSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function sitemap() {
  return [
    { url: toAbsoluteUrl("/") },
    { url: toAbsoluteUrl("/menu") },
    ...dishes.map((dish) => ({ url: toAbsoluteUrl(`/menu/${toDishSlug(dish.name)}`) })),
  ];
}