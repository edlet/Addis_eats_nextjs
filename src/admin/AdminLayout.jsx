import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { logoutAdmin } from "./adminAuth";

export default function AdminLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    logoutAdmin();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <Link to="/" className="admin-eyebrow admin-customer-link">View customer site</Link>
          <p className="admin-eyebrow">Addis Eats</p>
          <h1>Operations</h1>
          <p>Restaurant control center</p>
        </div>

        <nav aria-label="Admin navigation" className="admin-nav">
          <NavLink to="/admin" end>Dashboard</NavLink>
          <NavLink to="/admin/menu">Menu management</NavLink>
          <NavLink to="/admin/orders">Order management</NavLink>
        </nav>

        <button type="button" className="admin-logout" onClick={handleLogout}>
          Sign out
        </button>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
