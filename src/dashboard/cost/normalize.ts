/**
 * Coerces a value to a finite, non-negative number for safe use in token counts and costs.
 * Use when props may come from API/JSON (null, undefined, NaN) or invalid arithmetic.
 */
export function toFiniteNonNegative(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 0) return fallback;
  return n;
}
