import { useEffect, useState } from "react";
import ThemeContext from "./theme-context";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() =>
    typeof window === "undefined" ? "light" : localStorage.getItem("addisEatsTheme") || "light"
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("addisEatsTheme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === "light" ? "dark" : "light"
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
