import Link from "next/link";
import Image from "next/image";
import AddDishButton from "./AddDishButton";
import FavoriteButton from "./FavoriteButton";

// Server-rendered cards keep the list and its markup out of the client bundle.
export default function DishList({ dishes }) {
  if (!dishes.length) return <p className="empty-state">No dishes in this category yet.</p>;
  return <div className="dish-list">{dishes.map((dish) => <article className="dish-card" key={dish.id}><div className="dish-visual"><Image src={dish.image} alt={`${dish.name}, ${dish.category} dish`} width={1200} height={900} sizes="(max-width: 760px) 92vw, (max-width: 1100px) 45vw, 300px" className="media-image" /></div><div className="dish-meta"><span>{String(dish.id).padStart(2, "0")}</span><span>{dish.category}</span></div><h2><Link href={`/menu/${dish.id}`}>{dish.name}</Link>{dish.spicy && <em>Spicy</em>}</h2><p>{dish.description}</p><div className="dish-actions"><strong>{dish.price} ETB</strong><FavoriteButton dish={dish} /><AddDishButton dish={dish} /></div></article>)}</div>;
}
