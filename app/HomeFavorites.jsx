"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "./providers";

export default function HomeFavorites() {
  const { favorites } = useCart();

  return (
    <section className="home-favorites" aria-labelledby="home-favorites-title">
      <div className="section-heading-row">
        <div><p className="section-kicker">Saved by you</p><h2 id="home-favorites-title">Your Favorites</h2></div>
        <Link href="/favorites" className="link-button">View all favorites →</Link>
      </div>
      {favorites.length === 0 ? (
        <div className="home-favorites-empty">
          <div><h3>Build your favorite order list</h3><p>Tap the heart on any dish and it will appear here for your next order.</p></div>
          <Link href="/menu" className="primary-button">Browse the menu</Link>
        </div>
      ) : (
        <div className="home-favorites-grid">
          {favorites.slice(0, 4).map((dish) => (
            <article key={dish.id} className="home-favorite-card">
              {dish.image && <div className="home-favorite-image"><Image src={dish.image} alt={`${dish.name}, saved ${dish.category} dish`} width={1200} height={900} sizes="(max-width: 760px) 92vw, 25vw" className="media-image" /></div>}
              <div className="home-favorite-body">
                <div><p className="saved-label">Saved dish</p><h3>{dish.name}</h3><p>{dish.description}</p></div>
                <div className="home-favorite-footer"><strong>{dish.price} ETB</strong><Link href={`/menu/${dish.id}`} className="mini-add-button">View dish</Link></div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
