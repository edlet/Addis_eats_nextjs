import { useState } from "react";
import AuthContext from "./auth-context";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser =
        localStorage.getItem("addisEatsUser");

      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const loading = false;

  function login(email) {
    const loggedInUser = { email };

    localStorage.setItem(
      "addisEatsUser",
      JSON.stringify(loggedInUser)
    );

    setUser(loggedInUser);
  }

  function logout() {
    localStorage.removeItem("addisEatsUser");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
