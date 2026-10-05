import { useEffect, useMemo, useState } from "react";
import { useAdminDishesStore } from "./adminDishesStore";

const emptyDish = { name: "", price: "", category: "Main", description: "", image: "", spicy: false };

export default function DishManager() {
  const dishes = useAdminDishesStore((state) => state.dishes);
  const seedDishes = useAdminDishesStore((state) => state.seedDishes);
  const addDish = useAdminDishesStore((state) => state.addDish);
  const updateDish = useAdminDishesStore((state) => state.updateDish);
  const deleteDish = useAdminDishesStore((state) => state.deleteDish);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyDish);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(!dishes.length);

  useEffect(() => {
    if (dishes.length) {
      return undefined;
    }

    let active = true;
    fetch("/dishes.json")
      .then((response) => response.json())
      .then((data) => {
        if (active) seedDishes(data);
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [dishes.length, seedDishes]);

  const isLoading = !dishes.length && loading;

  const filteredDishes = useMemo(() => dishes.filter((dish) => dish.name.toLowerCase().includes(search.toLowerCase())), [dishes, search]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  }

  function resetForm() {
    setForm(emptyDish);
    setEditingId(null);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const dish = { ...form, price: Number(form.price) };
    if (editingId) updateDish(editingId, dish);
    else addDish(dish);
    resetForm();
  }

  function startEdit(dish) {
    setEditingId(dish.id);
    setForm({ ...dish, price: String(dish.price) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section className="admin-page">
      <div className="admin-page-heading"><div><p className="section-kicker">Catalog</p><h2>Menu management</h2><p>Add, edit, search, or remove dishes.</p></div><span className="admin-live-badge">{dishes.length} dishes</span></div>

      <section className="admin-panel admin-form-panel">
        <div className="admin-panel-heading"><h3>{editingId ? "Edit dish" : "Add new dish"}</h3>{editingId && <button type="button" className="text-button" onClick={resetForm}>Cancel edit</button>}</div>
        <form className="admin-dish-form" onSubmit={handleSubmit}>
          <label>Name<input name="name" value={form.name} onChange={handleChange} required /></label>
          <label>Price (ETB)<input name="price" type="number" min="0" value={form.price} onChange={handleChange} required /></label>
          <label>Category<input name="category" value={form.category} onChange={handleChange} required /></label>
          <label className="admin-wide-field">Image URL<input name="image" value={form.image} onChange={handleChange} /></label>
          <label className="admin-wide-field">Description<textarea name="description" value={form.description} onChange={handleChange} rows="2" required /></label>
          <label className="admin-checkbox"><input name="spicy" type="checkbox" checked={form.spicy} onChange={handleChange} /> Spicy</label>
          <button type="submit">{editingId ? "Save changes" : "Add dish"}</button>
        </form>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading"><h3>All dishes</h3><input className="admin-search" aria-label="Search dishes" placeholder="Search dishes" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
        {isLoading ? <p className="admin-muted">Loading seeded dishes...</p> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Dish</th><th>Category</th><th>Price</th><th>Actions</th></tr></thead><tbody>{filteredDishes.map((dish) => <tr key={dish.id}><td><strong>{dish.name}</strong><small>{dish.description}</small></td><td>{dish.category}</td><td>{dish.price} ETB</td><td><button type="button" className="table-action" onClick={() => startEdit(dish)}>Edit</button><button type="button" className="table-action danger" onClick={() => window.confirm(`Delete ${dish.name}?`) && deleteDish(dish.id)}>Delete</button></td></tr>)}</tbody></table></div>}
      </section>
    </section>
  );
}
