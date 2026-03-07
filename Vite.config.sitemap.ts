import Sitemap from "vite-plugin-sitemap";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),

    Sitemap({
      hostname: "https://nova-properties-rho.vercel.app",

      dynamicRoutes: [
        "/",
        "/properties/listings",
        "/agents",
        "/about",
        "/contact",
        "/privacy-policy",
        "/terms-of-service",
      ],

      exclude: ["/signin", "/signup", "/favorites", "/auth/callback"],

      changefreq: "weekly",
      priority: 0.8,
      lastmod: new Date(),
    }),
  ],
});
