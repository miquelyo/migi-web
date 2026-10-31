/** Logo Migi: sepasang mata putih di kotak hitam, sama seperti maskot di notch. */
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <rect width="32" height="32" rx="9" fill="#070707" />
      <rect x="0.5" y="0.5" width="31" height="31" rx="8.5" fill="none" stroke="rgba(255,255,255,0.14)" />
      <g fill="#fff" style={{ filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.7))' }}>
        <rect x="9" y="9.5" width="4.4" height="13" rx="2.2" />
        <rect x="18.6" y="9.5" width="4.4" height="13" rx="2.2" />
      </g>
    </svg>
  );
}
