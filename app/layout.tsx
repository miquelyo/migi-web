import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LangProvider } from '@/components/LangProvider';

export const metadata: Metadata = {
  title: 'Migi: a living notch for Windows',
  description:
    'Migi turns the top edge of your Windows screen into a small, living notch for music, synced lyrics, weather, timers and more.',
  openGraph: {
    title: 'Migi: a living notch for Windows',
    description: 'Music, synced lyrics, weather and timers, tucked into the top of your screen.',
    type: 'website',
  },
  twitter: { card: 'summary' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#050505',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="font-sans antialiased">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
