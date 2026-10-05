import {
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import CategoryBar from "./Addis_Eat/CategoryBar";
import DishList from "./Addis_Eat/DishList";
import { useMenuData } from "./providers";
import { useCartStore } from "./store/cartStore";
import { formatCurrency } from "./utils/formatCurrency";

export default function Menu() {
  const [searchParams, setSearchParams] =
    useSearchParams();
  const navigate = useNavigate();

  const category =
    searchParams.get("category") || "All";

  if (searchParams.get("fail") === "menu") {
    throw new Error("Deliberate menu failure for boundary testing.");
  }

  const [search, setSearch] = useState("");

  const searchRef = useRef(null);

  const items = useCartStore(
    (state) => state.items
  );

  const total = items.reduce(
    (sum, dish) => sum + dish.price * (dish.quantity || 1),
    0
  );

  const { data, loading, error } = useMenuData();

  useEffect(() => {
    if (!loading && !error) {
      searchRef.current?.focus();
    }
  }, [loading, error]);

  const filteredDishes = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.filter((dish) => {
      const matchesCategory =
        category === "All" ||
        dish.category === category;

      const matchesSearch =
        dish.name
          .toLowerCase()
          .includes(search.toLowerCase());

      return (
        matchesCategory &&
        matchesSearch
      );
    });
  }, [data, category, search]);

  const handleDishAdded = useCallback(() => {
    navigate("/cart");
  }, [navigate]);

  function handleCategoryChange(newCategory) {
    if (newCategory === "All") {
      setSearchParams({});
    } else {
      setSearchParams({
        category: newCategory,
      });
    }
  }

  if (loading) {
    return (
      <main
        className="state-screen"
        aria-live="polite"
      >
        <h1>Addis Eats</h1>

        <p className="loading">
          Loading the menu...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main
        className="state-screen"
        role="alert"
      >
        <h1>Addis Eats</h1>

        <p className="err">
          {error}
        </p>
      </main>
    );
  }

  return (
    <section className="menu">
      <div className="menu-header">
        <div>
          <p className="section-kicker">
            Chef&apos;s picks
          </p>

          <h2>Today&apos;s Menu</h2>
        </div>

        <div
          className="order-summary"
          aria-live="polite"
        >
          <span className="order-tag">
            {filteredDishes.length} dishes
          </span>

          <strong>
            {formatCurrency(total)}
          </strong>
        </div>
      </div>

      <label
        className="search-label"
        htmlFor="dish-search"
      >
        Search the menu
      </label>

      <input
        ref={searchRef}
        id="dish-search"
        type="search"
        placeholder="Try Doro Wat..."
        value={search}
        onChange={(event) =>
          setSearch(event.target.value)
        }
      />

      <CategoryBar
        selected={category}
        onSelect={handleCategoryChange}
      />

      <DishList
        dishes={filteredDishes}
        onAdd={handleDishAdded}
      />

      <h3 className="order-total">
        Order Total: {formatCurrency(total)}
      </h3>
    </section>
  );
}
