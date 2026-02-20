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
        style={{
          padding: "1rem 1.25rem",
          background: "var(--color-bg-surface)",
          border: "1px solid var(--color-danger)",
          borderRadius: "8px",
          color: "var(--color-danger)",
        }}
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
        style={{
          padding: "1.5rem",
          background: "var(--color-bg-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "8px",
          color: "var(--color-text-muted)",
        }}
      >
        Loading…
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div
        style={{
          padding: "1rem 1.25rem",
          background: "var(--color-bg-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "8px",
          color: "var(--color-text-muted)",
        }}
      >
        No nodes to display
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "1rem 1.25rem",
        background: "var(--color-bg-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "8px",
      }}
    >
      {nodes.map((node) => (
        <div
          key={node.id}
          style={{
            marginBottom: nodes.length > 1 ? "1rem" : 0,
            padding: "0.75rem",
            background: "var(--color-bg-muted)",
            borderRadius: "6px",
            borderLeft:
              node.status === "kept"
                ? "3px solid var(--color-success)"
                : node.status === "pruned"
                  ? "3px solid var(--color-danger)"
                  : "3px solid var(--color-border)",
          }}
        >
          <div style={{ marginBottom: "0.5rem" }}>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--color-text-secondary)",
                textTransform: "uppercase",
              }}
            >
              Raw
            </span>
            <p
              style={{
                margin: "0.25rem 0 0",
                fontSize: "0.875rem",
                color: "var(--color-text-primary)",
              }}
            >
              {node.rawText}
            </p>
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--color-text-secondary)",
                textTransform: "uppercase",
              }}
            >
              Reranked
            </span>
            <p
              style={{
                margin: "0.25rem 0 0",
                fontSize: "0.875rem",
                color: "var(--color-text-primary)",
              }}
            >
              {node.rerankedText}
            </p>
          </div>
          {(node.score !== undefined || node.status) && (
            <div
              style={{
                marginTop: "0.5rem",
                fontSize: "0.75rem",
                color: "var(--color-text-secondary)",
              }}
            >
              {node.score !== undefined && (
                <span style={{ marginRight: "0.75rem" }}>Score: {node.score}</span>
              )}
              {node.status && (
                <span
                  style={{
                    color:
                      node.status === "kept"
                        ? "var(--color-success)"
                        : "var(--color-danger)",
                  textTransform: "capitalize",
                  fontWeight: 600,
                }}
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
