import type { ReactNode } from "react";

export interface InspectorNode {
  id: string;
  rawText: string;
  rerankedText: string;
  score?: number;
  status?: "kept" | "pruned";
}

export interface NodeInspectorProps {
  nodes?: InspectorNode[];
  loading?: boolean;
  error?: string | null;
  /** Optional content below the sample chunk in the first column (e.g. FeedbackButtons, ExportGoldSet). */
  sampleChunkExtra?: ReactNode;
  /** Optional content for the Edit correction column (e.g. EditCorrection component). */
  correctionSlot?: ReactNode;
}

export function NodeInspector({
  nodes = [],
  loading = false,
  error = null,
  sampleChunkExtra,
  correctionSlot,
}: NodeInspectorProps) {
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
        aria-label="Loading nodes"
        className="rounded-md border border-border bg-bg-surface p-6 text-text-muted"
      >
        Loading…
      </div>
    );
  }

  const firstNode = nodes[0];
  const sampleChunkText =
    firstNode?.rerankedText ?? firstNode?.rawText ?? "No nodes to display.";
  const relevanceScore = firstNode?.score ?? 0;

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-[1fr_0.4fr]">
      <div className="min-w-0 rounded-md border border-border bg-bg-muted p-3">
        <h4 className="mb-2 text-xs font-semibold text-text-secondary">Sample chunk</h4>
        <p className="text-sm text-text-primary">{sampleChunkText}</p>
        {sampleChunkExtra != null && (
          <div className="mt-3 flex flex-wrap items-center gap-3">{sampleChunkExtra}</div>
        )}
      </div>

      <div className="min-w-0 rounded-md border border-border bg-bg-muted p-3">
        <h4 className="mb-1 text-xs font-semibold text-text-secondary">Score</h4>
        <p className="text-2xl font-bold text-accent">{relevanceScore.toFixed(2)}</p>
        <p className="text-xs text-text-muted">Relevance Score</p>
        <div className="mt-2 h-2 overflow-hidden rounded bg-bg-primary">
          <div
            className="h-full bg-accent"
            style={{
              width: `${Math.min(100, Math.max(0, relevanceScore * 100))}%`,
            }}
          />
        </div>
      </div>

      <div className="min-w-0 col-span-1 rounded-md border border-border bg-bg-muted p-3 md:col-span-2">
        <h4 className="mb-2 text-xs font-semibold text-text-secondary">
          Edit correction
        </h4>
        {correctionSlot ?? <p className="text-sm text-text-muted">—</p>}
      </div>
    </div>
  );
}
