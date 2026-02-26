import { ArrowLeftRight, Database } from "lucide-react";

export interface TokenMetricsCardsProps {
  /** Tokens saved vs previous run (e.g. 145). */
  tokensSaved?: number;
  /** Total tokens in prompt / sent (e.g. 320). */
  tokensSent?: number;
  loading?: boolean;
  error?: string | null;
}

export function TokenMetricsCards({
  tokensSaved = 0,
  tokensSent = 0,
  loading = false,
  error = null,
}: TokenMetricsCardsProps) {
  if (error) {
    return (
      <div
        role="alert"
        className="rounded-md border border-danger bg-bg-surface px-5 py-4 text-danger"
      >
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div
        role="status"
        aria-label="Loading token metrics"
        className="flex gap-4 rounded-md border border-border bg-bg-surface p-5 text-text-muted"
      >
        Loading…
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-md border border-border bg-bg-surface px-5 py-4 shadow-sm">
        <div className="flex items-center gap-2 text-text-primary">
          <Database className="h-5 w-5 text-accent" aria-hidden />
          <span className="text-sm font-semibold">Tokens Saved</span>
        </div>
        <p className="mt-2 text-2xl font-bold text-text-primary">{tokensSaved}</p>
        <p className="text-xs text-text-muted">vs. previous run</p>
      </div>
      <div className="rounded-md border border-border bg-bg-surface px-5 py-4 shadow-sm">
        <div className="flex items-center gap-2 text-text-primary">
          <ArrowLeftRight className="h-5 w-5 text-accent" aria-hidden />
          <span className="text-sm font-semibold">Tokens Sent</span>
        </div>
        <p className="mt-2 text-2xl font-bold text-text-primary">{tokensSent}</p>
        <p className="text-xs text-text-muted">Total tokens in prompt</p>
      </div>
    </div>
  );
}
