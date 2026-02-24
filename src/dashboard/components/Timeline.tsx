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
        aria-label="Loading trace"
        className="rounded-lg border border-border bg-bg-surface p-6 text-text-muted"
      >
        Loading…
      </div>
    );
  }

  const steps = trace?.steps?.length ? trace.steps : DEFAULT_STEPS;
  const isInteractive = typeof onStepSelect === "function";

  return (
    <div className="rounded-lg border border-border bg-bg-surface px-5 py-4">
      <ol className="flex list-none flex-wrap gap-x-6 gap-y-2 p-0 m-0">
        {steps.map((step, index) => {
          const isSelected = selectedStep === step.id;
          const content = (
            <>
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                  isSelected
                    ? "bg-accent text-bg-primary"
                    : "bg-bg-muted text-text-secondary"
                }`}
              >
                {index + 1}
              </span>
              <span className="text-sm text-text-secondary">
                {step.label}
              </span>
            </>
          );
          return (
            <li
              key={step.id}
              className="flex items-center gap-2 text-text-primary"
            >
              {isInteractive ? (
                <button
                  type="button"
                  onClick={() => onStepSelect?.(step.id)}
                  className="flex cursor-pointer items-center gap-2 border-none bg-transparent p-1 font-inherit text-inherit"
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
