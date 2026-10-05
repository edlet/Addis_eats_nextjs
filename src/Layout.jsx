import {
  NavLink,
  Outlet,
} from "react-router-dom";

import Header from "./Addis_Eat/Header";
import { useAuth } from "./auth/useAuth";
import { useTheme } from "./theme/useTheme";

export default function Layout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <Header />

      <nav className="main-navigation" aria-label="Main navigation">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/menu"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Menu
        </NavLink>

        <NavLink
          to="/favorites"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Favorites
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Orders
        </NavLink>

        <div className="nav-spacer" />

        {user ? (
          <button
            type="button"
            onClick={logout}
            className="nav-button"
          >
            Sign Out
          </button>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Sign In
          </NavLink>
        )}

        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="nav-button theme-toggle"
        >
          {theme === "light" ? "Dark" : "Light"}
        </button>
      </nav>

      <div className="app-layout">
        <Outlet />
      </div>
    </>
  );
}