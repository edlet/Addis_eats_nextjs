import PropTypes from "prop-types";

function CategoryBar({ selected, onSelect }) {
  const categories = [
    "All",
    "Main",
    "Vegan",
    "Grill",
    "Breakfast",
    "Soup",
    "Modern",
    "Drinks",
    "Healthy",
  ];

  return (
    <div className="category-bar">
      {categories.map((category) => (
        <button
          type="button"
          key={category}
          onClick={() => onSelect(category)}
          className={
            selected === category
              ? "active"
              : ""
          }
        >
          {category}
        </button>
      ))}
    </div>
  );
}

CategoryBar.propTypes = {
  selected: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default CategoryBar;