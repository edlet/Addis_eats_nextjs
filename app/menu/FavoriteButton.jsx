"use client";

import { useCart } from "../providers";

export default function FavoriteButton({ dish }) {
  const { favorites, toggleFavorite } = useCart();
  const isFavorite = favorites.some((item) => item.id === dish.id);

  return (
    <button
      type="button"
      className="favorite-inline"
      aria-label={isFavorite ? `Remove ${dish.name} from favorites` : `Save ${dish.name} to favorites`}
      aria-pressed={isFavorite}
      onClick={() => toggleFavorite(dish)}
    >
      {isFavorite ? "♥ Saved" : "♡ Save"}
    </button>
  );
}
