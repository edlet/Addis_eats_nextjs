# Live data query map

All browser data requests use `app/lib/fetcher.js`; it rejects non-2xx responses before parsing JSON. `app/lib/live-query.js` owns a URL-keyed in-memory cache, shares each in-flight request between subscribers, and supports server fallback data and previous-result retention.

| Feature | Query key | Refresh rule | Reasoning |
| --- | --- | --- | --- |
| Debounced menu search and active filtered page | `GET /api/dishes?q={term}&category={category}&page={page}`; the key is `null` while the trimmed search term is empty | Debounce input by 350 ms; `staleTime: 30_000`; no interval; `keepPreviousData: true`; server `fallbackData` | A short pause batches fast typing into one request, results remain useful for 30 seconds, and retaining the last page avoids an empty flash while a new term loads. |
| Empty-search menu and page links | `null` for the client search query; `/menu?page={page}` (plus optional `category` and `search`) is the shareable page URL | Server renders the selected page on navigation and passes it as `fallbackData`; client search stays disabled for an empty term | The URL carries the page for bookmarks and sharing, and server rendering supplies the selected page immediately without a client loading state. |
| Order status | `GET /api/orders/{orderId}` | `refreshInterval: 5_000`; `staleTime: 0`; server `fallbackData` | The server snapshot is visible on first paint, while five-second polling keeps a changing order status reasonably current. |

Requests with the same URL key share a single in-flight fetch and cached result, so components subscribing to an identical key do not each issue a request. The order endpoint checks the signed-in session and only returns an order owned by that customer; its response is marked `no-store`.
