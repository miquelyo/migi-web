/**
 * ──────────────────────────────────────────────────────────────
 *  EDIT FILE INI dulu sebelum publish.
 *  Semua link & info yang sifatnya "milik kamu" ada di sini.
 * ──────────────────────────────────────────────────────────────
 */
export const SITE = {
  name: 'Migi',

  /** Link tombol "Download". Ganti dengan link GitHub Releases kamu. */
  downloadUrl: 'https://github.com/USERNAME/migi/releases/latest',

  /** Repo GitHub (dipakai untuk tombol feedback → Issues). Kosongkan '' untuk menyembunyikan. */
  githubUrl: 'https://github.com/USERNAME/migi',

  /** Versi terbaru. Kosongkan '' kalau belum mau ditampilkan. Contoh: '1.0.0' */
  version: '',

  /** Ukuran download. Kosongkan '' kalau belum mau ditampilkan. Contoh: '8 MB' */
  size: '',

  /** SHA-256 dari installer (opsional). Kosongkan '' untuk menyembunyikan. */
  sha256: '',

  /** Link donasi. Yang url-nya '' tidak akan ditampilkan; kalau semuanya kosong, section Support disembunyikan. */
  support: [
    { label: 'Saweria', emoji: '☕', url: '' },
    { label: 'Trakteer', emoji: '🍵', url: '' },
    { label: 'Ko-fi', emoji: '❤️', url: '' },
    { label: 'PayPal', emoji: '💳', url: '' },
  ],
} as const;
