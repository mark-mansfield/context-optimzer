export interface ModelRoutingCardProps {
  /** Model display name. */
  model?: string;
  /** Routing class (e.g. informational | reasoning). */
  routingClass?: "informational" | "reasoning";
  /** Classifier confidence 0–1; shown as percentage when present. */
  routingConfidence?: number;
  /** Optional short rationale from the router. */
  routingReason?: string;
}

function formatConfidence(value: number): string {
  if (value <= 1 && value >= 0) return `${Math.round(value * 100)}%`;
  return String(value);
}

function formatRoutingClass(value: "informational" | "reasoning"): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function ModelRoutingCard({
  model,
  routingClass,
  routingConfidence,
  routingReason,
}: ModelRoutingCardProps) {
  const hasAny = model != null || routingClass != null;
  if (!hasAny) return null;

  return (
    <div
      className="rounded-md border border-border bg-bg-surface px-5 py-4 text-sm text-text-primary"
      role="region"
      aria-label="Model routing"
    >
      <h3 className="mb-2 text-sm font-semibold text-text-primary">Model routing</h3>
      <dl className="flex flex-col gap-1.5 text-sm">
        {model != null && (
          <>
            <dt className="text-xs font-medium text-text-muted">Model</dt>
            <dd className="text-text-primary">{model}</dd>
          </>
        )}
        {routingClass != null && (
          <>
            <dt className="text-xs font-medium text-text-muted">Routing class</dt>
            <dd className="text-text-primary">{formatRoutingClass(routingClass)}</dd>
          </>
        )}
        {routingConfidence != null && (
          <>
            <dt className="text-xs font-medium text-text-muted">Confidence</dt>
            <dd className="text-text-primary">{formatConfidence(routingConfidence)}</dd>
          </>
        )}
        {routingReason != null && routingReason !== "" && (
          <>
            <dt className="text-xs font-medium text-text-muted">Reason</dt>
            <dd className="text-text-primary">{routingReason}</dd>
          </>
        )}
      </dl>
    </div>
  );
}
