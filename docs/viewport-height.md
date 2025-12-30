# Stable viewport height (fix untuk mobile browser)

Tujuan: memperbaiki masalah tinggi tampilan yang fluktuatif pada mobile (address bar yang muncul/samar menyebabkan `100vh` berubah), dan membuat layout lebih stabil serta mudah di-scroll.

## Ringkasan solusi

- Gunakan JavaScript di client untuk menulis `--app-height` = `window.innerHeight + 'px'` ke `:root`.
- Pakai variabel ini sebagai `min-height` / `height` pada container utama sehingga tinggi menjadi stabil.
- Berikan fallback CSS (mis. `min-height: 100vh`) untuk pengguna tanpa JS.
- Perhatian Tailwind/unocss: beberapa processor prefer `min-h-(--app-height)` ketimbang `min-h-[var(--app-height)]`. Pilih sesuai toolchain (lihat catatan di bawah).

## Mengapa ini perlu

Mobile browser (Chrome, Safari) mengubah `vh` saat address bar/toolbar muncul atau disembunyikan. Menggunakan `window.innerHeight` menghasilkan nilai piksel stabil yang merefleksikan area terlihat sebenarnya.

## Snippet yang bisa kamu pakai (copy-paste)

### `app/app.vue`

```vue
<template>
  <div :style="{ minHeight: 'var(--app-height)' }" class="bg-white">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

const setAppHeight = () => {
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`)
}

onMounted(() => {
  setAppHeight()
  window.addEventListener('resize', setAppHeight, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', setAppHeight)
})
</script>
```

### `app/layouts/default.vue` (contoh penggunaan di layout)

> Catatan Tailwind: jika processor-mu melaporkan error untuk `min-h-[var(--app-height)]`, gunakan `min-h-(--app-height)`.

```vue
<template>
  <!-- contoh dengan Tailwind/JIT yang mendukung sintaks [] -->
  <div class="flex flex-col min-h-[var(--app-height)]">
    <div class="w-full max-w-md mx-auto h-full overflow-y-auto">
      <div class="flex flex-col h-full">
        <div class="flex-1 overflow-auto">
          <slot />
        </div>
        <Navbar />
      </div>
    </div>
  </div>
</template>
```

Jika toolchain menolak sintaks di atas, ganti kelas pertama jadi:

```html
<div class="flex flex-col min-h-(--app-height)">
```

(Ini muncul di beberapa stack yang memakai uno.css atau processor alternatif — pilih yang sesuai dengan proyekmu.)

## Fallback (untuk non-JS)

Tambahkan di `assets/css/main.css`:

```css
:root {
  --app-height: 100vh; /* fallback jika JS mati */
}
```

Dengan begitu, saat JS belum jalan, layout masih memakai `100vh`.

## Testing

1. Jalankan dev server:

```bash
npm run dev
# atau pnpm dev
```

2. Buka di desktop lalu buka DevTools > Toggle device toolbar (mobile). Uji scroll dan perhatikan behavior saat address bar virtual muncul / menghilang.
3. Uji di perangkat nyata (Android/iOS) bila memungkinkan.

## Catatan Tailwind / processor

- Standard Tailwind JIT biasanya menerima `min-h-[var(--app-height)]` (Tailwind v3+). Namun ada toolchains (misal UnoCSS) yang memerlukan format `min-h-(--app-height)`.
- Jika kamu mendapat compile error tentang kelas arbitrary, cek processor yang terpasang (`tailwindcss`, `@tailwindcss/vite`, atau `unocss`). Sesuaikan sintaks atau tambahkan rule safelist di konfigurasi.

Contoh safelist (tailwind.config.js):

```js
module.exports = {
  // ...
  safelist: [
    'min-h-[var(--app-height)]'
  ]
}
```

(Note: penamaan dan lokasi file tergantung setup proyekmu.)

## SSR & SEO

- Pendekatan ini men-set variabel hanya di client (menggunakan `window`). Oleh karena itu HTML server-rendered tidak akan mengandung pixel-perfect height.
- Ini normal dan tidak berdampak pada SEO. Jika perlu konsistensi tanpa JS, harus ada pendekatan server-side yang menebak viewport (umumnya tidak praktis).

## PWA (opsional)

- Perubahan ini bukan PWA. Jika ingin saya tambahkan PWA manifest/service worker, sebutkan paket yang kamu inginkan (mis. `@vite-pwa/nuxt`) dan saya akan scaffold.

---

Kalau mau, saya bisa:

- Buat file MD ini di repo (sudah dibuat).
- Ganti kelas di layout menjadi bentuk yang proyek-mu support (kalau mau saya edit langsung).
- Tambah fallback CSS ke `assets/css/main.css`.

Mau saya lanjutkan edit langsung ke file `assets/css/main.css` dan `app/layouts/default.vue` sekarang atau cukup file dokumentasi ini saja?

## PWA: langkah cepat yang saya tambahkan

- Saya menambahkan konfigurasi PWA di `nuxt.config.ts` (menggunakan `@vite-pwa/nuxt`) dan dua ikon sederhana di `public/icons/`.
- Untuk mengaktifkan PWA secara penuh, jalankan instalasi paket:

```bash
npm install -D @vite-pwa/nuxt
# atau
pnpm add -D @vite-pwa/nuxt
```

- Setelah itu jalankan dev/build. Modul akan menghasilkan `manifest.webmanifest` dan service worker sesuai konfigurasi.

Catatan: ketika aplikasi dijalankan sebagai PWA (display: standalone), perilaku viewport bisa berbeda (tidak ada address bar). Solusi `--app-height` yang dibahas di dokumen ini tetap berguna untuk memastikan layout stabil di browser biasa; di PWA mode biasanya lebih konsisten karena toolbar browser hilang.

Kalau mau saya bisa langsung:

- Pasang paket (`@vite-pwa/nuxt`) ke `package.json` (commit perubahan), atau
- Tambahkan konfigurasi caching lebih detail untuk Workbox (mis. assetGroups), atau
- Buat halaman/komponen `install` yang memicu prompt instalasi PWA.

Mau saya lanjutkan dengan salah satu opsi di atas?