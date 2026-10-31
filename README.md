# Migi website

Landing page untuk **Migi**, notch / Dynamic Island untuk Windows.
Dibuat dengan Next.js (App Router), TypeScript, Tailwind CSS, dan Framer Motion.

## Jalankan

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # hasil static ada di folder out/
```

## Yang WAJIB kamu ganti

Buka `lib/config.ts` lalu isi:

- `downloadUrl`: link GitHub Releases (atau installer) Migi
- `githubUrl`: repo kamu (untuk tombol feedback)
- `version`, `size`, `sha256`: opsional, kosong = disembunyikan
- `support`: link Saweria / Trakteer / Ko-fi / PayPal. Yang kosong tidak tampil

Semua teks (English + Indonesia) ada di `lib/content.ts`.

## Struktur

```
app/                 layout, halaman, CSS, favicon
components/
  notch/NotchDemo.tsx  demo notch interaktif (turunan dari App.tsx Migi)
  notch/parts.tsx      mata, tangan melambai, ear, ikon, dll
  Sections.tsx         Features, Mascot, Tech, Customize, Download, FAQ, dst.
lib/config.ts        link & info milik kamu
lib/content.ts       semua copy EN / ID
```

## Deploy

- **GitHub Pages**: push ke branch `main`, aktifkan Pages (Source: GitHub Actions).
  Workflow di `.github/workflows/deploy.yml` otomatis mengatur `basePath`.
- **Vercel / Netlify / Cloudflare Pages**: import repo, build command `npm run build`,
  output directory `out`. Tidak perlu `NEXT_PUBLIC_BASE_PATH`.
