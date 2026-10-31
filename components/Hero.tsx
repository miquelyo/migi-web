'use client';

import { motion } from 'framer-motion';
import { useLang } from './LangProvider';
import NotchDemo from './notch/NotchDemo';
import { SITE } from '@/lib/config';

export function Hero() {
  const { t } = useLang();
  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-20 sm:pt-32">
      {/* glow background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-220px] h-[520px] w-[920px] -translate-x-1/2 rounded-full opacity-60 blur-[110px]"
          style={{ background: 'radial-gradient(closest-side, rgba(110,90,255,0.45), rgba(40,160,255,0.12) 60%, transparent)' }} />
        <div className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(ellipse 60% 55% at 50% 0%, #000, transparent)',
            WebkitMaskImage: 'radial-gradient(ellipse 60% 55% at 50% 0%, #000, transparent)',
          }} />
      </div>

      <div className="relative mx-auto max-w-6xl px-5">
        <motion.div className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-[12.5px] text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
            {t.hero.badge}
          </span>

          <h1 className="mt-6 text-[40px] font-extrabold leading-[1.05] tracking-[-0.035em] sm:text-6xl">
            {t.hero.title1}<br />
            <span className="glow-text bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">{t.hero.title2}</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-relaxed text-white/60 sm:text-lg">{t.hero.sub}</p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#download"
              className="rounded-full bg-white px-6 py-3 text-[15px] font-semibold text-black shadow-[0_0_40px_rgba(255,255,255,0.18)] transition hover:scale-[1.03] active:scale-[0.98]">
              {t.hero.cta}
            </a>
            <a href="#features"
              className="rounded-full border border-white/12 bg-white/[0.05] px-6 py-3 text-[15px] font-medium text-white/80 transition hover:bg-white/[0.1] hover:text-white">
              {t.hero.cta2}
            </a>
          </div>
          {(SITE.version || SITE.size) && (
            <p className="mt-4 text-[12.5px] text-white/35">
              {SITE.version && `${t.download.versionLabel} ${SITE.version}`}
              {SITE.version && SITE.size && ', '}
              {SITE.size && `${SITE.size}`}
            </p>
          )}
        </motion.div>

        <motion.div id="preview" className="mx-auto mt-14 max-w-3xl"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15, ease: [0.32, 0.72, 0, 1] }}>
          <NotchDemo />
        </motion.div>
      </div>
    </section>
  );
}
