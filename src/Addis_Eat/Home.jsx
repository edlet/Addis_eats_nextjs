import { useState } from "react";
import Image from "next/image";
import { Link } from "react-router-dom";
import { useFavoritesStore } from "../store/favoritesStore";
import Card from "./Card";
import Dish from "./Dish";
import { useMenuData } from "../providers";
import Modal from "../ui/Modal";
import { coupons } from "../utils/coupons";

const categories = [
  { label: "All Cuisines", target: "/menu" },
  { label: "Ethiopian Traditional", target: "/menu?category=Main" },
  { label: "Stone Oven Pizza", target: "/menu?category=Modern" },
  { label: "Craft Burgers", target: "/menu?category=Modern" },
  { label: "Habesha Coffee & Tea", target: "/menu?category=Drinks" },
  { label: "Healthy Salads", target: "/menu?category=Healthy" },
];

export default function Home() {
  const favorites = useFavoritesStore((state) => state.items);
  const { data: menuDishes, loading: menuLoading } = useMenuData();
  const featuredDishes = menuDishes.slice(0, 4);
  const heroDish = featuredDishes[0];
  const [showCoupons, setShowCoupons] = useState(false);

  return (
    <main className="home-page">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="section-kicker">Fastest delivery in Addis</p>

          <h1>Good food. Delivered your way.</h1>

          <p className="hero-text">
            From authentic Ethiopian feasts in traditional meshob platters to
            urban wood-fired pizzas and craft burgers, delivered piping hot to
            your doorstep anywhere in Addis Ababa.
          </p>

          <div className="hero-actions">
            <label className="address-box">
              <span className="location-icon">⌖</span>
              <input
                type="text"
                value="Enter your neighbourhood (e.g., Bole, Mehran)"
                readOnly
              />
            </label>

            <Link to="/menu" className="primary-button">
              Find Food
            </Link>
          </div>

          <div className="hero-stats">
            <span>⚡ Average 32 mins delivery</span>
            <span>✓ 4.9/5 (25,000+ orders)</span>
            <span>💳 TeleBirr & CBE direct</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-card">
            {heroDish?.image && <Image src={heroDish.image} alt={`${heroDish.name}, Addis Eats featured dish`} width={1200} height={900} sizes="(max-width: 760px) 92vw, 460px" className="media-image hero-image" />}
            <div className="visual-badge">★ 4.9</div>
            <div className="visual-caption">
              <strong>{heroDish?.name || "Doro Wat platter"}</strong>
              <span>{heroDish ? `${heroDish.category} · 15 min to your door` : "15 min to your door"}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="chip-row" aria-label="Categories">
        {categories.map((category) => (
          <Link
            key={category.label}
            to={category.target}
            className="chip"
          >
            {category.label}
          </Link>
        ))}
      </div>

      <section className="specials-section">
        <div className="section-heading-row">
          <div>
            <p className="section-kicker">Daily chef selection</p>
            <h2>Today&apos;s Specials</h2>
          </div>

          <Link to="/menu" className="link-button">
            Explore Full Menu →
          </Link>
        </div>

        {menuLoading ? (
          <p className="loading" aria-live="polite">Loading today&apos;s dishes...</p>
        ) : (
          <div className="specials-grid menu-card-grid">
            {featuredDishes.map((dish) => (
              <Card key={dish.id} className="dish-card">
                <Dish {...dish} />
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="home-favorites" aria-labelledby="home-favorites-title">
        <div className="section-heading-row">
          <div>
            <p className="section-kicker">Saved by you</p>
            <h2 id="home-favorites-title">Your Favorites</h2>
          </div>

          <Link to="/favorites" className="link-button">
            View all favorites →
          </Link>
        </div>

        {favorites.length === 0 ? (
          <div className="home-favorites-empty">
            <div>
              <h3>Build your favorite order list</h3>
              <p>Tap the heart on any dish and it will appear here for your next order.</p>
            </div>
            <Link to="/menu" className="primary-button">Browse the menu</Link>
          </div>
        ) : (
          <div className="home-favorites-grid">
            {favorites.slice(0, 4).map((dish) => (
              <article key={dish.id} className="home-favorite-card">
                {dish.image && (
                  <div className="home-favorite-image"><Image src={dish.image} alt={`${dish.name}, saved ${dish.category} dish`} width={1200} height={900} sizes="(max-width: 760px) 92vw, 25vw" className="media-image" /></div>
                )}
                <div className="home-favorite-body">
                  <div>
                    <p className="saved-label">Saved dish</p>
                    <h3>{dish.name}</h3>
                    <p>{dish.description}</p>
                  </div>
                  <div className="home-favorite-footer">
                    <strong>{dish.price} ETB</strong>
                    <Link to={`/menu/${dish.id}`} className="mini-add-button">
                      View dish
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="story-section">
        <div className="story-copy">
          <p className="section-kicker">A neighborhood hospitality</p>
          <h2>Tradition meets modern city pace.</h2>

          <p>
            Whether gathering your family around an aromatic Sunday feast or
            grabbing a rapid working lunch in the business district of Bole,
            Addis Eats bridges local culinary pride with point-to-point delivery
            precision.
          </p>

          <div className="mini-stats">
            <span>🍽️ 1,000+ chef-prepared orders</span>
            <span>📍 24/7 delivery coverage</span>
          </div>

          <div className="impact-row">
            <div>
              <strong>Over 25,000+</strong>
              <span>happy customers</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>authentic ingredients</span>
            </div>
          </div>
        </div>

        <div className="story-visual">
          <div className="story-photo" />
          <div className="metric-card large">140+ Partner Restaurants</div>
        </div>
      </section>

      <section className="benefits-row">
        <div className="benefit-box">
          <span className="benefit-icon">⏱️</span>
          <h3>Fast Local Couriers</h3>
          <p>Dedicated riders stationed across Bole, Kazanchis, Piazza, and more.</p>
        </div>

        <div className="benefit-box">
          <span className="benefit-icon">🥬</span>
          <h3>Highland Freshness</h3>
          <p>Ingredients fresh from highland farms and delivered with care daily.</p>
        </div>

        <div className="benefit-box">
          <span className="benefit-icon">💳</span>
          <h3>Seamless Mobile Pay</h3>
          <p>Zero-contact delivery with TeleBirr, CBE, and cash on arrival.</p>
        </div>
      </section>

      <section className="cta-banner">
        <div>
          <p className="section-kicker light">Addis Ababa&apos;s top choice</p>
          <h2>Hungry? Your favorite meal is just a few taps away.</h2>
          <p>
            Order fresh sizzling tabs, layered bayenetu platters, crispy burgers,
            or steaming wood-fired pizza delivered in under 35 minutes.
          </p>
        </div>

        <div className="cta-actions">
          <Link to="/menu" className="primary-button alt">
            Explore Menu Now
          </Link>
          <button type="button" className="coupon-button" onClick={() => setShowCoupons(true)}>
            % View Coupons
          </button>
        </div>
      </section>

      {showCoupons && (
        <Modal title="Available coupons" onClose={() => setShowCoupons(false)}>
          <div className="coupon-list">
            {coupons.map((coupon) => (
              <article key={coupon.code} className="coupon-card">
                <strong>{coupon.code}</strong>
                <p>{coupon.description}</p>
                <Link to={`/checkout?coupon=${coupon.code}`} onClick={() => setShowCoupons(false)}>
                  Use this coupon
                </Link>
              </article>
            ))}
          </div>
        </Modal>
      )}

      <footer className="site-footer">
        <div className="footer-brand">
          <div className="brand-mark">✦</div>
          <div>
            <h3>Addis Eats</h3>
            <p>Good food, delivered your way across Addis Ababa.</p>
          </div>
        </div>

        <div className="footer-column">
          <h4>Popular Cuisines</h4>
          <ul>
            <li>Authentic Ethiopian</li>
            <li>Pizza</li>
            <li>Grills and Burgers</li>
            <li>Salads</li>
            <li>Tea & Coffee</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Service Areas</h4>
          <ul>
            <li>Bole & Atlas</li>
            <li>Kazanchis</li>
            <li>Piazza</li>
            <li>Old Airport</li>
            <li>CMC & Summit</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Customer Support</h4>
          <ul>
            <li>Help Center</li>
            <li>Call 0936655404</li>
            <li>Email edlawitmesfin55@gmail.com</li>
            <li><Link to="/admin/login" className="admin-portal-link">Admin portal</Link></li>
            <li>TeleBirr & CBE</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
      </footer>
    </main>
  );
}
