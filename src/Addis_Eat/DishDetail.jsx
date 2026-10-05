import { Link, useParams } from "react-router-dom";
import Image from "next/image";
import { useCartStore } from "../store/cartStore";
import { useMenuData } from "../providers";
import { formatCurrency } from "../utils/formatCurrency";

export default function DishDetail() {
  const { id } = useParams();

  const { data, loading, error } = useMenuData();

  const addItem = useCartStore(
    (state) => state.addItem
  );

  const dish = data?.find(
    (item) => String(item.id) === String(id)
  );

  if (loading) {
    return (
      <main className="state-screen" aria-live="polite">
        <h1>Loading dish...</h1>
        <p className="loading">Preparing the dish details.</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="state-screen" role="alert">
        <h1>Dish unavailable</h1>
        <p>{error}</p>
        <Link to="/menu">Back to Menu</Link>
      </main>
    );
  }

  if (!dish) {
    return (
      <main className="state-screen">
        <h1>Dish not found</h1>

        <p>
          We couldn't find a dish with ID "{id}".
        </p>

        <Link to="/menu">
          Back to Menu
        </Link>
      </main>
    );
  }

  function handleAdd() {
    addItem({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      spicy: dish.spicy,
      description: dish.description,
      image: dish.image,
    });
  }

  return (
    <main className="menu">
      <p className="section-kicker">
        Dish Details
      </p>

      <h1>{dish.name}</h1>

      {dish.image && (
        <div className="detail-image"><Image src={dish.image} alt={`${dish.name}, ${dish.category} dish`} width={1200} height={900} sizes="(max-width: 760px) 92vw, 620px" className="media-image" /></div>
      )}

      <p className="dish-category">{dish.category}</p>

      {dish.spicy && (
        <span className="spicy-badge">
          Spicy
        </span>
      )}

      <p className="description">
        {dish.description}
      </p>

      <h2>{formatCurrency(dish.price)}</h2>

      <button
        type="button"
        className="add-button"
        onClick={handleAdd}
      >
        Add to order
      </button>

      <p>
        <Link to="/menu">
          ← Back to Menu
        </Link>
      </p>
    </main>
  );
}
