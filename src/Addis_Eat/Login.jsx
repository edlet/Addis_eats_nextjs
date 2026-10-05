import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from;
  const destination = `${from?.pathname || "/"}${from?.search || ""}${from?.hash || ""}`;

  function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    login(email.trim());

    navigate(destination, { replace: true });
  }

  return (
    <main className="state-screen">
      <h1>Sign in to Addis Eats</h1>

      <p>
        Please sign in before continuing to checkout.
      </p>

      <form
        onSubmit={handleSubmit}
        className="order-form"
      >
        <label htmlFor="email">
          Email
        </label>

        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          required
        />

        <button type="submit">
          Sign In
        </button>
      </form>
    </main>
  );
}
