export interface TimelineStep {
  id: string;
  label: string;
  status?: "pending" | "active" | "done";
  /** Optional timestamp for display (e.g. "08:32"). */
  timestamp?: string;
  /** Optional duration in ms for display (e.g. 45). */
  durationMs?: number;
}

export interface TimelineTrace {
  traceId?: string;
  steps?: TimelineStep[];
}

const DEFAULT_STEPS: TimelineStep[] = [
  { id: "retrieval", label: "Retrieval", timestamp: "08:32", durationMs: 45 },
  { id: "rerank", label: "Rerank", timestamp: "12:35", durationMs: 12 },
  { id: "response", label: "Response", timestamp: "08:33", durationMs: 8 },
];

const TIME_SCALE = [0, 5, 10, 15, 20, 25, 30];

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
        aria-label="Loading trace"
        className="rounded-md border border-border bg-bg-surface p-6 text-text-muted"
      >
        Loading…
      </div>
    );
  }

  const steps = trace?.steps?.length ? trace.steps : DEFAULT_STEPS;
  const stepsWithTiming = steps.map((s, i) => ({
    ...s,
    timestamp: s.timestamp ?? DEFAULT_STEPS[i]?.timestamp ?? "—",
    durationMs: s.durationMs ?? DEFAULT_STEPS[i]?.durationMs ?? 0,
  }));
  const isInteractive = typeof onStepSelect === "function";

  return (
    <div className="rounded-md border border-border bg-bg-surface px-5 py-4">
      <h3 className="mb-3 text-sm font-semibold text-text-primary">Trace Timeline</h3>

      <div className="flex w-full items-stretch gap-1">
        {stepsWithTiming.map((step, index) => {
          const isSelected = selectedStep === step.id;
          return (
            <span key={step.id} className="flex min-w-0 flex-1 items-center gap-1">
              <div
                className={`flex min-w-0 flex-1 flex-col rounded px-3  py-2 text-left text-sm text-text-primary transition-colors ${
                  isInteractive ? "cursor-pointer hover:bg-bg-muted" : ""
                } ${isSelected ? "bg-accent/15 font-medium ring-1 ring-inset ring-accent/40" : "ring-0 border-0 bg-bg-muted"}`}
                role={isInteractive ? "button" : undefined}
                tabIndex={isInteractive ? 0 : undefined}
                onClick={isInteractive ? () => onStepSelect?.(step.id) : undefined}
                onKeyDown={
                  isInteractive
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onStepSelect?.(step.id);
                        }
                      }
                    : undefined
                }
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-semibold">{step.label}</span>
                  <span className="text-xs font-medium shrink-0">{step.durationMs}ms</span>
                </div>
                <span className="text-xs text-text-muted">{step.timestamp}</span>
              </div>
              {index < stepsWithTiming.length - 1 && (
                <span className="shrink-0 px-0.5 text-text-muted" aria-hidden>
                  →
                </span>
              )}
            </span>
          );
        })}
      </div>

      <div className="mt-3 flex w-full gap-1">
        {stepsWithTiming.map((step, index) => (
            <span key={step.id} className="flex min-w-0 flex-1 items-center gap-1">
              <div
                className="h-2 min-w-0 flex-1 overflow-hidden rounded bg-accent/30"
                title={`${step.label} ${step.durationMs}ms`}
              />
              {index < stepsWithTiming.length - 1 && (
                <span className="shrink-0 px-0.5 text-text-muted" aria-hidden>
                  →
                </span>
              )}
            </span>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-xs text-text-muted">
        {TIME_SCALE.map((t) => (
          <span key={t}>{t === 0 ? "0" : `${t}ms`}</span>
        ))}
      </div>
    </div>
  );
}
