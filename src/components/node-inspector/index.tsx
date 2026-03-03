import { useState } from "react";
import { ChevronUp } from "lucide-react";

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
  /** When false, score column is not shown (e.g. retrieval step). Keeps table structure for consistent padding and no layout shift. */
  showScoreColumn?: boolean;
}

export function NodeInspector({
  nodes = [],
  loading = false,
  error = null,
  showScoreColumn = true,
}: NodeInspectorProps) {
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);

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
      <table className="w-full min-w-[400px] table-fixed border-collapse text-left">
        <thead>
          <tr className="border-b border-border">
            <th className={`min-w-0 pb-2 pr-3 text-xs font-semibold text-text-secondary ${showScoreColumn ? "w-full" : "w-28 shrink-0"}`}>
              Context chunk
            </th>
            {showScoreColumn && (
              <th className="w-28 shrink-0 pb-2 pl-0 pr-3 text-left text-xs font-semibold text-text-secondary">
                Score
              </th>
            ) }
          </tr>
        </thead>
        <tbody>
          {nodes.map((node) => {
            const text =
              (node.rerankedText && node.rerankedText.trim() !== ""
                ? node.rerankedText
                : node.rawText) ?? "";
            const hasScore = node.score != null;
            const isKept = node.status === "kept";
            const isExpanded = expandedNodeId === node.id;
            const rowBorder =
              node.status == null
                ? "border-l-4 border-l-border"
                : isKept
                  ? "border-l-4 border-l-success"
                  : "border-l-4 border-l-danger";
            return (
              <tr
                key={node.id}
                className={`border-b border-border ${rowBorder} hover:bg-bg-muted`}
              >
                <td className="p-3">
                  <div className="min-w-0">
                    {isExpanded ? (
                      <>
                        <p className="text-sm text-text-primary whitespace-pre-wrap">
                          {text || "—"}
                        </p>
                        <button
                          type="button"
                          onClick={() => setExpandedNodeId(null)}
                          className="mt-2 flex items-center gap-1 text-text-muted hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset rounded"
                          aria-label="Collapse chunk"
                        >
                          <ChevronUp className="h-4 w-4" aria-hidden />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setExpandedNodeId(node.id)}
                        className="min-w-0 w-full text-left text-sm text-text-primary line-clamp-1 cursor-pointer hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset rounded"
                        aria-label={`View full chunk ${node.id}`}
                      >
                        {text || "—"}
                      </button>
                    )}
                  </div>
                </td>
                {showScoreColumn && (
                  <td className="p-3">
                    <div className="flex items-baseline gap-2">
                      {hasScore ? (
                        <p className="text-lg font-bold text-accent">
                          {node.score!.toFixed(2)}
                        </p>
                      ) : (
                        <span className="text-sm text-text-muted">—</span>
                      )}
                      {node.status != null && (
                        <span
                          className={`text-xs font-medium ${isKept ? "text-success" : "text-danger"}`}
                        >
                          {node.status}
                        </span>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
