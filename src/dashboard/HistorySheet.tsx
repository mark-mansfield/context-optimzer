import { History } from "lucide-react";
import type { ProviderId } from "@/dashboard/cost/types";
import { ModelBadge } from "@/components/model-badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { TraceHistoryItem } from "./types";

export interface HistorySheetProps {
  traces: TraceHistoryItem[];
  selectedTraceId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTrace: (traceId: string) => void;
}

export function HistorySheet({
  traces,
  selectedTraceId,
  open,
  onOpenChange,
  onSelectTrace,
}: HistorySheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="flex flex-col gap-2 bg-bg-surface border-border"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-sm font-medium text-text-primary">
            <History className="size-4 shrink-0" aria-hidden />
            Trace history
          </SheetTitle>
        </SheetHeader>
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
                <ModelBadge model={t.model} provider={t.provider as ProviderId | undefined} />
              </button>
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
