"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "../providers";
import AddDishButton from "../menu/AddDishButton";
import FavoriteButton from "../menu/FavoriteButton";

export default function FavoritesPage() {
  const { favorites } = useCart();

  return (
    <main className="page-section">
      <p className="section-kicker">Your saved dishes</p>
      <h1>Favorites</h1>
      {!favorites.length ? (
        <div className="state-screen">
          <h2>No favorites yet.</h2>
          <p>Save dishes from the menu and they will be ready for you here.</p>
          <Link href="/menu" className="primary-button">Browse the menu</Link>
        </div>
      ) : (
        <div className="dish-list">
          {favorites.map((dish) => (
            <article className="dish-card" key={dish.id}>
              <div className="dish-visual"><Image src={dish.image} alt={`${dish.name}, ${dish.category} saved dish`} width={1200} height={900} sizes="(max-width: 760px) 92vw, (max-width: 1100px) 45vw, 300px" className="media-image" /></div>
              <div className="dish-meta"><span>{String(dish.id).padStart(2, "0")}</span><span>{dish.category}</span></div>
              <h2><Link href={`/menu/${dish.id}`}>{dish.name}</Link>{dish.spicy && <em>Spicy</em>}</h2>
              <p>{dish.description}</p>
              <div className="dish-actions"><strong>{dish.price} ETB</strong><FavoriteButton dish={dish} /><AddDishButton dish={dish} /></div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
