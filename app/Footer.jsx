import Link from "next/link";
import { DELIVERY_AREAS } from "./lib/delivery-area";
import { dishes } from "./menu/dishes";

const categories = [...new Set(dishes.map((dish) => dish.category))];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <div className="brand-mark" aria-hidden="true">✦</div>
        <div><h3>Addis Eats</h3><p>Good food, delivered your way across Addis Ababa.</p></div>
      </div>
      <div className="footer-column">
        <h4>Browse categories</h4>
        <ul>{categories.map((category) => <li key={category}><Link href={`/menu?category=${encodeURIComponent(category)}`}>{category}</Link></li>)}</ul>
      </div>
      <div className="footer-column">
        <h4>Service Areas</h4>
        <ul>{DELIVERY_AREAS.map((area) => <li key={area}>{area}</li>)}</ul>
        <p>Serving Addis Ababa, Ethiopia</p>
      </div>
      <div className="footer-column">
        <h4>Contact &amp; account</h4>
        <ul><li><a href="tel:0936655404">Call 0936655404</a></li><li><a href="mailto:edlawitmesfin55@gmail.com">Email customer support</a></li><li><Link href="/favorites">Your favorites</Link></li><li><Link href="/orders">Order history</Link></li></ul>
      </div>
    </footer>
  );
}
