// Battery icon with a proportional fill, drawn in currentColor so each skin's status
// bar can tint it. Pair with the real level from useBattery(). (§8)

export function BatteryGlyph({ level }: Readonly<{ level: number }>) {
  const fill = Math.max(2, Math.round((16 * level) / 100));
  return (
    <svg width="22" height="14" viewBox="0 0 26 14" fill="none" aria-hidden>
      <rect x="1" y="1.5" width="22" height="11" rx="3" stroke="currentColor" strokeWidth="1.4" />
      <rect x="3" y="3.5" width={fill} height="7" rx="1.5" fill="currentColor" />
      <rect x="24" y="5" width="2" height="4" rx="1" fill="currentColor" />
    </svg>
  );
}
