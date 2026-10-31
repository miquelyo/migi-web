/**
 * ──────────────────────────────────────────────────────────────
 *  EDIT FILE INI dulu sebelum publish.
 *  Semua link & info yang sifatnya "milik kamu" ada di sini.
 * ──────────────────────────────────────────────────────────────
 */
export const SITE = {
  name: 'Migi',

downloadUrl: 'https://github.com/miquelyo/migi-web/releases/latest/download/Migi_1.0.0_x64-setup.exe',
  githubUrl: 'https://github.com/miquelyo/migi-web',
  version: '1.0.0',
  size: '1,61 MB',   // sesuaikan dengan ukuran file installer
  sha256: '',     // opsional, lihat di bawah

  /** Link donasi. Yang url-nya '' tidak akan ditampilkan; kalau semuanya kosong, section Support disembunyikan. */
  support: [
    { label: 'Saweria', emoji: '☕', url: '' },
    { label: 'Trakteer', emoji: '🍵', url: '' },
    { label: 'Ko-fi', emoji: '❤️', url: '' },
    { label: 'PayPal', emoji: '💳', url: '' },
  ],
} as const;
