'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { useLang } from '../LangProvider';
import {
  Artwork, Ear, EAR_R, EASE_OUT, Eyes, IChevronLeft, IChevronRight, ILyric, INext,
  IPause, IPlay, IPrev, NOTCH_BG, SPRING, VisBars, WavingHand,
} from './parts';

/* ═══ Konstanta ukuran (sama dengan App.tsx) ═══ */
const H_IDLE = 30, H_LYRIC = 32, H_EXP = 135;
const W_EYES = 150, W_GREET = 150;
const W_MINI = 56, H_MINI = 7, R_MINI = 4;
const W_BATT = 280, H_BATT = 50, BATT_C = 2 * Math.PI * 15;
const W_BT = 280, H_BT = 50;
const BT_ON = '#60a5fa';
const BT_PATH = 'M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z';
const LYRIC_LEAD_MS = 250;

/* ═══ Data demo ═══ */
const SONG = { title: 'Midnight Drive', artist: 'Neon Harbor', album: 'After Hours' };
const DURATION = 96000;
const LINE_MS = 6000;
const LYRICS = [
  'Streetlights bending in the rain', 'Every window glows the same',
  'I keep the radio low', "Counting miles I'll never show",
  'Hold the wheel and let it go', 'Midnight carries what we know',
  'Neon rivers down the glass', 'Every second moving fast',
  'Tell me where the city ends', "Tell me if we'll meet again",
  'Headlights folding into dawn', 'Half the night already gone',
  'Turn the volume up a bit', 'Let the silence fill the rest',
  'When the morning finds us here', "We'll be somewhere warm and clear",
];

type Scene = 'idle' | 'music' | 'lyric' | 'battery' | 'bluetooth' | 'eyes' | 'greet' | 'mini';
const SCENES: Scene[] = ['idle', 'music', 'lyric', 'battery', 'bluetooth', 'eyes', 'greet', 'mini'];
type Slide = 'media' | 'weather' | 'stopwatch' | 'calendar';
const SLIDES: Slide[] = ['media', 'weather', 'stopwatch', 'calendar'];

const fmt = (ms: number) => {
  if (ms <= 0) return '0:00';
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
};
const fmtDate = () => {
  const d = new Date();
  const wd = d.toLocaleDateString('en-US', { weekday: 'short' });
  const mo = d.toLocaleDateString('en-US', { month: 'short' });
  return `${wd} ${d.getDate()} ${mo} ${d.getFullYear()}`;
};
const fmtClock = () =>
  new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

function measureText(text: string) {
  try {
    const c = document.createElement('canvas').getContext('2d');
    if (!c) return text.length * 6.5;
    c.font = "600 12px -apple-system,'Segoe UI',sans-serif";
    return c.measureText(text).width;
  } catch { return text.length * 6.5; }
}

/* ═══ Animasi slide ═══ */
const SLIDE_OFFSET = 42;
const slideVariants: Variants = {
  enter: (dir: number) => ({ x: dir * SLIDE_OFFSET, opacity: 0, filter: 'blur(6px)' }),
  center: {
    x: 0, opacity: 1, filter: 'blur(0px)',
    transition: {
      x: { duration: 0.42, ease: EASE_OUT },
      opacity: { duration: 0.26, ease: 'easeOut', delay: 0.06 },
      filter: { duration: 0.26, delay: 0.06 },
    },
  },
  exit: (dir: number) => ({
    x: dir * -SLIDE_OFFSET, opacity: 0, filter: 'blur(6px)',
    transition: {
      x: { duration: 0.32, ease: EASE_OUT },
      opacity: { duration: 0.16, ease: 'easeIn' },
      filter: { duration: 0.16 },
    },
  }),
};
const SLIDE_CLS = 'absolute inset-0 pt-[34px] pb-[18px] px-12';

