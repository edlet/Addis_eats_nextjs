# Rendering strategy

| Route | Strategy | Reason |
| --- | --- | --- |
| `/` | Static | The homepage uses the shared public dish seed and client leaves for cart/favorite actions. |
| `/menu` | Dynamic | Search and category filters are read from `searchParams`. |
| `/menu/[id]` | Generated static paths | Dish slugs are generated from `public/dishes.json`; unknown slugs use `notFound()`. |
| `/cart`, `/favorites` | Static shell with client state | Day 40 cart and favorites are stored in the browser. |
| `/checkout` | Dynamic | The route reads request headers and the cart cookie. |
| `/orders` | Dynamic/cached data | The route reads the current session and fetches that user's cached order history. |
| `/api/dishes`, `/api/dishes/[id]` | Route Handlers | They expose the existing public dish dataset, with a JSON 404 for unknown IDs. |
| `/api/orders` | Route Handler | It authenticates, validates and records submitted orders. |
| `/sign-in` | Dynamic | The page reads the session cookie and offers the Day 40 guest session flow. |
| `/admin/*`, `/login`, `/receipt` | Static shell with client app | These paths keep the target's existing React Router admin/account experience. |

Day 40 customer pages use server components for the homepage, menu data and dish details. Interactive cart, favorite, filter, checkout and cancellation behavior is isolated in client components. `app/Day40Shell.jsx` applies Day 40 navigation only to those customer pages, leaving the existing admin screens in their original shell.
