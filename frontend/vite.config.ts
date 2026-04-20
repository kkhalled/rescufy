import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, "/")

          if (!normalizedId.includes("/node_modules/")) return

          if (
            normalizedId.includes("/node_modules/@radix-ui/") ||
            normalizedId.includes("/node_modules/framer-motion/") ||
            normalizedId.includes("/node_modules/sonner/") ||
            normalizedId.includes("/node_modules/lucide-react/")
          ) {
            return "ui-vendor"
          }

          if (
            normalizedId.includes("/node_modules/react-router/") ||
            normalizedId.includes("/node_modules/react-router-dom/") ||
            normalizedId.includes("/node_modules/@remix-run/router/")
          ) {
            return "router-vendor"
          }

          if (
            normalizedId.includes("/node_modules/react/") ||
            normalizedId.includes("/node_modules/react-dom/")
          ) {
            return "react-vendor"
          }

          if (normalizedId.includes("/node_modules/@fortawesome/")) {
            return "icons-vendor"
          }

          if (
            normalizedId.includes("/node_modules/i18next/") ||
            normalizedId.includes("/node_modules/react-i18next/")
          ) {
            return "i18n-vendor"
          }

          if (
            normalizedId.includes("/node_modules/@reduxjs/toolkit/") ||
            normalizedId.includes("/node_modules/react-redux/")
          ) {
            return "state-vendor"
          }

          if (
            normalizedId.includes("/node_modules/axios/") ||
            normalizedId.includes("/node_modules/@microsoft/signalr/") ||
            normalizedId.includes("/node_modules/jwt-decode/") ||
            normalizedId.includes("/node_modules/crypto-js/")
          ) {
            return "network-vendor"
          }
        },
      },
    },
  },
})