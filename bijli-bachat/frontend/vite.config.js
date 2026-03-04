import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt"],
      manifest: {
        name: "Bijli Bachat",
        short_name: "BijliBachat",
        description:
          "Offline-capable PWA for predicting electricity bills and saving tips for UP DISCOM users.",
        theme_color: "#047857",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        lang: "hi-IN",
        icons: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.openweathermap\.org\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "weather-cache",
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 30
              }
            }
          },
          {
            urlPattern: ({ request }) =>
              request.destination === "document" ||
              request.destination === "script" ||
              request.destination === "style" ||
              request.destination === "image" ||
              request.destination === "font",
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "app-shell-cache"
            }
          }
        ]
      }
    })
  ],
  server: {
    port: 5173
  }
});

