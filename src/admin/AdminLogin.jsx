import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  loginAdmin,
} from "./adminAuth";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!loginAdmin(username, password)) {
      setError("Invalid admin username or password.");
      return;
    }

    navigate(location.state?.from || "/admin", { replace: true });
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <p className="section-kicker">Addis Eats operations</p>
        <h1>Admin sign in</h1>
        <p>Manage dishes, orders, and delivery operations.</p>

        <form className="admin-form" onSubmit={handleSubmit}>
          <label htmlFor="admin-username">Username</label>
          <input
            id="admin-username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
          />

          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />

          {error && <p className="error-message" role="alert">{error}</p>}

          <button type="submit">Sign in to admin</button>
        </form>

        <p className="admin-demo-note">
          Demo access: {ADMIN_USERNAME} / {ADMIN_PASSWORD}
        </p>
      </section>
    </main>
  );
}
