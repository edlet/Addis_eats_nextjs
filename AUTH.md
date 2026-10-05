# Addis Eats authentication and authorization

## Session design

The only identity cookie is `addis-eats-session`. It is signed with `SESSION_SECRET`, has a seven-day expiry, and is set with `httpOnly: true`, `secure: true`, `sameSite: "lax"`, and `path: "/"`. The signing secret is read only by server modules and is never prefixed with `NEXT_PUBLIC_`. Legacy demo identity cookies are not trusted.

`app/lib/session.js` is the shared session boundary: `getSession()` verifies the HMAC, expiry, user id, and role; `requireSession()` redirects guests; `requireStaff()` allows only a signed staff role. The browser-side cookie presence check in `proxy.js` is only a fast redirect hint. Pages, actions, and route handlers perform the signed check themselves.

Set `SESSION_SECRET` to a long random value. Set `STAFF_ACCESS_CODE` to a separate secret if staff access is needed. Both are server environment variables. Sign-in with a valid staff access code mints a signed staff role; a wrong non-empty code is rejected. Without that server variable, sign-in can create only customer sessions.

## Protected routes and layers

| Route | Layers | What each layer proves |
| --- | --- | --- |
| `/checkout` | Proxy matcher; page calls `requireSession`; `placeOrder` action calls `getSession` before validation or writes | The proxy redirects requests with no session cookie; the page verifies the signed session while rendering; the action independently verifies the caller and uses that session id as the new order owner. |
| `/orders` | Proxy matcher; page calls `requireSession`; cached query receives only `session.userId` | The page rejects invalid/expired sessions and scopes history to the verified user id. |
| `/orders/[id]` | Proxy matcher; page calls `requireSession`; `getOwnedOrder(id, session.userId)`; `/api/orders/[id]` repeats the same ownership check | A URL id selects only a candidate record; it never grants access. The page and polling handler return only an order owned by the signed-in user. |
| `/admin/*` | Proxy matcher; server `app/admin/layout.js` calls `requireStaff` | The signed session role must be `staff`; a customer is refused server-side even if the Staff link is manually entered or revealed. |
| `POST /api/orders` | Route handler calls `getSession`, validates the body, then writes with `session.userId` | The request cannot choose the owner id; an absent session gets 401 and each created order is owned by the verified session. |
| `cancelOrder` server action | Action calls `getSession`; `cancelOwnedOrder(orderId, session.userId)` checks ownership at the write boundary | A caller must have a valid session and own the selected order before its status can change. |
| `signOut` server action | Action calls `getSession` before expiring the session cookie | A signed-out caller cannot use the action as a write path; the authenticated caller's HttpOnly session is expired. |

The proxy matcher is limited to `/checkout`, `/orders`, and `/admin`; it does not run on `/_next/image`, static assets, APIs, or public routes. The API routes and actions do not depend on the proxy matcher for security.

## Three attack attempts

1. **Invoke `cancelOrder` from DevTools while signed out.** I submitted the captured Server Action fields without the session cookie. It returned a 307 to `/sign-in?next=%2Forders` at `proxy.js`; the action also begins with its own `getSession()` check in `app/actions/orders.js` (`cancelOrder`) before touching the order store.
2. **Sign in as customer A, then submit customer B's order id to `cancelOrder`.** `cancelOwnedOrder` searches for both the submitted id and `session.userId`; it returns `null` for B's order, so the action reports “Order not found or you do not own it” and performs no write. The ownership condition is in `app/lib/orders.js` (`cancelOwnedOrder`). Reading or polling another customer's id similarly returns not found in the detail page and `GET /api/orders/[id]`.
3. **Open `/sign-in?next=https://evil.example` and submit the form.** `safeNext()` rejects the absolute URL and substitutes `/`; the form preserves only that validated local destination, and `signInDemo` validates it again before redirecting. The check is in `app/lib/session.js` (`safeNext`), used both when the page receives `next` and inside `app/actions/auth.js` (`signInDemo`).

The attacks were run against the local Day 42 app with two signed customer sessions. The signed-out Server Action returned a 307 to `/sign-in?next=%2Forders`; the cross-customer cancel action returned the ownership error and left the second customer's order in `Received`; the external destination sign-in returned a 303 to `/`. A customer visiting `/admin` received a server redirect to `/`, while a signed staff session reached the route. The sign-in response's `Set-Cookie` included `Secure; HttpOnly; SameSite=lax`.
