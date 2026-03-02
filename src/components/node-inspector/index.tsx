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
  /** Optional content below the first chunk (e.g. FeedbackButtons). */
  sampleChunkExtra?: ReactNode;
}

export function NodeInspector({
  nodes = [],
  loading = false,
  error = null,
  sampleChunkExtra,
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

  if (nodes.length === 0) {
    return (
      <div className="rounded-md border border-border bg-bg-muted p-6 text-center text-sm text-text-muted">
        No nodes to display.
      </div>
    );
  }

  return (
    <div className="min-w-0 overflow-x-auto">
      <table className="w-full min-w-[400px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border">
            <th className="pb-2 pr-3 text-xs font-semibold text-text-secondary">
              Context chunk
            </th>
            <th className="w-[22%] max-w-[140px] pb-2 text-xs font-semibold text-text-secondary">
              Score
            </th>
          </tr>
        </thead>
        <tbody>
          {nodes.map((node, index) => {
            const text =
              node.rerankedText ?? node.rawText ?? "";
            const score = node.score ?? 0;
            const isKept = node.status === "kept";
            const rowBorder = isKept
              ? "border-l-4 border-l-success"
              : "border-l-4 border-l-danger";
            return (
              <tr
                key={node.id}
                className={`border-b border-border ${rowBorder}`}
              >
                <td className="py-3 pr-3 align-top">
                  <div className="min-w-0">
                    <p className="text-sm text-text-primary line-clamp-3">
                      {text || "—"}
                    </p>
                    {index === 0 && sampleChunkExtra != null && (
                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        {sampleChunkExtra}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3 pr-3 align-top">
                  <p className="text-lg font-bold text-accent">
                    {score.toFixed(2)}
                  </p>
                  <p className="text-xs text-text-muted">Relevance</p>
                  <div className="mt-1 h-2 overflow-hidden rounded bg-bg-primary">
                    <div
                      className={`h-full ${isKept ? "bg-success" : "bg-danger"}`}
                      style={{
                        width: `${Math.min(100, Math.max(0, score * 100))}%`,
                      }}
                    />
                  </div>
                  {node.status != null && (
                    <span
                      className={`mt-1 inline-block text-xs font-medium ${isKept ? "text-success" : "text-danger"}`}
                    >
                      {node.status}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
