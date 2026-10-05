"use client";

import { BrowserRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import App from "./App";
import { DishesProvider } from "./providers";

export default function ClientApp({ dishes }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  return <DishesProvider dishes={dishes}>{ready ? <BrowserRouter><App /></BrowserRouter> : <main className="page-section"><p className="section-kicker">Addis Eats</p><h1>Fresh from Addis</h1><p>Our menu is ready. Enable JavaScript for the interactive capstone experience.</p><ul>{dishes.slice(0, 4).map((dish) => <li key={dish.id}>{dish.name} — {dish.price} ETB</li>)}</ul></main>}</DishesProvider>;
}
