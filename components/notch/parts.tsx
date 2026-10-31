'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/* Potongan UI notch yang diambil dari App.tsx (Migi), dipakai ulang di website. */

export const NOTCH_BG = '#070707';
export const EASE_OUT: [number, number, number, number] = [0.32, 0.72, 0, 1];
export const SPRING = { type: 'spring' as const, stiffness: 370, damping: 30, mass: 0.58 };

export const BLINK_MIN_MS = 5000;
export const BLINK_MAX_MS = 8000;

/* ─── Icons ─── */
export const INote = () => <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6Z" /></svg>;
export const IPrev = () => <svg className="w-[15px] h-[15px] fill-current" viewBox="0 0 24 24"><path d="M11 5 3 12l8 7V5zm2 0v14l8-7-8-7z" /></svg>;
export const INext = () => <svg className="w-[15px] h-[15px] fill-current" viewBox="0 0 24 24"><path d="M4 19l8-7-8-7v14zm9-14v14l8-7-8-7z" /></svg>;
export const IPlay = () => <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>;
export const IPause = () => <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>;
export const ILyric = ({ on }: { on: boolean }) => (
  <svg className="w-[14px] h-[14px]" fill={on ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 0 1-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);
export const IChevronRight = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" /></svg>
);
export const IChevronLeft = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" /></svg>
);

/* ─── Visualizer bars ─── */
export const VisBars = ({ playing, small }: { playing: boolean; small?: boolean }) => (
  <div className={`flex items-end gap-[2px] ${small ? 'h-2 w-3' : 'h-2.5 w-3.5'}`}>
    {[0.9, 0.5, 1, 0.65, 0.8].map((b, i) => (
      <motion.span key={i} className="w-[1.5px] rounded-full bg-white/50"
        animate={playing ? { scaleY: [b, 1, b * 0.6, 0.9, b] } : { scaleY: 0.25 }}
        transition={playing ? { duration: 0.55 + i * 0.08, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
        style={{ height: '100%', transformOrigin: 'bottom' }} />
    ))}
  </div>
);

/* ─── Eyes (maskot) ─── */
export const Eyes = ({ happy, still }: { happy: boolean; still?: boolean }) => {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (happy || still) { setBlink(false); return; }
    let t1: ReturnType<typeof setTimeout>, t2: ReturnType<typeof setTimeout>;
    const schedule = () => {
      t1 = setTimeout(() => {
        setBlink(true);
        t2 = setTimeout(() => { setBlink(false); schedule(); }, 150);
      }, 2200 + Math.random() * (BLINK_MAX_MS - BLINK_MIN_MS) * 0.6);
    };
    schedule();
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [happy, still]);

  const glow = '0 0 10px rgba(255,255,255,0.7), 0 0 24px rgba(255,255,255,0.3)';

  return (
    <div className="flex items-center" style={{ gap: happy ? 24 : 14 }}>
      {[0, 1].map(i =>
        happy ? (
          <motion.svg key={`h${i}`} width="14" height="9" viewBox="0 0 14 9"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 520, damping: 20 }}
            style={{ filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.75))' }}>
            <path d="M1.5 7.5 Q7 -1.5 12.5 7.5" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" />
          </motion.svg>
        ) : (
          <motion.span key={`n${i}`} className="block rounded-full bg-white"
            style={{ width: 9, height: 17, boxShadow: glow, transformOrigin: 'center' }}
            animate={{ scaleY: blink ? 0.08 : 1 }}
            transition={{ duration: 0.08, ease: 'easeInOut' }} />
        )
      )}
    </div>
  );
};

/* ─── Tangan melambai ─── */
const HAND_COLOR = '#ffffff';
export const WavingHand = () => (
  <motion.div className="absolute right-4 top-1/2"
    style={{ y: '-50%' }}
    initial={{ opacity: 0, scale: 0.3, x: -10 }}
    animate={{ opacity: 1, scale: 1, x: 0 }}
    transition={{ type: 'spring', stiffness: 450, damping: 18, delay: 0.1 }}>
    <motion.span className="block"
      style={{ transformOrigin: '60% 90%' }}
      animate={{ rotate: [0, 24, -12, 24, -12, 24, 0] }}
      transition={{ duration: 1.3, delay: 0.3, ease: 'easeInOut' }}>
      <svg width="19" height="19" viewBox="0 0 24 24" className="block"
        style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.55))' }}>
        <g stroke={HAND_COLOR} strokeWidth="2.3" strokeLinecap="round" fill="none">
          <path d="M8.4 11 L7.4 5" />
          <path d="M11.2 10.5 L11.2 3.4" />
          <path d="M14 10.8 L15 4.4" />
          <path d="M16.6 12 L18.4 7.4" />
          <path d="M7 15 L3.8 12.2" strokeWidth="2.5" />
        </g>
        <path fill={HAND_COLOR}
          d="M6.2 13.2C6.2 10.8 8 10 12 10C16 10 18 11 18 13.5C18 17.5 15.5 20.5 12 20.5C8.5 20.5 6.2 17.5 6.2 13.2Z" />
      </svg>
    </motion.span>
  </motion.div>
);

/* ─── Ear: lengkung cekung di sisi notch ─── */
export const EAR_R = 12;
export const Ear = ({ side, size }: { side: 'left' | 'right'; size: number }) => (
  <motion.div aria-hidden className="absolute top-0 pointer-events-none"
    initial={false}
    animate={{ width: size, height: size }}
    transition={SPRING}
    style={side === 'left' ? { right: '100%' } : { left: '100%', scaleX: -1 }}>
    <svg viewBox="0 0 1 1" preserveAspectRatio="none" className="block w-full h-full" style={{ overflow: 'visible' }}>
      <path d="M0 0 H1.1 V1 H1 A1 1 0 0 0 0 0 Z" fill={NOTCH_BG} />
    </svg>
  </motion.div>
);

/* ─── Artwork ─── */
export const Artwork = ({ size = 52 }: { size?: number }) => (
  <div className="rounded-xl overflow-hidden flex-shrink-0 relative"
    style={{ width: size, height: size, background: 'linear-gradient(135deg,#3b1d6e,#0f3460 55%,#e94560)' }}>
    <div className="absolute inset-0 flex items-center justify-center text-white/70"><INote /></div>
    <div className="absolute inset-0 rounded-xl ring-1 ring-white/[0.1]" />
  </div>
);
