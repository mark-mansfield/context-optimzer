import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import type { TraceHistoryItem } from "./types";
import { HistoryPanel } from "./HistoryPanel";

export type HistoryVariant = "sheet" | "embedded";

export interface HistorySheetProps {
  traces: TraceHistoryItem[];
  selectedTraceId: string | null;
  variant: HistoryVariant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTrace: (traceId: string) => void;
  onEmbedToggle: () => void;
  onCloseEmbedded?: () => void;
}

export function HistorySheet({
  traces,
  selectedTraceId,
  variant,
  open,
  onOpenChange,
  onSelectTrace,
  onEmbedToggle,
  onCloseEmbedded,
}: HistorySheetProps) {
  const panel = (
    <HistoryPanel
      traces={traces}
      selectedTraceId={selectedTraceId}
      onSelectTrace={onSelectTrace}
      embedded={variant === "embedded"}
      onEmbedToggle={onEmbedToggle}
      onClose={
        variant === "embedded" ? onCloseEmbedded : () => onOpenChange(false)
      }
    />
  );

  if (variant === "embedded") {
    return panel;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="flex flex-col gap-2 border-border bg-bg-surface p-0"
        aria-describedby={undefined}
      >
        <SheetTitle className="sr-only">Trace history</SheetTitle>
        <div className="flex flex-1 flex-col overflow-hidden">{panel}</div>
      </SheetContent>
    </Sheet>
  );
}
