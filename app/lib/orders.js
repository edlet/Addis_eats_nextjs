import { dishes } from "../menu/dishes";
import { randomUUID } from "node:crypto";
import "server-only";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const storePath = path.join(process.cwd(), ".next", "cache", "addis-eats-orders.json");
const redisUrl = process.env.UPSTASH_REDIS_REST_KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
const orderKey = (id) => `addis-eats:order:${id}`;
const ownerOrdersKey = (ownerId) => `addis-eats:customer-orders:${ownerId}`;

function isRedisConfigured() {
  if (redisUrl && redisToken) return true;
  if (redisUrl || redisToken || process.env.VERCEL) {
    throw new Error("Configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN for order storage.");
  }
  return false;
}

async function redisCommand(command) {
  const response = await fetch(redisUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${redisToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  const result = await response.json();
  if (!response.ok || result.error) throw new Error(result.error || "Redis request failed.");
  return result.result;
}

function parseOrder(value) {
  if (typeof value !== "string") return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

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

export async function createOrder(order, ownerId) {
  const items = order.items.map(({ id, quantity }) => {
    const dish = dishes.find((candidate) => candidate.id === id);
    return dish ? { id: dish.id, name: dish.name, price: dish.price, quantity } : null;
  });
  if (items.some((item) => item === null)) return null;
  const record = { id: randomUUID(), ownerId, ...order, items, status: "Received", createdAt: new Date().toISOString() };

  if (isRedisConfigured()) {
    await redisCommand([
      "EVAL",
      "redis.call('SET', KEYS[1], ARGV[1]); redis.call('SADD', KEYS[2], ARGV[2]); return 1",
      2,
      orderKey(record.id),
      ownerOrdersKey(ownerId),
      JSON.stringify(record),
      record.id,
    ]);
    return record;
  }

  const orders = readOrders();
  orders.unshift(record);
  writeOrders(orders);
  return record;
}

export async function getOrdersFor(ownerId) {
  if (isRedisConfigured()) {
    const ids = await redisCommand(["SMEMBERS", ownerOrdersKey(ownerId)]);
    if (!ids?.length) return [];
    const records = await redisCommand(["MGET", ...ids.map(orderKey)]);
    return records.map(parseOrder).filter(Boolean).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  return readOrders().filter((order) => order.ownerId === ownerId);
}

export async function getOwnedOrder(id, ownerId) {
  if (isRedisConfigured()) {
    const order = parseOrder(await redisCommand(["GET", orderKey(id)]));
    return order?.ownerId === ownerId ? order : null;
  }
  const order = readOrders().find((candidate) => candidate.id === id && candidate.ownerId === ownerId);
  return order || null;
}

export async function cancelOwnedOrder(id, ownerId) {
  if (isRedisConfigured()) {
    const order = await getOwnedOrder(id, ownerId);
    if (!order) return null;
    order.status = "Cancelled";
    await redisCommand(["SET", orderKey(id), JSON.stringify(order)]);
    return order;
  }
  const orders = readOrders();
  const order = orders.find((candidate) => candidate.id === id);
  if (!order || order.ownerId !== ownerId) return null;
  order.status = "Cancelled";
  writeOrders(orders);
  return order;
}
