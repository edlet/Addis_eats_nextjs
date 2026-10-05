import Link from "next/link";
import Image from "next/image";
import AddDishButton from "./menu/AddDishButton";
import FavoriteButton from "./menu/FavoriteButton";
import HomeFavorites from "./HomeFavorites";
import HomeCouponButton from "./HomeCouponButton";

export default function HomePage({ dishes }) {
  const featuredDishes = dishes.slice(0, 4);
  const heroDish = featuredDishes[0];
  const categories = ["All", ...new Set(dishes.map((dish) => dish.category))];

  return (
    <main className="home-page">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="section-kicker">Addis food, delivered</p>
          <h1>Good food. Delivered your way.</h1>
          <p className="hero-text">
            Discover Ethiopian favorites and neighborhood dishes, then follow
            your order from the restaurant to your door across Addis Ababa.
          </p>
          <div className="hero-actions">
            <form className="hero-search-form" action="/menu" method="get">
              <label className="sr-only" htmlFor="home-dish-search">Search dishes</label>
              <input id="home-dish-search" name="search" type="search" placeholder="Search dishes, like Doro Wat" />
              <button className="primary-button" type="submit">Search menu</button>
            </form>
            <Link href="/menu" className="hero-menu-link">Browse the full menu</Link>
          </div>
          <div className="hero-stats">
            <span>Delivery across Addis Ababa</span>
            <span>Live order status updates</span>
            <span>TeleBirr, CBE, or cash on delivery</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-card">
            {heroDish?.image && <Image src={heroDish.image} alt={`${heroDish.name}, Addis Eats featured dish`} width={1200} height={900} priority sizes="(max-width: 760px) 92vw, 460px" className="media-image hero-image" />}
            <div className="visual-badge">Featured dish</div>
            <div className="visual-caption">
              <strong>{heroDish?.name || "Doro Wat platter"}</strong>
              <span>{heroDish ? `${heroDish.category} · Available for delivery` : "Available for delivery"}</span>
            </div>
          </div>
        </div>
      </section>

      <nav className="chip-row" aria-label="Categories">
        {categories.map((category) => <Link key={category} href={category === "All" ? "/menu" : `/menu?category=${encodeURIComponent(category)}`} className="chip">{category === "All" ? "Full menu" : category}</Link>)}
      </nav>

      <section className="specials-section">
        <div className="section-heading-row">
            <div><p className="section-kicker">Made fresh for your table</p><h2>Explore the menu</h2></div>
          <Link href="/menu" className="link-button">Explore full menu</Link>
        </div>
        <div className="specials-grid menu-card-grid">
          {featuredDishes.map((dish) => (
            <article key={dish.id} className="card">
              <div className="dish">
                <div className="dish-visual"><Image src={dish.image} alt={`${dish.name}, ${dish.category} Ethiopian dish`} width={1200} height={900} sizes="(max-width: 760px) 92vw, (max-width: 1100px) 45vw, 300px" className="media-image" /></div>
                <div className="dish-meta"><span>{String(dish.id).padStart(2, "0")}</span><span>{dish.category}</span></div>
                <h3><Link href={`/menu/${dish.id}`} className="dish-link">{dish.name}</Link>{dish.spicy && <span className="spicy-badge">Spicy</span>}</h3>
                <p className="description">{dish.description}</p>
                <div className="dish-actions">
                  <p className="price"><span>{dish.price}</span> ETB</p>
                  <FavoriteButton dish={dish} />
                  <AddDishButton dish={dish} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <HomeFavorites />

      <section className="story-section">
        <div className="story-copy">
          <p className="section-kicker">Neighborhood hospitality</p>
          <h2>Tradition meets modern city pace.</h2>
          <p>Whether gathering your family around an aromatic Sunday feast or grabbing a rapid working lunch in the business district of Bole, Addis Eats bridges local culinary pride with point-to-point delivery precision.</p>
          <div className="mini-stats"><span>Choose a delivery area</span><span>Follow order progress online</span></div>
          <div className="impact-row"><div><strong>Local</strong><span>Addis delivery areas</span></div><div><strong>Flexible</strong><span>Choose your payment method</span></div></div>
        </div>
        <div className="story-visual"><div className="story-photo"><Image src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80" alt="Warmly lit restaurant dining room" width={1200} height={900} sizes="(max-width: 760px) 92vw, 42vw" className="media-image" /></div><div className="metric-card large">Made for Addis Ababa</div></div>
      </section>

      <section className="benefits-row">
        <article className="benefit-box"><span className="benefit-icon">Area</span><h3>Local delivery areas</h3><p>Select Bole, Kazanchis, Piazza, or CMC at checkout.</p></article>
        <article className="benefit-box"><span className="benefit-icon">Menu</span><h3>Ethiopian favorites</h3><p>Browse local dishes with clear descriptions and prices.</p></article>
        <article className="benefit-box"><span className="benefit-icon">Pay</span><h3>Flexible payment</h3><p>Choose TeleBirr, CBE, or cash on delivery at checkout.</p></article>
      </section>

      <section className="cta-banner">
        <div>
          <p className="section-kicker light">Ready to order?</p>
          <h2>Hungry? Your favorite meal is just a few taps away.</h2>
          <p>Order local favorites and follow each step from confirmation to delivery.</p>
        </div>
        <div className="cta-actions">
          <Link href="/menu" className="primary-button alt">Explore Menu Now</Link>
          <HomeCouponButton />
        </div>
      </section>

    </main>
  );
}
