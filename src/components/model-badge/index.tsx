import type { ProviderId } from "@/dashboard/cost/types";

const PROVIDER_LABELS: Record<ProviderId, string> = {
  groq: "Groq",
  anthropic: "Anthropic",
  openai: "OpenAI",
};

export interface ModelBadgeProps {
  model?: string;
  provider?: ProviderId;
}

/** Compact pill for trace list: model name (short) or provider when model absent. */
export function ModelBadge({ model, provider }: ModelBadgeProps) {
  const label = model != null
    ? model.split(/\s+/).slice(0, 2).join(" ")
    : provider != null && provider in PROVIDER_LABELS
      ? PROVIDER_LABELS[provider as ProviderId]
      : null;
  if (label == null || label === "") return null;
  return (
    <span
      className="shrink-0 rounded bg-bg-muted px-1.5 py-0.5 text-xs font-medium text-text-secondary"
      title={model ?? (provider != null ? PROVIDER_LABELS[provider as ProviderId] : undefined)}
      aria-label={model != null ? `Model: ${model}` : provider != null ? `Provider: ${PROVIDER_LABELS[provider as ProviderId]}` : undefined}
    >
      {label}
    </span>
  );
}
