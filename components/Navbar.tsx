'use client';

import { useEffect, useState } from 'react';
import { useLang } from './LangProvider';
import { Logo } from './Logo';
import { SITE } from '@/lib/config';

export function Navbar() {
  const { t, lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const hasSupport = SITE.support.some(s => s.url);
  const links: [string, string][] = [
    ['#preview', t.nav.preview],
    ['#features', t.nav.features],
    ['#light', t.nav.light],
    ['#customize', t.nav.customize],
    ['#download', t.nav.download],
    ['#faq', t.nav.faq],
    ...(hasSupport ? ([['#support', '☕ ' + t.nav.support]] as [string, string][]) : []),
  ];

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-black/60 backdrop-blur-xl border-b border-white/[0.07]' : 'border-b border-transparent'}`}>
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <a href="#top" className="flex items-center gap-2.5 font-bold tracking-tight">
          <Logo size={26} /><span className="text-[17px]">Migi</span>
        </a>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
          {links.map(([href, label]) => (
            <a key={href} href={href}
              className="rounded-full px-3 py-1.5 text-[13px] text-white/55 hover:text-white hover:bg-white/[0.07] transition-colors">
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex rounded-full border border-white/10 bg-white/[0.04] p-0.5 text-[12px] font-semibold" role="group" aria-label="Language">
            {(['en', 'id'] as const).map(l => (
              <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l}
                className={`rounded-full px-2.5 py-1 uppercase transition-colors ${
                  lang === l ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}>
                {l}
              </button>
            ))}
          </div>
          <a href="#download"
            className="hidden sm:inline-flex rounded-full bg-white px-4 py-1.5 text-[13px] font-semibold text-black hover:bg-white/90 transition-colors">
            {t.nav.download}
          </a>
        </div>
      </div>
    </header>
  );
}
