import { NextResponse } from "next/server";

// This is only an optimistic gate; every destination revalidates the signed session server-side.
export function proxy(request) {
  if (request.cookies.has("addis-eats-session")) return NextResponse.next();
  const destination = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  const signIn = new URL("/sign-in", request.url);
  signIn.searchParams.set("next", destination);
  return NextResponse.redirect(signIn);
}

export const config = {
  matcher: ["/checkout/:path*", "/orders/:path*", "/admin/:path*"],
};
