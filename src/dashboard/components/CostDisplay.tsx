import { computeCost } from "@/dashboard/cost/computeCost";
import { toFiniteNonNegative } from "@/dashboard/cost/normalize";
import type { ProviderId } from "@/dashboard/cost/types";

function formatTokenCount(n: number): string {
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

function formatCost(dollars: number): string {
  if (dollars === 0) return "$0.00";
  const fixed = dollars.toFixed(4);
  const trimmed = parseFloat(fixed).toString();
  const decimals = trimmed.includes(".") ? trimmed.split(".")[1].length : 0;
  const show = Math.min(Math.max(decimals, 2), 4);
  return `$${dollars.toFixed(show)}`;
}

const PROVIDER_LABELS: Record<ProviderId, string> = {
  groq: "Groq",
  anthropic: "Anthropic",
  openai: "OpenAI",
};

export interface CostDisplayProps {
  provider: ProviderId;
  inputTokens: number;
  outputTokens: number;
  cost?: number;
  loading?: boolean;
  error?: string | null;
}

export function CostDisplay({
  provider,
  inputTokens,
  outputTokens,
  cost,
  loading = false,
  error = null,
}: CostDisplayProps) {
  if (error) {
    return (
      <div
        role="alert"
        className="rounded-lg border border-danger bg-bg-surface px-5 py-4 text-danger"
      >
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div
        role="status"
        aria-label="Loading cost"
        className="rounded-lg border border-border bg-bg-surface px-5 py-4 text-text-muted"
      >
        Loading…
      </div>
    );
  }

  const inT = toFiniteNonNegative(inputTokens);
  const outT = toFiniteNonNegative(outputTokens);
  const displayCost =
    cost !== undefined
      ? toFiniteNonNegative(cost)
      : computeCost(provider, inT, outT);
  const label =
    provider in PROVIDER_LABELS
      ? PROVIDER_LABELS[provider as ProviderId]
      : "Unknown";

  return (
    <div className="rounded-lg border border-border bg-bg-surface px-5 py-4 text-sm text-text-primary">
      <span className="font-semibold">{label}</span>
      {" · "}
      Input: {formatTokenCount(inT)}
      {" · "}
      Output: {formatTokenCount(outT)}
      {" · "}
      Cost: {formatCost(displayCost)}
    </div>
  );
}
