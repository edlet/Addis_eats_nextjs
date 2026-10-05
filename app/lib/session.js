import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import "server-only";
import { redirect } from "next/navigation";

export const SESSION_COOKIE = "addis-eats-session";

export function safeNext(value, fallback = "/") {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return fallback;
  try {
    const url = new URL(value, "https://addis-eats.invalid");
    if (url.origin !== "https://addis-eats.invalid") return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

export function hasValidStaffCode(candidate) {
  const expected = process.env.STAFF_ACCESS_CODE;
  if (!expected || typeof candidate !== "string") return false;
  const actualBytes = Buffer.from(candidate);
  const expectedBytes = Buffer.from(expected);
  return actualBytes.length === expectedBytes.length && timingSafeEqual(actualBytes, expectedBytes);
}

function verifySignedSession(token, secret) {
  const [payload, signature, ...extra] = String(token).split(".");
  if (!payload || !signature || extra.length) return null;
  const expected = createHmac("sha256", secret).update(payload).digest();
  const provided = Buffer.from(signature, "base64url");
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof session.userId !== "string" || !session.userId) return null;
    if (!Number.isFinite(session.expiresAt) || session.expiresAt <= Date.now()) return null;
    if (session.role !== "customer" && session.role !== "staff") return null;
    return {
      userId: session.userId,
      name: typeof session.name === "string" ? session.name : null,
      role: session.role,
    };
  } catch {
    return null;
  }
}

// Customer and staff identities use the same signed, HttpOnly session cookie.
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const secret = process.env.SESSION_SECRET;
  return token && secret ? verifySignedSession(token, secret) : null;
}

export async function requireSession(nextPath = "/") {
  const session = await getSession();
  if (!session) redirect(`/sign-in?next=${encodeURIComponent(safeNext(nextPath))}`);
  return session;
}

export async function requireStaff(nextPath = "/admin") {
  const session = await requireSession(nextPath);
  if (session.role !== "staff") redirect("/");
  return session;
}
