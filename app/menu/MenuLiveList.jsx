"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DishList from "./DishList";
import { useLiveQuery } from "../lib/live-query";

function dishesUrl({ search, category, page }) {
  const params = new URLSearchParams({ q: search, category, page: String(page) });
  return `/api/dishes?${params}`;
}

export default function MenuLiveList({ categories, initialSearch, selectedCategory, page, initialData }) {
  const [input, setInput] = useState(initialSearch);
  const [debounced, setDebounced] = useState(initialSearch);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(input.trim()), 350);
    return () => clearTimeout(timer);
  }, [input]);

  // Empty search disables this query; the server-rendered page is already complete.
  const key = debounced ? dishesUrl({ search: debounced, category: selectedCategory, page }) : null;
  const { data, error, isValidating } = useLiveQuery(key, { fallbackData: initialData, keepPreviousData: true, staleTime: 30_000 });
  const result = data || initialData;
  const query = new URLSearchParams();
  if (debounced) query.set("search", debounced);
  if (selectedCategory !== "All") query.set("category", selectedCategory);
  const hrefForPage = (nextPage) => {
    const params = new URLSearchParams(query);
    params.set("page", String(nextPage));
    return `/menu?${params}`;
  };

  return <>
    <label className="search-label" htmlFor="dish-search">Search the menu</label>
    <input id="dish-search" type="search" placeholder="Try Doro Wat..." value={input} onChange={(event) => setInput(event.target.value)} />
    <div className="category-list" aria-label="Menu categories">{categories.map((category) => {
      const params = new URLSearchParams();
      if (category !== "All") params.set("category", category);
      if (debounced) params.set("search", debounced);
      return <Link key={category} className={selectedCategory === category ? "active" : ""} href={`/menu${params.size ? `?${params}` : ""}`}>{category}</Link>;
    })}</div>
    {error && <p className="error-message" role="alert">Could not refresh dishes. Showing the last available results.</p>}
    {isValidating && <span className="sr-only" aria-live="polite">Updating dishes</span>}
    <DishList dishes={result.dishes} />
    <nav className="dish-pagination" aria-label="Dish pages">
      <span>Page {result.page} of {result.pages} ({result.total} dishes)</span>
      {result.page > 1 && <Link href={hrefForPage(result.page - 1)}>Previous</Link>}
      {result.page < result.pages && <Link href={hrefForPage(result.page + 1)}>Next</Link>}
    </nav>
  </>;
}
