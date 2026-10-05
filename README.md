# Addis Eats Next.js Capstone

This project keeps its original React Router customer/admin app and adds the Day 40 App Router customer experience. Day 40 menu routes, cart, favorites, checkout, guest sign-in and order history are integrated while the target admin screens remain available.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Day 40 home page |
| `/menu`, `/menu/[id]` | Filterable menu and generated dish detail pages |
| `/cart`, `/favorites` | Day 40 client-persisted collections |
| `/checkout`, `/orders`, `/sign-in` | Validated order flow and guest session |
| `/api/dishes`, `/api/dishes/[id]`, `/api/orders` | Dish lookup and order API |
| `/orders/[id]` | Server-rendered order status with five-second client polling |
| `/login`, `/receipt`, `/admin/*` | Preserved target account, receipt and admin experience |

The Day 40 provider seeds its cart and favorites from the existing Zustand storage once, then persists separately to avoid corrupting the target's state format. Both experiences use the same `public/dishes.json` seed.

See [STRATEGY.md](./STRATEGY.md) for rendering choices and [BOUNDARY.md](./BOUNDARY.md) for server/client boundaries.

See [DATA.md](./DATA.md) for query keys, fallback data, and refresh rules. While typing in menu search, the Network tab stays quiet until 350 ms after the last keystroke, then shows one `/api/dishes?q=...` request for the settled term; rapid typing of five characters produces one request, and the previous dish cards remain visible during it.

## Run

```bash
npm install
# Copy .env.example to .env.local and replace both placeholder secrets.
npm run dev
```

For staff access, set the server-only `STAFF_ACCESS_CODE` in `.env.local`. Sign in with that code to mint a signed staff session. `/admin/*`, checkout, and order history are protected by the Day 42 server checks; see [AUTH.md](./AUTH.md) for the route map and three attack results.

## Day 43: production performance

Copy `.env.example` to `.env.local`, set a unique `SESSION_SECRET` and your `STAFF_ACCESS_CODE`, then measure the production build:

```bash
npm install
npm run build
npm run start
```

Run Lighthouse against the served production site with mobile throttling. The before-and-after results, measurement method, and observed tradeoffs are in [PERF.md](./PERF.md). Do not use `npm run dev` for those measurements.

The home page's hero food photo is the only `priority` image; all other images load normally with responsive `sizes` and reserved dimensions. The current app has no third-party JavaScript, so there are no script requests in the Network tab to defer. If optional analytics is added later, use `next/script` with `strategy="lazyOnload"`.

`.env.example` lists the server-only variables needed for a clone. The actual `.env.local` stays out of Git, and no secret uses the `NEXT_PUBLIC_` prefix.
