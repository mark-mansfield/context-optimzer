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
}

export function NodeInspector({
  nodes = [],
  loading = false,
  error = null,
}: NodeInspectorProps) {
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
        aria-label="Loading nodes"
        className="rounded-lg border border-border bg-bg-surface p-6 text-text-muted"
      >
        Loading…
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-bg-surface px-5 py-4 text-text-muted">
        No nodes to display
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-bg-surface px-5 py-4">
      {nodes.map((node) => (
        <div
          key={node.id}
          className={`rounded-md border-l-[3px] bg-bg-muted p-3 ${
            node.status === "kept"
              ? "border-l-success"
              : node.status === "pruned"
                ? "border-l-danger"
                : "border-l-border"
          }`}
        >
          <div className="mb-2">
            <span className="text-xs font-semibold uppercase text-text-secondary">
              Raw
            </span>
            <p className="mt-1 text-sm text-text-primary">
              {node.rawText}
            </p>
          </div>
          <div className="mb-2">
            <span className="text-xs font-semibold uppercase text-text-secondary">
              Reranked
            </span>
            <p className="mt-1 text-sm text-text-primary">
              {node.rerankedText}
            </p>
          </div>
          {(node.score !== undefined || node.status) && (
            <div className="mt-2 text-xs text-text-secondary">
              {node.score !== undefined && (
                <span className="mr-3">Score: {node.score}</span>
              )}
              {node.status && (
                <span
                  className={`font-semibold capitalize ${
                    node.status === "kept"
                      ? "text-success"
                      : "text-danger"
                  }`}
                >
                  {node.status}
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
