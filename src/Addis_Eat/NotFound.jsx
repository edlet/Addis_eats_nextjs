import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="state-screen">
      <h1>404</h1>

      <h2>Page not found</h2>

      <p>
        Sorry, the page you are looking for
        doesn't exist.
      </p>

      <Link to="/">
        Back Home
      </Link>
    </main>
  );
}