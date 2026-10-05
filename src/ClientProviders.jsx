"use client";

import { AuthProvider } from "./auth/AuthContext";
import { ThemeProvider } from "./theme/ThemeContext";

export default function ClientProviders({ children }) {
  return <AuthProvider><ThemeProvider>{children}</ThemeProvider></AuthProvider>;
}
