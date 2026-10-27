import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const API = "http://localhost:3000";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth": API,
      "/leads": API,
      "/health": API,
    },
  },
});
