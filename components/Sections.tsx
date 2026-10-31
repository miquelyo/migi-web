'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLang } from './LangProvider';
import { Reveal } from './Reveal';
import { Icon } from './Icon';
import { Logo } from './Logo';
import { Eyes, WavingHand, Ear, EAR_R, NOTCH_BG } from './notch/parts';
import { SITE } from '@/lib/config';

const SectionTitle = ({ title, sub, center = true }: { title: string; sub?: string; center?: boolean }) => (
  <div className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
    <h2 className="text-3xl font-extrabold leading-[1.1] tracking-[-0.03em] sm:text-[42px]">{title}</h2>
    {sub && <p className="mt-4 text-[16px] leading-relaxed text-white/55">{sub}</p>}
  </div>
);

/* ═══ Features ═══ */
export function Features() {
  const { t } = useLang();
  return (
    <section id="features" className="mx-auto max-w-6xl px-5 py-24">
      <Reveal><SectionTitle title={t.features.title} sub={t.features.sub} /></Reveal>
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {t.features.items.map((f, i) => (
          <Reveal key={f.title} delay={(i % 4) * 0.06}>
            <div className="card group h-full p-5 transition-colors duration-300 hover:bg-white/[0.06]">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.07] text-white ring-1 ring-white/10 transition-all duration-300 group-hover:bg-white group-hover:text-black">
                <Icon name={f.icon} className="h-[18px] w-[18px]" />
              </div>
              <h3 className="text-[16px] font-bold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-white/50">{f.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ═══ Mascot ═══ */
function MiniNotch({ children, caption }: { children: React.ReactNode; caption: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex h-[30px] w-[150px] justify-center" style={{ borderBottomLeftRadius: 19, borderBottomRightRadius: 19 }}>
        <Ear side="left" size={EAR_R} />
        <Ear side="right" size={EAR_R} />
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden"
          style={{ background: NOTCH_BG, borderRadius: '0 0 19px 19px' }}>
          {children}
        </div>
      </div>
      <span className="text-[12.5px] text-white/40">{caption}</span>
    </div>
  );
}

export function Mascot() {
  const { t } = useLang();
  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <Reveal>
        <div className="card relative overflow-hidden px-6 py-14 text-center sm:px-12">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-50"
            style={{ background: 'radial-gradient(60% 100% at 50% 0%, rgba(120,100,255,0.35), transparent)' }} />
          <div className="relative">
            <div className="mb-10 flex flex-wrap items-start justify-center gap-10 sm:gap-20">
              <MiniNotch caption={t.mascot.cap1}><Eyes happy={false} /></MiniNotch>
              <MiniNotch caption={t.mascot.cap2}>
                <div className="relative flex h-full w-full items-center justify-center">
                  <Eyes happy /><WavingHand />
                </div>
              </MiniNotch>
            </div>
            <SectionTitle title={t.mascot.title} sub={t.mascot.text} />
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ═══ Under the hood ═══ */
export function Tech() {
  const { t } = useLang();
  const chips = ['Tauri', 'Rust', 'React', 'Framer Motion'];
  return (
    <section id="light" className="mx-auto max-w-6xl px-5 py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <SectionTitle center={false} title={t.tech.title} sub={t.tech.sub} />
          <div className="mt-6 flex flex-wrap gap-2">
            {chips.map(c => (
              <span key={c} className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[12.5px] font-medium text-white/65">{c}</span>
            ))}
          </div>
        </Reveal>
        <div className="grid gap-3">
          {t.tech.items.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.06}>
              <div className="card flex gap-4 p-5">
                <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white text-[12px] font-bold text-black">{i + 1}</span>
                <p className="text-[14.5px] leading-relaxed text-white/55">
                  <strong className="font-semibold text-white">{it.title}</strong> {it.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ Customize (settings mock) ═══ */
function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} onClick={onChange}
      className={`relative h-[22px] w-[38px] flex-shrink-0 rounded-full transition-colors duration-200 ${on ? 'bg-emerald-400' : 'bg-white/15'}`}>
      <motion.span className="absolute top-[2px] h-[18px] w-[18px] rounded-full bg-white shadow"
        initial={false} animate={{ left: on ? 18 : 2 }} transition={{ type: 'spring', stiffness: 520, damping: 32 }} />
    </button>
  );
}

export function Customize() {
  const { t } = useLang();
  const [on, setOn] = useState<Record<string, boolean>>({
    autostart: true, mascot: true, lyrics: true, battery: true, eyes: false,
  });
  const [pages, setPages] = useState<Record<string, boolean>>({ media: true, weather: true, stopwatch: true, calendar: true });
  const [idle, setIdle] = useState(10);

  return (
    <section id="customize" className="mx-auto max-w-6xl px-5 py-24">
      <Reveal><SectionTitle title={t.customize.title} sub={t.customize.sub} /></Reveal>

      <div className="mt-14 grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* panel */}
        <Reveal>
          <div className="overflow-hidden rounded-[22px] border border-white/10 bg-[#0c0c0e] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
            <div className="flex items-center gap-2 border-b border-white/[0.07] px-5 py-3.5">
              <Logo size={20} /><span className="text-[13.5px] font-semibold">{t.customize.panelTitle}</span>
            </div>
            <div className="divide-y divide-white/[0.06]">
              {t.customize.rows.map(r => (
                <div key={r.key} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <div className="min-w-0">
                    <div className="text-[14px] font-semibold">{r.title}</div>
                    <div className="mt-0.5 text-[12.5px] leading-snug text-white/40">{r.text}</div>
                  </div>
                  <Toggle label={r.title} on={on[r.key]} onChange={() => setOn(p => ({ ...p, [r.key]: !p[r.key] }))} />
                </div>
              ))}
              <div className="px-5 py-3.5">
                <div className="flex items-center justify-between">
                  <div className="text-[14px] font-semibold">{t.customize.idleTitle}</div>
                  <span className="text-[13px] font-semibold tabular-nums text-white/70">{idle}{t.customize.seconds}</span>
                </div>
                <div className="mt-0.5 text-[12.5px] text-white/40">{t.customize.idleText}</div>
                <input type="range" min={3} max={60} value={idle} onChange={e => setIdle(+e.target.value)}
                  aria-label={t.customize.idleTitle} className="mt-3 w-full accent-white" />
              </div>
            </div>
          </div>
        </Reveal>

        {/* pages */}
        <Reveal delay={0.1}>
          <div className="card p-6">
            <h3 className="text-[18px] font-bold tracking-tight">{t.customize.pagesTitle}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-white/50">{t.customize.pagesText}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {(Object.keys(t.customize.pages) as (keyof typeof t.customize.pages)[]).map(k => (
                <button key={k} aria-pressed={pages[k]}
                  onClick={() => setPages(p => ({ ...p, [k]: !p[k] }))}
                  className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
                    pages[k] ? 'border-white bg-white text-black' : 'border-white/10 bg-white/[0.04] text-white/45 hover:text-white'}`}>
                  {t.customize.pages[k]}
                </button>
              ))}
            </div>
            <div className="mt-8 flex items-center justify-center gap-1.5" aria-hidden>
              {Object.keys(pages).filter(k => pages[k]).map((k, i) => (
                <motion.span key={k} layout className="block h-[4px] rounded-full bg-white"
                  style={{ width: i === 0 ? 20 : 5, opacity: i === 0 ? 1 : 0.3 }} />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══ Download ═══ */
export function Download() {
  const { t } = useLang();
  return (
    <section id="download" className="mx-auto max-w-6xl px-5 py-24">
      <Reveal>
        <div className="card relative overflow-hidden px-6 py-14 text-center sm:px-12">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-48 opacity-40"
            style={{ background: 'radial-gradient(60% 100% at 50% 100%, rgba(80,160,255,0.4), transparent)' }} />
          <div className="relative">
            <div className="mx-auto mb-5 w-fit"><Logo size={56} /></div>
            <SectionTitle title={t.download.title} sub={t.download.sub} />
            <a href={SITE.downloadUrl}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-[16px] font-semibold text-black shadow-[0_0_50px_rgba(255,255,255,0.2)] transition hover:scale-[1.03] active:scale-[0.98]">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden><path d="M3 5.5 10.5 4.5v7H3v-6zm8.5-1.1L21 3v8.5h-9.5V4.4zM3 12.5h7.5v7L3 18.5v-6zm8.5 0H21V21l-9.5-1.4v-7.1z" /></svg>
              {t.download.button}
            </a>
            {(SITE.version || SITE.size) && (
              <p className="mt-3 text-[13px] text-white/40">
                {SITE.version && `${t.download.versionLabel} ${SITE.version}`}{SITE.version && SITE.size && ' · '}{SITE.size}
              </p>
            )}
            <p className="mt-2 text-[13px] text-white/35">{t.download.noAdmin}</p>
            {SITE.sha256 && (
              <p className="mx-auto mt-4 max-w-xl break-all font-mono text-[11px] text-white/30">{t.download.shaLabel}: {SITE.sha256}</p>
            )}
          </div>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <Reveal>
          <div className="card h-full p-6">
            <h3 className="text-[18px] font-bold tracking-tight">{t.download.warnTitle}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-white/50">{t.download.warnText}</p>
            {[[t.download.step1Title, t.download.step1], [t.download.step2Title, t.download.step2]].map(([title, steps]) => (
              <div key={title as string} className="mt-5">
                <div className="text-[12px] font-semibold uppercase tracking-wider text-white/35">{title as string}</div>
                <ol className="mt-2 space-y-2">
                  {(steps as string[]).map((s, i) => (
                    <li key={s} className="flex gap-3 text-[14px] leading-snug text-white/65">
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-bold text-white">{i + 1}</span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="card h-full p-6">
            <h3 className="text-[18px] font-bold tracking-tight">{t.download.trustTitle}</h3>
            <ul className="mt-4 space-y-3">
              {t.download.trust.map(s => (
                <li key={s} className="flex gap-3 text-[14px] leading-snug text-white/60">
                  <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══ Support ═══ */
export function Support() {
  const { t } = useLang();
  const links = SITE.support.filter(s => s.url);
  if (!links.length) return null;
  return (
    <section id="support" className="mx-auto max-w-4xl px-5 py-16 text-center">
      <Reveal>
        <SectionTitle title={t.support.title} sub={t.support.text} />
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {links.map(l => (
            <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
              className="rounded-full border border-white/12 bg-white/[0.05] px-5 py-2.5 text-[14px] font-medium text-white/80 transition hover:bg-white/[0.12] hover:text-white">
              <span aria-hidden>{l.emoji}</span> {l.label}
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ═══ Feedback + Note ═══ */
export function FeedbackNote() {
  const { t } = useLang();
  return (
    <section id="feedback" className="mx-auto max-w-6xl px-5 py-16">
      <div className="grid gap-4 lg:grid-cols-2">
        <Reveal>
          <div className="card h-full p-7">
            <h2 className="text-[26px] font-extrabold tracking-[-0.025em]">{t.feedback.title}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-white/55">{t.feedback.text}</p>
            {SITE.githubUrl && (
              <a href={`${SITE.githubUrl}/issues`} target="_blank" rel="noopener noreferrer"
                className="mt-6 inline-flex rounded-full bg-white px-5 py-2.5 text-[14px] font-semibold text-black transition hover:bg-white/90">
                {t.feedback.button}
              </a>
            )}
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div id="note" className="card h-full p-7">
            <h2 className="text-[26px] font-extrabold tracking-[-0.025em]">{t.note.title}</h2>
            <p className="mt-1 text-[12.5px] text-white/35">{t.note.by}</p>
            <div className="mt-4 space-y-3 text-[14px] leading-relaxed text-white/55">
              <p>{t.note.p1}</p>
              <p>{t.note.p2}</p>
              <p><strong className="font-semibold text-white">{t.note.p3}</strong></p>
              <p className="text-[12.5px] text-white/35">{t.note.p4}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══ FAQ ═══ */
export function Faq() {
  const { t } = useLang();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="mx-auto max-w-3xl px-5 py-24">
      <Reveal><SectionTitle title={t.faq.title} /></Reveal>
      <div className="mt-10 space-y-2.5">
        {t.faq.items.map((it, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={it.q} delay={i * 0.04}>
              <div className="card overflow-hidden">
                <button onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                  <span className="text-[15.5px] font-semibold tracking-tight">{it.q}</span>
                  <motion.svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0 text-white/50" fill="none" stroke="currentColor" strokeWidth="2.4"
                    strokeLinecap="round" strokeLinejoin="round" animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }} aria-hidden>
                    <path d="M12 5v14M5 12h14" />
                  </motion.svg>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }} className="overflow-hidden">
                      <p className="px-5 pb-5 text-[14.5px] leading-relaxed text-white/55">{it.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ═══ Privacy ═══ */
export function Privacy() {
  const { t } = useLang();
  return (
    <section id="privacy" className="mx-auto max-w-3xl px-5 pb-20">
      <Reveal>
        <h2 className="text-[22px] font-bold tracking-tight">{t.privacy.title}</h2>
        <div className="mt-4 space-y-3 text-[14px] leading-relaxed text-white/50">
          <p>{t.privacy.p1}</p>
          <p>{t.privacy.p2}</p>
          <p>{t.privacy.p3}</p>
          <p>{t.privacy.p4}</p>
        </div>
      </Reveal>
    </section>
  );
}

/* ═══ Footer ═══ */
export function Footer() {
  const { t } = useLang();
  const link = 'underline decoration-white/20 underline-offset-2 hover:text-white';
  return (
    <footer className="border-t border-white/[0.07] px-5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-[13px] text-white/40 sm:flex-row">
        <div className="flex items-center gap-2.5"><Logo size={22} /><span>{t.footer.rights}</span></div>
        <p className="text-center">
          {t.footer.credits} <a className={link} href="https://lrclib.net" target="_blank" rel="noopener noreferrer">LRCLIB</a>
          {' · '}{t.footer.weather} <a className={link} href="https://open-meteo.com" target="_blank" rel="noopener noreferrer">Open-Meteo</a>
        </p>
        <nav className="flex gap-4" aria-label="Footer">
          <a className="hover:text-white" href="#privacy">{t.privacy.title}</a>
          <a className="hover:text-white" href="#faq">{t.nav.faq}</a>
          <a className="hover:text-white" href="#note">{t.note.title.replace('.', '')}</a>
          <a className="hover:text-white" href="#download">{t.nav.download}</a>
        </nav>
      </div>
    </footer>
  );
}
