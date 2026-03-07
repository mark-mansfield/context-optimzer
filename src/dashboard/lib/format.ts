export function formatTokenCount(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return m % 1 === 0 ? `${m}M` : `${m.toFixed(1)}M`;
  }
  if (n >= 1_000) {
    const k = n / 1_000;
    return k % 1 === 0 ? `${k}k` : `${k.toFixed(1)}k`;
  }
  return String(n);
}

export function formatCost(dollars: number): string {
  if (dollars === 0) return "$0.00";
  const fixed = dollars.toFixed(4);
  const trimmed = parseFloat(fixed).toString();
  const decimals = trimmed.includes(".") ? trimmed.split(".")[1].length : 0;
  const show = Math.min(Math.max(decimals, 2), 4);
  return `$${dollars.toFixed(show)}`;
}
