export function formatPercentage(score) {
  if (score === null || score === undefined) return '—';
  const pct = score <= 1 ? score * 100 : score;
  return `${pct.toFixed(1)}%`;
}

export function isValidHex(hex) {
  return typeof hex === 'string' && /^#([0-9a-fA-F]{3}){1,2}$/.test(hex);
}

export function getReadableTextColor(hex) {
  if (!isValidHex(hex)) return '#ffffff';
  const c = hex.substring(1);
  const full = c.length === 3 ? c.split('').map((ch) => ch + ch).join('') : c;
  const r = parseInt(full.substring(0, 2), 16);
  const g = parseInt(full.substring(2, 4), 16);
  const b = parseInt(full.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#0a0a0d' : '#ffffff';
}
