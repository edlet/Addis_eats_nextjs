"use server";

import { createHmac, randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession, hasValidStaffCode, safeNext, SESSION_COOKIE } from "../lib/session";

export async function signInCustomer(formData) {
  const name = String(formData.get("name") || "").trim().slice(0, 60);
  const email = String(formData.get("email") || "").trim().toLowerCase().slice(0, 254);
  const phone = String(formData.get("phone") || "").trim().slice(0, 30);
  const next = safeNext(formData.get("next"));
  const nextQuery = `&next=${encodeURIComponent(next)}`;
  if (!name || !email || !phone) redirect(`/sign-in?error=missing-customer-details${nextQuery}`);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^[+()\d.\s-]{7,30}$/.test(phone)) {
    redirect(`/sign-in?error=invalid-customer-details${nextQuery}`);
  }

  const secret = process.env.SESSION_SECRET;
  if (!secret) redirect(`/sign-in?auth=not-configured${nextQuery}`);

  const cookieStore = await cookies();
  const options = sessionCookieOptions();
  const userId = randomUUID();

  const payload = Buffer.from(JSON.stringify({ userId, name, role: "customer", expiresAt: Date.now() + options.maxAge * 1000 })).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  cookieStore.set(SESSION_COOKIE, `${payload}.${signature}`, options);
  cookieStore.delete("addis-eats-user");
  cookieStore.delete("addis-eats-name");
  redirect(next);
}

export async function signInStaff(formData) {
  const staffCode = String(formData.get("staffCode") || "");
  const next = safeNext(formData.get("next"), "/staff/orders");
  const nextQuery = `&next=${encodeURIComponent(next)}`;
  const secret = process.env.SESSION_SECRET;
  if (!secret) redirect(`/staff/sign-in?auth=not-configured${nextQuery}`);
  if (!hasValidStaffCode(staffCode)) redirect(`/staff/sign-in?error=invalid-staff-code${nextQuery}`);

  const cookieStore = await cookies();
  const options = sessionCookieOptions();
  const userId = randomUUID();
  const payload = Buffer.from(JSON.stringify({ userId, name: "Staff", role: "staff", expiresAt: Date.now() + options.maxAge * 1000 })).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  cookieStore.set(SESSION_COOKIE, `${payload}.${signature}`, options);
  cookieStore.delete("addis-eats-user");
  cookieStore.delete("addis-eats-name");
  redirect(next);
}

function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export async function signOut() {
  const session = await getSession();
  if (!session) redirect("/sign-in");
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  cookieStore.delete("addis-eats-user");
  cookieStore.delete("addis-eats-name");
  redirect("/");
}
