"use client";

import ClientProviders from "@/src/ClientProviders";
import CartProviders from "./day40-providers";

export { useCart } from "./day40-providers";

export default function Providers({ children }) {
  return <ClientProviders><CartProviders>{children}</CartProviders></ClientProviders>;
}
