import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <div className="brand-mark" aria-hidden="true">✦</div>
        <div><h3>Addis Eats</h3><p>Good food, delivered your way across Addis Ababa.</p></div>
      </div>
      <div className="footer-column">
        <h4>Popular Cuisines</h4>
        <ul><li>Authentic Ethiopian</li><li>Pizza</li><li>Grills and Burgers</li><li>Salads</li><li>Tea &amp; Coffee</li></ul>
      </div>
      <div className="footer-column">
        <h4>Service Areas</h4>
        <ul><li>Bole &amp; Atlas</li><li>Kazanchis</li><li>Piazza</li><li>Old Airport</li><li>CMC &amp; Summit</li></ul>
        <p>Serving Addis Ababa, Ethiopia</p>
      </div>
      <div className="footer-column">
        <h4>Customer Support</h4>
        <ul><li>Help Center</li><li>Call 0936655404</li><li>Email edlawitmesfin55@gmail.com</li><li><Link href="/favorites">Your Favorites</Link></li><li><Link href="/orders">Order history</Link></li><li>TeleBirr &amp; CBE</li></ul>
      </div>
    </footer>
  );
}
