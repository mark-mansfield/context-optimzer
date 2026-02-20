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
  /** When set, steps are clickable and this step is highlighted. */
  selectedStep?: string;
  /** Called when user clicks a step (only used when trace is shown). */
  onStepSelect?: (stepId: string) => void;
}

export function Timeline({
  trace,
  loading = false,
  error = null,
  selectedStep,
  onStepSelect,
}: TimelineProps) {
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
  const isInteractive = typeof onStepSelect === "function";

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
        {steps.map((step, index) => {
          const isSelected = selectedStep === step.id;
          const content = (
            <>
              <span
                style={{
                  width: "1.5rem",
                  height: "1.5rem",
                  borderRadius: "50%",
                  background: isSelected ? "var(--color-accent)" : "var(--color-bg-muted)",
                  color: isSelected ? "var(--color-bg-primary)" : "var(--color-text-secondary)",
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
            </>
          );
          return (
            <li
              key={step.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "var(--color-text-primary)",
              }}
            >
              {isInteractive ? (
                <button
                  type="button"
                  onClick={() => onStepSelect?.(step.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.25rem 0",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: "inherit",
                    font: "inherit",
                  }}
                >
                  {content}
                </button>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
