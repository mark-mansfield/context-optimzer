import { buildGoldSetRecords, goldSetRecordsToJsonl } from "@/dashboard/goldSet/export";
import type { TraceForExport } from "@/dashboard/goldSet/types";
import { Button } from "@/components/ui/button";

export interface ExportGoldSetProps {
  traces: TraceForExport[];
  /** Called with the JSONL string; when provided, caller can save to file. When omitted, component triggers a download. */
  onExport?: (jsonl: string) => void;
  /** When true, include only traces with thumbs-up feedback (TODO_12). */
  onlyThumbsUp?: boolean;
}

export function ExportGoldSet({
  traces,
  onExport,
  onlyThumbsUp = false,
}: ExportGoldSetProps) {
  function handleClick() {
    const records = buildGoldSetRecords(traces, { onlyThumbsUp });
    const jsonl = goldSetRecordsToJsonl(records);
    if (onExport) {
      onExport(jsonl);
      return;
    }
    const blob = new Blob([jsonl], { type: "application/x-ndjson" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gold-set-${Date.now()}.jsonl`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      size="sm"
      variant="default"
      aria-label="Export to Gold-Set"
    >
      Export to Gold-Set
    </Button>
  );
}
