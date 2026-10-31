/**
 * Static export: hasil build ada di folder `out/` dan bisa di-host di
 * GitHub Pages, Netlify, Vercel, Cloudflare Pages, dll.
 *
 * Kalau di-host di sub-path (mis. https://user.github.io/migi/),
 * set env NEXT_PUBLIC_BASE_PATH=/migi saat build (workflow GitHub sudah melakukannya).
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  reactStrictMode: true,
};

export default nextConfig;
