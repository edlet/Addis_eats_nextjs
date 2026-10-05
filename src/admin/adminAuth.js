const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin";
const ADMIN_SESSION_KEY = "addis-eats-admin-session";

export function loginAdmin(username, password) {
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return false;
  }

  sessionStorage.setItem(
    ADMIN_SESSION_KEY,
    JSON.stringify({ username, signedInAt: new Date().toISOString() })
  );

  return true;
}

export function isAdminAuthenticated() {
  return Boolean(sessionStorage.getItem(ADMIN_SESSION_KEY));
}

export function logoutAdmin() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

export { ADMIN_USERNAME, ADMIN_PASSWORD };
