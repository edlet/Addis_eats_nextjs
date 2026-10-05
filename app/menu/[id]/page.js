import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AddDishButton from "../AddDishButton";
import { dishes, getDish } from "../dishes";

export function generateStaticParams() {
  return dishes.map((dish) => ({ id: dish.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") }));
}

export default async function DishPage({ params }) {
  const { id } = await params;
  const dish = await getDish(id);
  if (!dish) notFound();

  return (
    <main className="page-section detail-page">
      <Link href="/menu" className="back-link">← Back to menu</Link>
      <div className="detail-grid">
        <div className="detail-image"><Image src={dish.image} alt={`${dish.name}, ${dish.category} Ethiopian dish`} width={1200} height={900} sizes="(max-width: 760px) 92vw, 620px" className="media-image" /></div>
        <div>
          <p className="section-kicker">{dish.category}</p>
          <h1>{dish.name}</h1>
          {dish.spicy && <span className="spicy-badge">Spicy</span>}
          <p className="lead">{dish.description}</p>
          <div className="detail-actions"><strong>{dish.price} ETB</strong><AddDishButton dish={dish} /></div>
        </div>
      </div>
    </main>
  );
}
