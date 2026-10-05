# Day 43 performance record

## Measurement method

Three Lighthouse 13.5.0 mobile runs were made on 2026-10-04 against production builds served by `npm run start`, with simulated mobile throttling. The runs used Headless Chrome 154. The before build is a clean archive of the Day 42 source at the repository's `HEAD`; the after build is this Day 43 project. Each run's JSON is saved in [`artifacts`](./artifacts/).

Reproduce an audit after `npm run build` and `npm run start` with:

```powershell
.\node_modules\.bin\lighthouse.cmd http://127.0.0.1:3000/ --chrome-path='C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe' --chrome-flags='--headless --no-sandbox --disable-gpu' --form-factor=mobile --throttling-method=simulate --output=json --output-path=./artifacts/lighthouse-mobile.json
```

Lighthouse used the installed Edge Chromium binary with headless flags in this environment. On a machine where Chrome is discoverable, Lighthouse can find it automatically. These are production measurements; `npm run dev` is not an equivalent target.

## Before and after

Values are the median of three runs. Ranges show run-to-run variation.

- Before reports: [run 1](./artifacts/lighthouse-before-mobile.json), [run 2](./artifacts/lighthouse-before-mobile-2.json), [run 3](./artifacts/lighthouse-before-mobile-3.json).
- After reports: [run 1](./artifacts/lighthouse-after-mobile.json), [run 2](./artifacts/lighthouse-after-mobile-2.json), [run 3](./artifacts/lighthouse-after-mobile-3.json).

| Metric | Day 42 before | Day 43 after | Change |
| --- | ---: | ---: | ---: |
| Lighthouse Performance | 92 (90 to 95) | 80 (75 to 83) | -12 |
| Accessibility | 100 | 100 | 0 |
| Best Practices | 100 | 100 | 0 |
| SEO | 100 | 100 | 0 |
| First Contentful Paint | 1.32 s (1.26 to 1.37) | 1.24 s (1.01 to 1.44) | -0.08 s |
| Largest Contentful Paint | 2.54 s (2.44 to 2.86) | 3.91 s (2.06 to 3.95) | +1.36 s |
| Cumulative Layout Shift | 0.00 | 0.00 | 0.00 |
| Total Blocking Time | 247 ms (193 to 272) | 336 ms (240 to 1,162) | +89 ms |
| Transfer size | 795 KiB (793 to 796) | 518 KiB (518 to 518) | -277 KiB |

LCP did not improve in these runs, and the Performance score fell. Lighthouse identified the hero heading as the LCP element in five of six runs; the remaining after run caught the temporary `app/loading.js` heading. The prioritized hero photo was not the LCP element on this mobile viewport, so image priority cannot explain or fix the measured heading paint. The reports do not isolate which change caused the LCP regression.

Image optimization did reduce transfer size: all measured image responses succeeded, and the after run served smaller optimized variants through `/_next/image`. FCP improved slightly and CLS remained zero. TBT varied widely, so its median should be treated cautiously. The clear next optimization target is the home heading's render delay; take another controlled set of runs after changing that path before claiming an LCP win.

## What changed and why

- The hero and dish photos use `next/image` with intrinsic dimensions, responsive `sizes`, and useful alt text. The hero is the sole `priority` image. Its optimized responses reduced page transfer, while the Lighthouse reports show it is not the mobile LCP element.
- `next/font/local` loads the selected `@fontsource` font files as first-party assets. The app no longer requests a third-party font stylesheet.
- `next.config.mjs` lists the remote image hosts present in the dish data and restaurant photo.
- The app has no third-party JavaScript to defer. If optional analytics are added later, load them with `next/script` and `lazyOnload`.
- `.env.example` documents `SESSION_SECRET` and `STAFF_ACCESS_CODE`; `.env*.local` files are ignored, and neither secret uses a `NEXT_PUBLIC_` name.

## Layout stability

Image elements declare a 1200 by 900 intrinsic aspect ratio, and their wrappers reserve space with `object-fit: cover`. CLS was 0.00 in all six audited runs, so the measured page did not jump as it loaded.
