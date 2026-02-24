import { computeCost } from "@/dashboard/cost/computeCost";
import { toFiniteNonNegative } from "@/dashboard/cost/normalize";
import type { ProviderId } from "@/dashboard/cost/types";
import { formatCost, formatTokenCount } from "@/dashboard/lib/format";

/**
 * Tokens saved = naiveRagInputTokens − dcoInputTokens (input-only for MVP).
 * Cost avoided = cost of those input tokens at the given provider.
 */
export interface TokensSavedProps {
  dcoInputTokens: number;
  naiveRagInputTokens: number;
  dcoOutputTokens?: number;
  naiveRagOutputTokens?: number;
  provider?: ProviderId;
  loading?: boolean;
  error?: string | null;
}

export function TokensSaved({
  dcoInputTokens,
  naiveRagInputTokens,
  provider,
  loading = false,
  error = null,
}: TokensSavedProps) {
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
        aria-label="Loading comparison"
        className="rounded-lg border border-border bg-bg-surface px-5 py-4 text-text-muted"
      >
        Loading…
      </div>
    );
  }

  const dco = toFiniteNonNegative(dcoInputTokens);
  const naive = toFiniteNonNegative(naiveRagInputTokens);
  const inputSaved = Math.max(0, naive - dco);
  const costAvoided =
    provider != null && inputSaved > 0
      ? computeCost(provider, inputSaved, 0)
      : null;

  return (
    <div className="rounded-lg border border-border bg-bg-surface px-5 py-4 text-sm text-text-primary">
      <div className="mb-2">
        <span className="text-text-secondary">DCO input: </span>
        {formatTokenCount(dco)}
        {" · "}
        <span className="text-text-secondary">
          Naive RAG input:{" "}
        </span>
        {formatTokenCount(naive)}
      </div>
      <div className="font-semibold text-success">
        {formatTokenCount(inputSaved)} tokens saved
        {costAvoided != null && costAvoided > 0 && (
          <> (≈ {formatCost(costAvoided)} avoided)</>
        )}
      </div>
    </div>
  );
}
