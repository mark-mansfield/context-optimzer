import { buildGoldSetRecords, goldSetRecordsToJsonl } from "@/dashboard/goldSet/export";
import type { TraceForExport } from "@/dashboard/goldSet/types";

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
    const blob = new Blob([jsonl], { type: "application/jsonl" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gold-set-${Date.now()}.jsonl`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded bg-accent px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
      aria-label="Export to Gold-Set"
    >
      Export to Gold-Set
    </button>
  );
}
