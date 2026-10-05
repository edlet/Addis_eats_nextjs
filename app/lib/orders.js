import { dishes } from "../menu/dishes";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const storePath = path.join(process.cwd(), ".next", "cache", "addis-eats-orders.json");

function readOrders() {
  try {
    const records = JSON.parse(readFileSync(storePath, "utf8"));
    return Array.isArray(records) ? records : [];
  } catch {
    return [];
  }
}

function writeOrders(orders) {
  mkdirSync(path.dirname(storePath), { recursive: true });
  writeFileSync(storePath, JSON.stringify(orders), "utf8");
}

export function createOrder(order, ownerId) {
  const items = order.items.map(({ id, quantity }) => {
    const dish = dishes.find((candidate) => candidate.id === id);
    return dish ? { id: dish.id, name: dish.name, price: dish.price, quantity } : null;
  });
  if (items.some((item) => item === null)) return null;
  const record = { id: crypto.randomUUID(), ownerId, ...order, items, status: "Received", createdAt: new Date().toISOString() };
  const orders = readOrders();
  orders.unshift(record);
  writeOrders(orders);
  return record;
}

export function getOrdersFor(ownerId) { return readOrders().filter((order) => order.ownerId === ownerId); }
export function getOwnedOrder(id, ownerId) {
  const order = readOrders().find((candidate) => candidate.id === id && candidate.ownerId === ownerId);
  return order || null;
}
export function cancelOwnedOrder(id, ownerId) {
  const orders = readOrders();
  const order = orders.find((candidate) => candidate.id === id);
  if (!order || order.ownerId !== ownerId) return null;
  order.status = "Cancelled";
  writeOrders(orders);
  return order;
}
