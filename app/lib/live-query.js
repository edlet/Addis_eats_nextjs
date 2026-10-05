"use client";

import { useDeferredValue, useEffect, useSyncExternalStore } from "react";
import { fetcher } from "./fetcher";

// A tiny URL-keyed query cache: concurrent subscribers share one in-flight request.
const cache = new Map();
function entryFor(key) {
  if (!cache.has(key)) cache.set(key, { data: undefined, error: undefined, updatedAt: 0, promise: null, listeners: new Set(), snapshot: { data: undefined, error: undefined, updatedAt: 0, loading: false } });
  return cache.get(key);
}
function publish(entry) {
  entry.snapshot = { data: entry.data, error: entry.error, updatedAt: entry.updatedAt, loading: Boolean(entry.promise) };
  entry.listeners.forEach((listener) => listener());
}
function load(key) {
  const entry = entryFor(key);
  if (entry.promise) return entry.promise;
  entry.error = undefined;
  entry.promise = fetcher(key).then((data) => {
    entry.data = data; entry.error = undefined; entry.updatedAt = Date.now();
  }).catch((error) => { entry.error = error; }).finally(() => {
    entry.promise = null; publish(entry);
  });
  publish(entry);
  return entry.promise;
}

export function useLiveQuery(key, { fallbackData, refreshInterval = 0, staleTime = 0, keepPreviousData = false } = {}) {
  const entry = key ? entryFor(key) : null;
  const snapshot = useSyncExternalStore(
    (listener) => { if (!entry) return () => {}; entry.listeners.add(listener); return () => entry.listeners.delete(listener); },
    () => entry?.snapshot,
    () => undefined
  );
  useEffect(() => {
    if (!key) return;
    if (Date.now() - entry.updatedAt >= staleTime) void load(key);
    if (!refreshInterval) return;
    const timer = setInterval(() => void load(key), refreshInterval);
    return () => clearInterval(timer);
  }, [key, entry, refreshInterval, staleTime]);

  const currentData = snapshot?.data ?? fallbackData;
  const deferredData = useDeferredValue(currentData);
  const data = keepPreviousData ? deferredData : currentData;
  return {
    data,
    error: snapshot?.error,
    isLoading: Boolean(key && data === undefined && snapshot?.loading),
    isValidating: Boolean(snapshot?.loading),
    mutate: () => key ? load(key) : Promise.resolve(),
  };
}
