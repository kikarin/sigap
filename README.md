## PWA SIGAP – Ringkasan Endpoint Penting

### Pengajuan Proposal – Template Proposal

- **Endpoint**: `GET /api/pwa/pengajuan-proposal/template`
- **Deskripsi**: Mengembalikan informasi file template proposal yang harus diunduh dan diisi oleh warga sebelum di‑upload kembali sebagai `file_pendukung`.
- **Response (contoh)**:
  - `success` (bool)
  - `data`:
    - `url` – URL lengkap ke file template, misalnya `https://.../template-proposal.docx`
    - `filename` – `template-proposal.docx`
    - `note` – catatan singkat cara penggunaan template.
- **Catatan Frontend (PWA)**:
  - Di halaman form pengajuan proposal (langkah data kegiatan), panggil endpoint ini saat load.
  - Tampilkan tombol **“Download Template Proposal”** yang mengarah ke `data.url`, serta teks penjelasan dari `data.note`.

---

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
