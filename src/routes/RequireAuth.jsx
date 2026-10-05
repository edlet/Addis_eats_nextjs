import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <main className="state-screen">
        <h1>Addis Eats</h1>
        <p className="loading">Checking your account...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
}