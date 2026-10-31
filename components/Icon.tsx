import type { IconKey } from '@/lib/content';

const BT_PATH = 'M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z';

export function Icon({ name, className = 'w-5 h-5' }: { name: IconKey; className?: string }) {
  const stroke = {
    fill: 'none', stroke: 'currentColor', strokeWidth: 1.8,
    strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  };
  switch (name) {
    case 'music':
      return (
        <svg viewBox="0 0 24 24" className={className} {...stroke}>
          <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
        </svg>
      );
    case 'lyrics':
      return (
        <svg viewBox="0 0 24 24" className={className} {...stroke}>
          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 0 1-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      );
    case 'weather':
      return (
        <svg viewBox="0 0 24 24" className={className} {...stroke}>
          <path d="M7 18a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 17 8.5a4.5 4.5 0 0 1 .5 9.5H7z" />
        </svg>
      );
    case 'timer':
      return (
        <svg viewBox="0 0 24 24" className={className} {...stroke}>
          <circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2M9 2h6" />
        </svg>
      );
    case 'calendar':
      return (
        <svg viewBox="0 0 24 24" className={className} {...stroke}>
          <rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      );
    case 'battery':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M13 2L4.5 13.5H11L10 22l8.5-11.5H13L13 2z" /></svg>
      );
    case 'bluetooth':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d={BT_PATH} /></svg>
      );
    case 'mini':
      return (
        <svg viewBox="0 0 24 24" className={className} {...stroke}>
          <rect x="3" y="3" width="18" height="18" rx="3" /><path d="M9 5.5h6" strokeWidth={3} />
        </svg>
      );
  }
}
