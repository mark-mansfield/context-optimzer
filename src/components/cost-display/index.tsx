import { computeCost } from "@/dashboard/cost/computeCost";
import { toFiniteNonNegative } from "@/dashboard/cost/normalize";
import type { ProviderId } from "@/dashboard/cost/types";
import { formatCost, formatTokenCount } from "@/dashboard/lib/format";

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
