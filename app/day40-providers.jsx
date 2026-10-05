"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const CART_KEY = "addis-eats-day40-cart";
const FAVORITES_KEY = "addis-eats-day40-favorites";

function readLegacyItems(key) {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || "null");
    return Array.isArray(parsed?.state?.items) ? parsed.state.items : [];
  } catch {
    return [];
  }
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart must be used inside Providers");
  return cart;
}

export default function CartProviders({ children }) {
  const [items, setItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [hasLoadedStoredCart, setHasLoadedStoredCart] = useState(false);

  useEffect(() => {
    try {
      const savedCart = window.localStorage.getItem(CART_KEY);
      const savedFavorites = window.localStorage.getItem(FAVORITES_KEY);
      setItems(savedCart ? JSON.parse(savedCart) : readLegacyItems("addis-eats-cart"));
      setFavorites(savedFavorites ? JSON.parse(savedFavorites) : readLegacyItems("addis-eats-favorites"));
    } catch {
      setItems([]);
      setFavorites([]);
    } finally {
      setHasLoadedStoredCart(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedStoredCart) return;
    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    const cookieItems = items.map(({ id, quantity }) => ({ id, quantity }));
    document.cookie = `addis-eats-cart=${encodeURIComponent(JSON.stringify(cookieItems))}; Path=/; Max-Age=604800; SameSite=Lax`;
  }, [hasLoadedStoredCart, items, favorites]);

  const toggleFavorite = useCallback((dish) => {
    setFavorites((current) => current.some((item) => item.id === dish.id)
      ? current.filter((item) => item.id !== dish.id)
      : [...current, dish]);
  }, []);

  const addItem = useCallback((dish) => {
    setItems((current) => {
      const found = current.find((item) => item.id === dish.id);
      return found
        ? current.map((item) => item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { ...dish, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    setItems((current) => quantity < 1
      ? current.filter((item) => item.id !== id)
      : current.map((item) => item.id === id ? { ...item, quantity } : item));
  }, []);
  const removeItem = useCallback((id) => setItems((current) => current.filter((item) => item.id !== id)), []);
  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(() => ({ items, favorites, toggleFavorite, addItem, updateQuantity, removeItem, clearCart }), [
    items, favorites, toggleFavorite, addItem, updateQuantity, removeItem, clearCart,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