/* ═══ Slide isi ═══ */
type MediaProps = {
  hasMedia: boolean; playing: boolean; pos: number; progress: number;
  onPlay: () => void; onPrev: () => void; onNext: () => void; onLyric: () => void; onStart: () => void;
};
function MediaSlide({ hasMedia, playing, pos, progress, onPlay, onPrev, onNext, onLyric, onStart }: MediaProps) {
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex items-center gap-2.5">
        <Artwork size={34} />
        <div className="flex flex-col min-w-0 gap-0.5 flex-1">
          <span className="text-white font-bold leading-snug truncate text-[12px]" style={{ letterSpacing: '-0.025em' }}>
            {hasMedia ? SONG.title : 'No Media'}
          </span>
          <span className="text-white/35 text-[9.5px] leading-snug truncate">
            {hasMedia ? `${SONG.artist} · ${SONG.album}` : 'Open Spotify, YouTube…'}
          </span>
        </div>
        <VisBars playing={hasMedia && playing} small />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-white/25 text-[8px] tabular-nums w-5 text-right shrink-0">{fmt(hasMedia ? pos : 0)}</span>
        <div className="flex-1 h-[2px] rounded-full bg-white/[0.07] overflow-hidden">
          <div className="h-full rounded-full bg-white/55" style={{ width: `${hasMedia ? progress : 0}%`, transition: 'width 0.25s linear' }} />
        </div>
        <span className="text-white/25 text-[8px] tabular-nums w-7 shrink-0">{hasMedia ? `-${fmt(DURATION - pos)}` : '-0:00'}</span>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={e => { e.stopPropagation(); hasMedia ? onLyric() : onStart(); }}
          aria-label="Lyrics"
          className="p-1.5 -my-1 rounded-lg transition-all duration-200 text-white/40 hover:text-white hover:bg-white/[0.08]">
          <ILyric on={false} />
        </button>
        <div className="flex items-center gap-[16px]">
          <button onClick={e => { e.stopPropagation(); onPrev(); }} aria-label="Previous" className="text-white/35 hover:text-white/80 transition-colors duration-150"><IPrev /></button>
          <button onClick={e => { e.stopPropagation(); hasMedia ? onPlay() : onStart(); }} aria-label="Play / pause"
            className="text-white hover:scale-110 active:scale-95 transition-transform duration-150">
            {hasMedia && playing ? <IPause /> : <IPlay />}
          </button>
          <button onClick={e => { e.stopPropagation(); onNext(); }} aria-label="Next" className="text-white/35 hover:text-white/80 transition-colors duration-150"><INext /></button>
        </div>
        <div className="w-7" />
      </div>
    </div>
  );
}

function WeatherSlide() {
  return (
    <div className="flex items-center justify-center gap-4 h-full">
      <span className="text-[34px] leading-none" aria-hidden>⛅</span>
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span className="text-white font-bold tabular-nums text-[26px] leading-none" style={{ letterSpacing: '-0.04em' }}>29°</span>
          <span className="text-white/60 text-[11px] font-semibold">Partly Cloudy</span>
        </div>
        <span className="text-white/35 text-[9.5px]">Jakarta · 74% humidity · 11 km/h</span>
      </div>
    </div>
  );
}

