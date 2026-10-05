import { memo, useState } from "react";
import Image from "next/image";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useFavoritesStore } from "../store/favoritesStore";
import Modal from "../ui/Modal";

function Dish({
  id,
  name,
  price,
  category,
  spicy,
  description,
  image,
  onAdd,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCartStore(
    (state) => state.addItem
  );
  const isFavorite = useFavoritesStore(
    (state) => state.items.some((item) => item.id === id)
  );
  const toggleFavorite = useFavoritesStore(
    (state) => state.toggleFavorite
  );

  function handleAdd() {
    addItem({
      id,
      name,
      price,
      spicy,
      description,
      image,
    });

    onAdd?.(name);
  }

  return (
    <div className="dish">
      {image && (
        <div className="dish-visual"><Image src={image} alt={`${name}, ${category} dish`} width={1200} height={900} sizes="(max-width: 760px) 92vw, (max-width: 1100px) 45vw, 300px" className="media-image" /></div>
      )}

      <div className="dish-meta">
        <span className="dish-number">{String(id).padStart(2, "0")}</span>
        <span className="dish-category-label">{category}</span>
      </div>

      <div className="dish-copy">
        <h3>
          <button
            type="button"
            className="dish-link"
            onClick={() => setIsOpen(true)}
          >
            {name}
          </button>

          {spicy && (
            <span className="spicy-badge">
              Spicy
            </span>
          )}
        </h3>

        <p className="description">
          {description}
        </p>
      </div>

      <div className="dish-actions">
        <p className="price">
          <span>{price}</span> ETB
        </p>

        <button
          type="button"
          className="favorite-inline"
          aria-label={isFavorite ? "Remove from favorites" : "Save item"}
          onClick={() => toggleFavorite({ id, name, price, spicy, description, image })}
        >
          {isFavorite ? "♥ Saved" : "♡ Save"}
        </button>

        <button
          type="button"
          className="add-button"
          onClick={handleAdd}
        >
          Add to order
        </button>
      </div>

      {isOpen && (
        <Modal title={name} onClose={() => setIsOpen(false)}>
          <p>{description}</p>
          <p>{price} ETB</p>
          {spicy && <p className="spicy-badge">Spicy</p>}
          <Link to={`/menu/${id}`} onClick={() => setIsOpen(false)}>
            Open full dish page
          </Link>
        </Modal>
      )}
    </div>
  );
}

export default memo(Dish);
