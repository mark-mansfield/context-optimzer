export interface TimelineStep {
  id: string;
  label: string;
  status?: "pending" | "active" | "done";
}

export interface TimelineTrace {
  traceId?: string;
  steps?: TimelineStep[];
}

const DEFAULT_STEPS: TimelineStep[] = [
  { id: "retrieval", label: "Retrieval" },
  { id: "rerank", label: "Rerank" },
  { id: "response", label: "Response" },
];

export interface TimelineProps {
  trace?: TimelineTrace | null;
  loading?: boolean;
  error?: string | null;
}

export function Timeline({ trace, loading = false, error = null }: TimelineProps) {
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
        aria-label="Loading trace"
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

  const steps = trace?.steps?.length ? trace.steps : DEFAULT_STEPS;

  return (
    <div
      style={{
        padding: "1rem 1.25rem",
        background: "var(--color-bg-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "8px",
      }}
    >
      <ol
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem 1.5rem",
        }}
      >
        {steps.map((step, index) => (
          <li
            key={step.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--color-text-primary)",
            }}
          >
            <span
              style={{
                width: "1.5rem",
                height: "1.5rem",
                borderRadius: "50%",
                background: "var(--color-accent)",
                color: "var(--color-bg-primary)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              {index + 1}
            </span>
            <span style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem" }}>
              {step.label}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