type SwProps = { elapsed: number; running: boolean; laps: number[]; onToggle: () => void; onLap: () => void; onReset: () => void };
function StopwatchSlide({ elapsed, running, laps, onToggle, onLap, onReset }: SwProps) {
  const total = Math.floor(elapsed);
  const m = Math.floor(total / 60000);
  const s = Math.floor((total % 60000) / 1000);
  const cs = Math.floor((total % 1000) / 10);
  const btn = 'h-[22px] px-3 rounded-full text-[10px] font-semibold transition-colors duration-150';
  return (
    <div className="flex flex-col items-center justify-between h-full">
      <div className="flex items-baseline gap-1.5">
        <span className="text-white font-bold tabular-nums text-[26px] leading-none" style={{ letterSpacing: '-0.03em' }}>
          {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
        </span>
        <span className="text-white/45 font-semibold tabular-nums text-[13px] leading-none">.{String(cs).padStart(2, '0')}</span>
        {laps.length > 0 && <span className="ml-2 text-white/30 text-[9px] tabular-nums">Lap {laps.length}</span>}
      </div>
      <div className="flex items-center gap-2">
        <button onClick={e => { e.stopPropagation(); onReset(); }} className={`${btn} bg-white/[0.08] hover:bg-white/[0.16] text-white/70`}>Reset</button>
        <button onClick={e => { e.stopPropagation(); onToggle(); }}
          className={`${btn} ${running ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'}`}>
          {running ? 'Stop' : 'Start'}
        </button>
        <button onClick={e => { e.stopPropagation(); onLap(); }} disabled={!running}
          className={`${btn} bg-white/[0.08] hover:bg-white/[0.16] text-white/70 disabled:opacity-30 disabled:hover:bg-white/[0.08]`}>Lap</button>
      </div>
    </div>
  );
}

type Cal = { month: string; year: number; days: { name: string; num: number; isToday: boolean }[] };
function CalendarSlide({ cal }: { cal: Cal | null }) {
  if (!cal) return null;
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex items-baseline justify-center gap-1.5">
        <span className="text-white font-bold text-[13px] capitalize" style={{ letterSpacing: '-0.02em' }}>{cal.month}</span>
        <span className="text-white/35 text-[11px] font-semibold tabular-nums">{cal.year}</span>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cal.days.map(d => (
          <div key={d.num + d.name}
            className={`flex flex-col items-center gap-[2px] rounded-lg py-[3px] ${d.isToday ? 'bg-white text-black' : 'text-white'}`}>
            <span className={`text-[8px] leading-none uppercase ${d.isToday ? 'text-black/55' : 'text-white/35'}`}>{d.name}</span>
            <span className="text-[12px] font-bold tabular-nums leading-none">{d.num}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══ Komponen utama ═══ */
export default function NotchDemo() {
  const { t } = useLang();

  const [scene, setScene] = useState<Scene>('music');
  const [auto, setAuto] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [canHover, setCanHover] = useState(true);

  const [mediaOn, setMediaOn] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [pos, setPos] = useState(7000);
  const [showLyrics, setShowLyrics] = useState(false);

  const [slide, setSlide] = useState<Slide>('media');
  const [dir, setDir] = useState<1 | -1>(1);

  const [time, setTime] = useState('00:00');
  const [date, setDate] = useState('');
  const [cal, setCal] = useState<Cal | null>(null);

  const [swElapsed, setSwElapsed] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const [swLaps, setSwLaps] = useState<number[]>([]);
  const swStart = useRef(0);
  const swBase = useRef(0);

  const lyricsRef = useRef<HTMLDivElement>(null);
  const wasExp = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(720);

  const expanded = hovered || pinned;

  /* ── hover capability + ukuran stage ── */
  useEffect(() => {
    try { setCanHover(window.matchMedia('(hover: hover)').matches); } catch {}
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  /* ── jam + kalender (client only) ── */
  useEffect(() => {
    const tick = () => { setTime(fmtClock()); setDate(fmtDate()); };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const now = new Date();
    const dow = (now.getDay() + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - dow);
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return {
        name: d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3),
        num: d.getDate(),
        isToday: d.toDateString() === now.toDateString(),
      };
    });
    setCal({ month: now.toLocaleDateString('en-US', { month: 'long' }), year: now.getFullYear(), days });
  }, []);

  /* ── simulasi posisi lagu ── */
  useEffect(() => {
    if (!mediaOn || !playing) return;
    const id = setInterval(() => setPos(p => (p + 200) % DURATION), 200);
    return () => clearInterval(id);
  }, [mediaOn, playing]);

  /* ── stopwatch ── */
  useEffect(() => {
    if (!swRunning) return;
    const id = setInterval(() => setSwElapsed(swBase.current + (performance.now() - swStart.current)), 33);
    return () => clearInterval(id);
  }, [swRunning]);

  const swToggle = () => {
    if (swRunning) {
      setSwElapsed(swBase.current + (performance.now() - swStart.current));
      setSwRunning(false);
    } else {
      swBase.current = swElapsed;
      swStart.current = performance.now();
      setSwRunning(true);
    }
  };
  const swReset = () => { setSwRunning(false); setSwElapsed(0); setSwLaps([]); swBase.current = 0; };
  const swLap = () => { if (swRunning) setSwLaps(p => [...p, swBase.current + (performance.now() - swStart.current)]); };

  /* ── pilih scene ── */
  const applyScene = (s: Scene) => {
    setScene(s);
    setPinned(false);
    const withMedia = s === 'music' || s === 'lyric';
    setMediaOn(withMedia);
    setShowLyrics(s === 'lyric');
    if (withMedia) { setPlaying(true); if (s === 'lyric') setPos(p => (p < 1000 ? 7000 : p)); }
  };

  /* ── auto-cycle ── */
  const sceneRef = useRef<Scene>(scene);
  useEffect(() => { sceneRef.current = scene; }, [scene]);

  useEffect(() => {
    if (!auto || expanded) return;
    const id = setInterval(() => {
      applyScene(SCENES[(SCENES.indexOf(sceneRef.current) + 1) % SCENES.length]);
    }, 4200);
    return () => clearInterval(id);
  }, [auto, expanded]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── lirik aktif ── */
  const lyricIdx = useMemo(() => {
    const i = Math.floor((pos + LYRIC_LEAD_MS) / LINE_MS);
    return Math.min(LYRICS.length - 1, Math.max(0, i));
  }, [pos]);
  const lyricText = LYRICS[lyricIdx];
  const lyricPillW = useMemo(
    () => Math.max(150, Math.min(380, Math.ceil(measureText(lyricText)) + 18 + 8 + 12 + 10 + 34)),
    [lyricText],
  );
  const progress = Math.min(100, (pos / DURATION) * 100);

  const scrollLyrics = (behavior: ScrollBehavior) => {
    const el = lyricsRef.current;
    if (!el) return;
    const ch = el.children[lyricIdx] as HTMLElement | undefined;
    if (ch) el.scrollTo({ top: ch.offsetTop - el.clientHeight / 2 + ch.clientHeight / 2, behavior });
  };
  useEffect(() => { scrollLyrics('smooth'); }, [lyricIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  const isExpLyric = expanded && showLyrics && mediaOn;
  useEffect(() => {
    if (isExpLyric && !wasExp.current) {
      const id = setTimeout(() => scrollLyrics('auto'), 270);
      wasExp.current = true;
      return () => clearTimeout(id);
    }
    if (!isExpLyric) wasExp.current = false;
  }, [isExpLyric]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── state machine (sama seperti App.tsx) ── */
  let state: 'expanded' | 'battery' | 'bluetooth' | 'lyric' | 'mini' | 'greet' | 'eyes' | 'idle' = 'idle';
  if (expanded) state = 'expanded';
  else if (scene === 'battery') state = 'battery';
  else if (scene === 'bluetooth') state = 'bluetooth';
  else if (showLyrics && mediaOn) state = 'lyric';
  else if (scene === 'mini') state = 'mini';
  else if (scene === 'greet') state = 'greet';
  else if (scene === 'eyes') state = 'eyes';

  const lyricMode = showLyrics && mediaOn;
  const W_EXP = lyricMode ? 690 : 370;
  const idleW = mediaOn ? 300 : 150;
  const earSize = state === 'mini' ? 0 : EAR_R;

  const variants = {
    mini: { width: W_MINI, height: H_MINI, borderBottomLeftRadius: R_MINI, borderBottomRightRadius: R_MINI },
    idle: { width: idleW, height: H_IDLE, borderBottomLeftRadius: 19, borderBottomRightRadius: 19 },
    eyes: { width: W_EYES, height: H_IDLE, borderBottomLeftRadius: 19, borderBottomRightRadius: 19 },
    greet: { width: W_GREET, height: H_IDLE, borderBottomLeftRadius: 19, borderBottomRightRadius: 19 },
    lyric: { width: lyricPillW, height: H_LYRIC, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
    battery: { width: W_BATT, height: H_BATT, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
    bluetooth: { width: W_BT, height: H_BT, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
    expanded: { width: W_EXP, height: H_EXP, borderBottomLeftRadius: 26, borderBottomRightRadius: 26 },
  };

  /* ── navigasi slide ── */
  const slideIdx = SLIDES.indexOf(slide);
  const goTo = (p: Slide, d?: 1 | -1) => {
    if (p === slide) return;
    setDir(d ?? (SLIDES.indexOf(p) > slideIdx ? 1 : -1));
    setSlide(p);
  };
  const goNext = (e: React.MouseEvent) => { e.stopPropagation(); goTo(SLIDES[(slideIdx + 1) % SLIDES.length], 1); };
  const goPrev = (e: React.MouseEvent) => { e.stopPropagation(); goTo(SLIDES[(slideIdx - 1 + SLIDES.length) % SLIDES.length], -1); };

  /* ── kontrol media ── */
  const startMedia = () => { setMediaOn(true); setPlaying(true); setPos(7000); };
  const onPlay = () => setPlaying(p => !p);
  const onPrev = () => setPos(0);
  const onNext = () => setPos(p => Math.min(DURATION - 1000, (Math.floor(p / LINE_MS) + 2) * LINE_MS));
  const onLyric = () => setShowLyrics(p => !p);

  /* ── skala supaya muat di layar kecil ── */
  const needW = expanded && lyricMode ? 730 : 430;
  const scale = Math.min(1, Math.max(0.4, width / needW));
  const STAGE_H = 205;

  const battAccent = '#22c55e';
  const hint = canHover ? t.hero.hintHover : t.hero.hintTouch;

  return (
    <div className="w-full">
      {/* ── Desktop mock ── */}
      <div ref={stageRef}
        className="relative w-full overflow-hidden rounded-[28px] border border-white/10 shadow-[0_40px_120px_-30px_rgba(120,100,255,0.35)]"
        style={{
          height: STAGE_H,
          background:
            'radial-gradient(120% 90% at 20% 0%, #2a2160 0%, transparent 55%),' +
            'radial-gradient(100% 90% at 90% 10%, #0d4a6b 0%, transparent 55%),' +
            'radial-gradient(90% 90% at 50% 120%, #7a2a5a 0%, transparent 60%), #0b0b14',
        }}>
        {/* faux window */}
        <div aria-hidden className="absolute left-1/2 bottom-[-40px] -translate-x-1/2 w-[78%] h-[110px] rounded-t-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm">
          <div className="flex gap-1.5 p-3">
            <span className="w-2 h-2 rounded-full bg-white/15" /><span className="w-2 h-2 rounded-full bg-white/15" /><span className="w-2 h-2 rounded-full bg-white/15" />
          </div>
        </div>

        {/* notch */}
        <div className="absolute inset-x-0 top-0 flex justify-center"
          style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
          <motion.div variants={variants} initial="idle" animate={state} transition={SPRING}
            className="relative cursor-default select-none"
            style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
            onMouseEnter={() => { if (canHover) setHovered(true); }}
            onMouseLeave={() => { if (canHover) setHovered(false); }}
            onClick={() => { if (!canHover) setPinned(p => !p); }}>

            <Ear side="left" size={earSize} />
            <Ear side="right" size={earSize} />

            <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: NOTCH_BG, borderRadius: 'inherit' }}>
              <AnimatePresence mode="wait">

                {state === 'mini' && <motion.div key="mini" className="w-full h-full" />}

                {/* BATTERY */}
                {state === 'battery' && (
                  <motion.div key="battery"
                    initial={{ opacity: 0, filter: 'blur(8px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(8px)' }}
                    transition={{ duration: 0.22 }} className="flex items-center gap-3 w-full h-full px-4">
                    <div className="relative flex-shrink-0 w-8 h-8 flex items-center justify-center">
                      <svg viewBox="0 0 36 36" className="absolute inset-0 w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
                        <motion.circle cx="18" cy="18" r="15" fill="none" stroke={battAccent} strokeWidth="2.5"
                          strokeLinecap="round" strokeDasharray={BATT_C}
                          initial={{ strokeDashoffset: BATT_C }} animate={{ strokeDashoffset: BATT_C * (1 - 0.7) }}
                          transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.12 }} />
                      </svg>
                      <motion.svg className="w-3.5 h-3.5 relative z-10" viewBox="0 0 24 24" fill={battAccent}
                        initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 18, delay: 0.1 }}>
                        <path d="M13 2L4.5 13.5H11L10 22l8.5-11.5H13L13 2z" />
                      </motion.svg>
                    </div>
                    <div className="flex flex-col gap-[3px] flex-1 min-w-0">
                      <span className="text-white font-bold text-[12.5px] leading-none truncate" style={{ letterSpacing: '-0.02em' }}>Charging</span>
                      <span className="text-white/40 text-[9.5px] leading-none truncate">Charger connected</span>
                    </div>
                    <span className="text-white font-bold tabular-nums text-[17px] leading-none flex-shrink-0" style={{ letterSpacing: '-0.03em' }}>70%</span>
                  </motion.div>
                )}

                {/* BLUETOOTH */}
                {state === 'bluetooth' && (
                  <motion.div key="bluetooth"
                    initial={{ opacity: 0, filter: 'blur(8px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(8px)' }}
                    transition={{ duration: 0.22 }} className="flex items-center gap-3 w-full h-full px-4">
                    <div className="relative flex-shrink-0 w-8 h-8 flex items-center justify-center">
                      {[0, 1].map(i => (
                        <motion.span key={i} className="absolute inset-0 rounded-full" style={{ border: `1.5px solid ${BT_ON}` }}
                          initial={{ scale: 1, opacity: 0.55 }} animate={{ scale: 2.1, opacity: 0 }}
                          transition={{ duration: 1.1, delay: 0.15 + i * 0.35, repeat: 2, ease: 'easeOut' }} />
                      ))}
                      <motion.span className="absolute inset-0 rounded-full"
                        style={{ background: `${BT_ON}22`, boxShadow: `0 0 14px ${BT_ON}55` }}
                        initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 460, damping: 18 }} />
                      <motion.svg className="w-4 h-4 relative z-10" viewBox="0 0 24 24" fill={BT_ON}
                        initial={{ scale: 0.3, rotate: -25, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 16, delay: 0.08 }}>
                        <path d={BT_PATH} />
                      </motion.svg>
                    </div>
                    <div className="flex flex-col gap-[3px] flex-1 min-w-0">
                      <span className="text-white font-bold text-[12.5px] leading-none truncate" style={{ letterSpacing: '-0.02em' }}>Connected</span>
                      <span className="text-white/45 text-[10px] leading-none truncate">AirBuds Pro · 70%</span>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 24 24" className="flex-shrink-0" fill="none"
                      stroke={BT_ON} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }} />
                    </svg>
                  </motion.div>
                )}

                {/* LYRIC PILL */}
                {state === 'lyric' && (
                  <motion.div key="lyric"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                    className="relative flex items-center gap-2 w-full h-full px-3.5">
                    <div className="flex-shrink-0"><Artwork size={18} /></div>
                    <div className="relative flex-1 min-w-0 h-full flex items-center">
                      <AnimatePresence initial={false} mode="popLayout">
                        <motion.span key={lyricText}
                          initial={{ opacity: 0, y: 6, filter: 'blur(3px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, y: -6, filter: 'blur(3px)' }} transition={{ duration: 0.16, ease: 'easeOut' }}
                          className="block w-full truncate text-white text-[12px] font-semibold leading-none"
                          style={{ letterSpacing: '-0.01em', textShadow: '0 0 12px rgba(255,255,255,0.45), 0 0 28px rgba(255,255,255,0.15)' }}>
                          {lyricText}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <div className="flex-shrink-0"><VisBars playing={playing} small /></div>
                    <div className="absolute left-4 right-4 bottom-[2px] h-[1.5px] rounded-full bg-white/[0.08] overflow-hidden pointer-events-none">
                      <div className="h-full rounded-full bg-white/45" style={{ width: `${progress}%`, transition: 'width 0.3s linear' }} />
                    </div>
                  </motion.div>
                )}

                {/* EYES */}
                {state === 'eyes' && (
                  <motion.div key="eyes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                    className="flex items-center justify-center w-full h-full">
                    <Eyes happy={false} />
                  </motion.div>
                )}

                {/* GREET */}
                {state === 'greet' && (
                  <motion.div key="greet" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                    className="relative flex items-center justify-center w-full h-full">
                    <Eyes happy />
                    <WavingHand />
                  </motion.div>
                )}

                {/* IDLE */}
                {state === 'idle' && (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
                    className="flex items-center w-full h-full px-3 gap-2">
                    {mediaOn ? (
                      <div className="relative grid grid-cols-[1fr_auto_1fr] items-center w-full h-full gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="flex-shrink-0" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.5)' }}><Artwork size={20} /></div>
                          <div className="flex flex-col min-w-0 gap-[2px]">
                            <span className="text-white font-semibold text-[10.5px] leading-none truncate" style={{ letterSpacing: '-0.01em' }}>{SONG.title}</span>
                            <span className="text-white/40 text-[8.5px] leading-none truncate">{SONG.artist}</span>
                          </div>
                        </div>
                        <span className="text-white font-bold tabular-nums leading-none"
                          style={{ fontSize: '16px', letterSpacing: '-0.03em', transform: 'translateY(-1px)' }}>{time}</span>
                        <div className="flex items-center justify-end"><VisBars playing={playing} /></div>
                        <div className="absolute left-[6px] right-[6px] bottom-[2px] h-[1.5px] rounded-full bg-white/[0.08] overflow-hidden pointer-events-none">
                          <div className="h-full rounded-full bg-white/50" style={{ width: `${progress}%`, transition: 'width 0.3s linear' }} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <span className="text-white font-bold tabular-nums leading-none" style={{ fontSize: '15px', letterSpacing: '-0.02em' }}>{time}</span>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* EXPANDED */}
                {state === 'expanded' && (
                  <motion.div key="expanded"
                    initial={{ opacity: 0, filter: 'blur(10px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(10px)' }}
                    transition={{ duration: 0.2 }} className="flex w-full h-full" style={{ overflow: 'hidden' }}>

                    {!lyricMode ? (
                      <div className="relative w-full h-full overflow-hidden">
                        <AnimatePresence initial={false} custom={dir}>
                          {slide === 'media' && (
                            <motion.div key="s-media" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" className={SLIDE_CLS}>
                              <MediaSlide hasMedia={mediaOn} playing={playing} pos={pos} progress={progress}
                                onPlay={onPlay} onPrev={onPrev} onNext={onNext} onLyric={onLyric} onStart={startMedia} />
                            </motion.div>
                          )}
                          {slide === 'weather' && (
                            <motion.div key="s-weather" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" className={SLIDE_CLS}>
                              <WeatherSlide />
                            </motion.div>
                          )}
                          {slide === 'stopwatch' && (
                            <motion.div key="s-sw" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" className={SLIDE_CLS}>
                              <StopwatchSlide elapsed={swElapsed} running={swRunning} laps={swLaps} onToggle={swToggle} onLap={swLap} onReset={swReset} />
                            </motion.div>
                          )}
                          {slide === 'calendar' && (
                            <motion.div key="s-cal" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" className={SLIDE_CLS}>
                              <CalendarSlide cal={cal} />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* panah */}
                        {(['left', 'right'] as const).map(side => (
                          <button key={side} onClick={side === 'left' ? goPrev : goNext}
                            aria-label={side === 'left' ? 'Previous page' : 'Next page'}
                            style={{ top: 'calc(50% - 12px)' }}
                            className={`absolute z-20 ${side === 'left' ? 'left-4' : 'right-4'} w-6 h-6 rounded-full bg-white/[0.08] hover:bg-white/[0.18] active:scale-95 flex items-center justify-center text-white/50 hover:text-white transition-all duration-200`}>
                            {side === 'left' ? <IChevronLeft /> : <IChevronRight />}
                          </button>
                        ))}

                        {/* tanggal + jam */}
                        <div className="absolute inset-x-0 top-2.5 z-10 flex items-baseline justify-center gap-2 pointer-events-none">
                          <span className="text-white/65 text-[11px] font-semibold leading-none">{date}</span>
                          <span className="text-white font-bold text-[12.5px] tabular-nums leading-none" style={{ textShadow: '0 0 10px rgba(255,255,255,0.35)' }}>{time}</span>
                        </div>

                        {/* dots */}
                        <div className="absolute inset-x-0 bottom-[5px] z-10 flex items-center justify-center gap-1">
                          {SLIDES.map(p => (
                            <button key={p} onClick={e => { e.stopPropagation(); goTo(p); }} className="py-1 px-0.5" aria-label={p}>
                              <motion.span className="block h-[3px] rounded-full bg-white" initial={false}
                                animate={{ width: slide === p ? 14 : 3, opacity: slide === p ? 1 : 0.25 }}
                                transition={{ type: 'spring', stiffness: 520, damping: 34 }} />
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* kiri: player */}
                        <div className="flex flex-col h-full flex-shrink-0"
                          style={{ width: 270, padding: '10px 14px 10px 16px', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5">
                              <motion.div className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ border: '1.5px solid', borderColor: 'rgba(255,255,255,0.55) transparent rgba(255,255,255,0.55) rgba(255,255,255,0.55)' }}
                                animate={{ rotate: 360 }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }} />
                              <span className="text-white/25 text-[9.5px] leading-none">{date}</span>
                              <span className="text-white/70 font-semibold text-[9.5px] tabular-nums leading-none">{time}</span>
                            </div>
                            <VisBars playing={playing} small />
                          </div>
                          <div className="flex items-center gap-2.5 mb-1.5">
                            <Artwork size={38} />
                            <div className="flex flex-col min-w-0 gap-0.5 flex-1">
                              <span className="text-white font-bold leading-snug truncate text-[12px]" style={{ letterSpacing: '-0.025em' }}>{SONG.title}</span>
                              <span className="text-white/30 text-[9.5px] leading-snug truncate">{SONG.artist} · {SONG.album}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-white/20 text-[8px] tabular-nums w-5 text-right shrink-0">{fmt(pos)}</span>
                            <div className="flex-1 h-[2px] rounded-full bg-white/[0.07] overflow-hidden">
                              <div className="h-full rounded-full bg-white/55" style={{ width: `${progress}%`, transition: 'width 0.25s linear' }} />
                            </div>
                            <span className="text-white/20 text-[8px] tabular-nums w-7 shrink-0">-{fmt(DURATION - pos)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <button onClick={e => { e.stopPropagation(); onLyric(); }} aria-label="Lyrics"
                              className="p-1.5 rounded-lg transition-all duration-200 text-white bg-white/[0.1] ring-1 ring-white/15">
                              <ILyric on />
                            </button>
                            <div className="flex items-center gap-[16px]">
                              <button onClick={e => { e.stopPropagation(); onPrev(); }} aria-label="Previous" className="text-white/35 hover:text-white/80 transition-colors duration-150"><IPrev /></button>
                              <button onClick={e => { e.stopPropagation(); onPlay(); }} aria-label="Play / pause" className="text-white hover:scale-110 active:scale-95 transition-transform duration-150">
                                {playing ? <IPause /> : <IPlay />}
                              </button>
                              <button onClick={e => { e.stopPropagation(); onNext(); }} aria-label="Next" className="text-white/35 hover:text-white/80 transition-colors duration-150"><INext /></button>
                            </div>
                            <div className="w-7" />
                          </div>
                        </div>

                        {/* kanan: lirik */}
                        <div className="flex-1 h-full relative overflow-hidden">
                          <div className="absolute inset-x-0 top-0 h-10 z-10 pointer-events-none" style={{ background: `linear-gradient(to bottom, ${NOTCH_BG}, transparent)` }} />
                          <div className="absolute inset-x-0 bottom-0 h-10 z-10 pointer-events-none" style={{ background: `linear-gradient(to top, ${NOTCH_BG}, transparent)` }} />
                          <div ref={lyricsRef} className="h-full overflow-y-auto no-scrollbar flex flex-col py-6 px-5 gap-0">
                            {LYRICS.map((line, i) => {
                              const active = i === lyricIdx;
                              const d = Math.abs(i - lyricIdx);
                              const op = active ? 1 : d === 1 ? 0.3 : d === 2 ? 0.13 : 0.05;
                              return (
                                <motion.div key={i} animate={{ opacity: op }} transition={{ duration: 0.35 }} className="py-[5px] px-1">
                                  <p className={`leading-snug transition-all duration-300 ${
                                    active ? 'text-white font-bold text-[14px]' : d === 1 ? 'text-white font-medium text-[12px]' : 'text-white font-normal text-[11px]'}`}
                                    style={active
                                      ? { textShadow: '0 0 20px rgba(255,255,255,0.5), 0 0 44px rgba(255,255,255,0.18)', letterSpacing: '-0.02em' }
                                      : { letterSpacing: '-0.01em' }}>
                                    {line}
                                  </p>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Pilihan scene ── */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2" role="tablist" aria-label="Scenes">
        {SCENES.map(s => (
          <button key={s} role="tab" aria-selected={scene === s}
            onClick={() => { setAuto(false); applyScene(s); }}
            className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium border transition-all duration-200 ${
              scene === s
                ? 'bg-white text-black border-white shadow-[0_0_24px_rgba(255,255,255,0.25)]'
                : 'bg-white/[0.04] text-white/60 border-white/10 hover:text-white hover:bg-white/[0.1]'}`}>
            {t.scenes[s]}
          </button>
        ))}
        <button onClick={() => setAuto(a => !a)} aria-pressed={auto}
          className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium border transition-all duration-200 ${
            auto ? 'border-emerald-400/40 text-emerald-300 bg-emerald-400/10' : 'border-white/10 text-white/50 bg-white/[0.04] hover:text-white'}`}>
          {auto ? '● ' : '○ '}{t.hero.auto}
        </button>
      </div>
      <p className="mt-3 text-center text-[13px] text-white/40">{hint}</p>
    </div>
  );
}
