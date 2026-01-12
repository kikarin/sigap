import tailwindcss from "@tailwindcss/vite";
import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";
import Lara from "@primeuix/themes/lara";
import { fileURLToPath } from "node:url";

const MyCustomTheme = definePreset(Lara, {
  semantic: {
    primary: {
      50: "#eef2ff",
      100: "#e0e7ff",
      200: "#c7d2fe",
      300: "#a5b4fc",
      400: "#818cf8",
      500: "#1053E1",
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

  modules: ["@primevue/nuxt-module", "@nuxt/image", "@vite-pwa/nuxt"],

  runtimeConfig: {
    // Private keys (only available on server-side)
    apiSecret: '',
    
    public: {
      apiBaseUrl: (import.meta as any).env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
      apiDomain: (import.meta as any).env.NUXT_PUBLIC_API_DOMAIN || 'https://sigap.summitct.co.id',
    }
  },

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

  nitro: {
    compressPublicAssets: true,
    minify: true
  },

  pwa: {
    registerType: 'prompt',
    strategies: 'generateSW',
    manifest: {
      name: 'SIGAP - Sistem Informasi dan Layanan Publik',
      short_name: 'SIGAP',
      description: 'Sistem Informasi dan Layanan Publik Kabupaten Bogor',
      theme_color: '#1053E1',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: '/Lambang_Kabupaten_Bogor.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable'
        },
        {
          src: '/Lambang_Kabupaten_Bogor.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html}'],
      globIgnores: ['**/node_modules/**/*', '**/.nuxt/**/*', '**/.output/**/*'],
      maximumFileSizeToCacheInBytes: 5000000,
      runtimeCaching: [
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 30
            }
          }
        }
      ]
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      type: 'module'
    }
  } as any,
});
