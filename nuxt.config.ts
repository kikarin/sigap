import tailwindcss from "@tailwindcss/vite";
import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";
import { fileURLToPath } from "node:url";

const MyCustomTheme = definePreset(Aura, {
  semantic: {
    primary: {
      50: "#eef2ff",
      100: "#e0e7ff",
      200: "#c7d2fe",
      300: "#a5b4fc",
      400: "#818cf8",
      500: "#2F52BD",
      600: "#1e3a8a",
      700: "#1e40af",
      800: "#1e3a8a",
      900: "#172554",
      950: "#0f172a",
    },
  },
});

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  css: [
    fileURLToPath(new URL("./assets/css/main.css", import.meta.url)),
    "leaflet/dist/leaflet.css",
  ],

  modules: ["@primevue/nuxt-module", "@nuxt/image"],

  primevue: {
    options: {
      ripple: true,
      theme: {
        preset: MyCustomTheme,
        options: {
          darkModeSelector: false,
          cssLayer: false,
        },
      },
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
