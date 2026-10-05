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
const allOrdersKey = "addis-eats:orders";

export const ORDER_STATUS_TRANSITIONS = {
  Received: ["Confirmed", "Cancelled"],
  Confirmed: ["Preparing", "Cancelled"],
  Preparing: ["Ready for pickup", "Cancelled"],
  "Ready for pickup": ["Out for delivery", "Cancelled"],
  "Out for delivery": ["Delivered"],
  Delivered: [],
  Cancelled: [],
};

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
      "redis.call('SET', KEYS[1], ARGV[1]); redis.call('SADD', KEYS[2], ARGV[2]); redis.call('SADD', KEYS[3], ARGV[2]); return 1",
      3,
      orderKey(record.id),
      ownerOrdersKey(ownerId),
      allOrdersKey,
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

export async function getAllOrders() {
  if (isRedisConfigured()) {
    const ids = await redisCommand(["SMEMBERS", allOrdersKey]);
    if (!ids?.length) return [];
    const records = await redisCommand(["MGET", ...ids.map(orderKey)]);
    return records.map(parseOrder).filter(Boolean).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  return readOrders().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
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
    return transitionRedisOrder(id, "Cancelled", ownerId, true);
  }
  const orders = readOrders();
  const order = orders.find((candidate) => candidate.id === id);
  if (!order || order.ownerId !== ownerId || order.status !== "Received") return null;
  order.status = "Cancelled";
  writeOrders(orders);
  return order;
}

export async function updateOrderStatus(id, status) {
  if (!Object.hasOwn(ORDER_STATUS_TRANSITIONS, status)) return null;
  if (isRedisConfigured()) return transitionRedisOrder(id, status, "", false);

  const orders = readOrders();
  const order = orders.find((candidate) => candidate.id === id);
  if (!order || !ORDER_STATUS_TRANSITIONS[order.status]?.includes(status)) return null;
  order.status = status;
  writeOrders(orders);
  return order;
}

async function transitionRedisOrder(id, status, ownerId, onlyReceived) {
  const script = `
    local value = redis.call('GET', KEYS[1])
    if not value then return false end
    local order = cjson.decode(value)
    if ARGV[1] ~= '' and order.ownerId ~= ARGV[1] then return false end
    if ARGV[2] == 'received' and order.status ~= 'Received' then return false end
    local transitions = {
      Received = { Confirmed = true, Cancelled = true },
      Confirmed = { Preparing = true, Cancelled = true },
      Preparing = { ['Ready for pickup'] = true, Cancelled = true },
      ['Ready for pickup'] = { ['Out for delivery'] = true, Cancelled = true },
      ['Out for delivery'] = { Delivered = true },
    }
    if not transitions[order.status] or not transitions[order.status][ARGV[3]] then return false end
    order.status = ARGV[3]
    local updated = cjson.encode(order)
    redis.call('SET', KEYS[1], updated)
    return updated
  `;
  const result = await redisCommand([
    "EVAL",
    script,
    1,
    orderKey(id),
    ownerId,
    onlyReceived ? "received" : "any",
    status,
  ]);
  return parseOrder(result);
}
