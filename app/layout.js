import Providers from "./providers";
import "../src/App.css";
import "./globals.css";
import localFont from "next/font/local";

const spaceGrotesk = localFont({
  src: [
    { path: "../node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-400-normal.woff2", weight: "400" },
    { path: "../node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff2", weight: "700" },
  ],
  variable: "--font-space-grotesk",
  display: "swap",
});
const playfairDisplay = localFont({
  src: [
    { path: "../node_modules/@fontsource/playfair-display/files/playfair-display-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../node_modules/@fontsource/playfair-display/files/playfair-display-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../node_modules/@fontsource/playfair-display/files/playfair-display-latin-500-italic.woff2", weight: "500", style: "italic" },
  ],
  variable: "--font-playfair-display",
  display: "swap",
});
const dmMono = localFont({
  src: [
    { path: "../node_modules/@fontsource/dm-mono/files/dm-mono-latin-400-normal.woff2", weight: "400" },
    { path: "../node_modules/@fontsource/dm-mono/files/dm-mono-latin-500-normal.woff2", weight: "500" },
  ],
  variable: "--font-dm-mono",
  display: "swap",
  preload: false,
});

export const metadata = { title: "Addis Eats", description: "Ethiopian food delivery in Addis Ababa." };

export default function RootLayout({ children }) {
  return <html lang="en" data-scroll-behavior="smooth"><body className={`${spaceGrotesk.variable} ${playfairDisplay.variable} ${dmMono.variable}`}><Providers>{children}</Providers></body></html>;
}
