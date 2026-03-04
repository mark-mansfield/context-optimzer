import { History, Pin, PinOff, X } from "lucide-react";
import type { ProviderId } from "@/dashboard/cost/types";
import { ModelBadge } from "@/components/model-badge";
import type { TraceHistoryItem } from "./types";

export interface HistoryPanelHeaderProps {
  embedded: boolean;
  onEmbedToggle?: () => void;
  onClose?: () => void;
}

export function HistoryPanelHeader({
  embedded,
  onEmbedToggle,
  onClose,
}: HistoryPanelHeaderProps) {
  return (
    <div className="flex h-17 shrink-0 items-center justify-between gap-2 border-b border-border px-4 ">
      <h2 className="flex items-center gap-2 text-sm font-medium text-text-primary">
        <History className="size-4 shrink-0" aria-hidden />
        Trace history
      </h2>
      <div className="flex items-center gap-1">
        {onEmbedToggle && (
          <button
            type="button"
            onClick={onEmbedToggle}
            aria-label={embedded ? "Unpin from sidebar" : "Pin to sidebar"}
            className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-bg-muted hover:text-text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden"
          >
            {embedded ? (
              <PinOff className="size-4" aria-hidden />
            ) : (
              <Pin className="size-4" aria-hidden />
            )}
          </button>
        )}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-bg-muted hover:text-text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden"
          >
            <X className="size-4" aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}

export interface HistoryPanelProps {
  traces: TraceHistoryItem[];
  selectedTraceId: string | null;
  onSelectTrace: (traceId: string) => void;
  embedded: boolean;
  onEmbedToggle?: () => void;
  onClose?: () => void;
}

export function HistoryPanel({
  traces,
  selectedTraceId,
  onSelectTrace,
  embedded,
  onEmbedToggle,
  onClose,
}: HistoryPanelProps) {
  return (
    <aside
      className={`flex h-full flex-col gap-4 border-r border-border bg-bg-surface ${
        embedded ? "py-0" : null
      }`}
      aria-label="Trace history"
    >
      <HistoryPanelHeader
        embedded={embedded}
        onEmbedToggle={onEmbedToggle}
        onClose={onClose}
      />
      <ul className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 pb-4">
        {traces.map((t) => (
          <li key={t.trace_id}>
            <button
              type="button"
              onClick={() => onSelectTrace(t.trace_id)}
              className={`flex w-full items-center gap-2 rounded px-2 py-2 text-left text-sm transition-colors hover:bg-bg-muted ${
                selectedTraceId === t.trace_id
                  ? "bg-accent/15 font-medium ring-1 ring-inset ring-accent/40"
                  : ""
              }`}
            >
              <span className="w-[20%] min-w-0 shrink-0 truncate font-mono text-accent">
                {t.trace_id.slice(-6)}
              </span>
              <span className="min-w-0 flex-1 truncate">{t.query}</span>
              <ModelBadge
                model={t.model}
                provider={t.provider as ProviderId | undefined}
              />
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
