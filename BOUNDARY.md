# Component boundaries

| Component / module | Runs on | Responsibility |
| --- | --- | --- |
| `app/layout.js` | Server | Owns the document, metadata, styles and composed providers. |
| `app/providers.jsx` | Client | Keeps the target authentication/theme providers and the Day 40 cart provider mounted. |
| `app/Day40Shell.jsx`, customer layouts | Server | Adds Day 40 header, footer and mobile navigation to the new customer pages. |
| `app/page.js`, `app/HomePage.jsx` | Server | Renders the Day 40 homepage from the shared dish seed. |
| `app/day40-providers.jsx` | Client | Owns Day 40 cart/favorites interactions, imports old saved cart/favorites once, and persists Day 40 state separately. |
| `app/menu/*` | Server and client leaves | Loads and filters dishes on the server; client leaves handle URL filters, cart actions, favorites and the persistent visit counter. |
| `app/cart/CartContents.jsx`, `app/checkout/CheckoutForm.jsx` | Client | Handles cart quantity changes and checkout submission. |
| `app/actions/*`, `app/lib/*`, `app/api/orders/route.js` | Server | Owns demo session validation, order validation, order persistence, cancellation and cache invalidation. |
| `app/api/dishes/*` | Server Route Handlers | Exposes the existing `public/dishes.json` data. |
| `app/PageRenderer.jsx`, `src/ClientApp.jsx`, `src/admin/*` | Server/Client | Keeps the target's existing React Router admin, login and receipt experiences available. |

No Day 40 server-only module is imported into a client component. The existing project cart and favorites storage keys are read only as an initial migration source; Day 40 writes to its own local-storage keys.
