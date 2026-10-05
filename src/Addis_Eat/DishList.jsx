import { memo } from "react";
import PropTypes from "prop-types";
import Card from "./Card";
import Dish from "./Dish";

function DishList({ dishes, onAdd }) {
  if (dishes.length === 0) {
    return (
      <p className="empty-state" role="status">No dishes in this category yet.</p>
    );
  }

  return (
    <div className="dish-list">
      {dishes.map((dish) => (
        <Card key={dish.id} className="dish-card">
          <Dish {...dish} onAdd={onAdd} />
        </Card>
      ))}
    </div>
  );
}

DishList.propTypes = {
  dishes: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default memo(DishList);
