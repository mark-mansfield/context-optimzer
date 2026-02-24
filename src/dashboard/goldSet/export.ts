import { getFeedback } from "@/api/feedback";
import { getCorrection } from "@/api/correction";
import type { GoldSetRecord, TraceForExport, BuildGoldSetOptions } from "./types";

/**
 * Builds gold-set records from traces using TODO_12 feedback and TODO_13 corrections.
 * - When a correction exists for a trace_id, uses corrected_text as response.
 * - When onlyThumbsUp is true, includes only traces with thumbs-up feedback.
 */
export function buildGoldSetRecords(
  traces: TraceForExport[],
  options?: BuildGoldSetOptions
): GoldSetRecord[] {
  const onlyThumbsUp = options?.onlyThumbsUp ?? false;
  const now = Date.now();
  const result: GoldSetRecord[] = [];

  for (const t of traces) {
    if (onlyThumbsUp) {
      const feedback = getFeedback(t.trace_id);
      if (feedback?.vote !== "up") continue;
    }
    const correction = getCorrection(t.trace_id);
    const response = correction?.corrected_text ?? t.response;
    result.push({
      trace_id: t.trace_id,
      query: t.query,
      response,
      exported_at: now,
    });
  }

  return result;
}

/**
 * Serializes gold-set records to JSONL (one JSON object per line).
 */
export function goldSetRecordsToJsonl(records: GoldSetRecord[]): string {
  return records.map((r) => JSON.stringify(r)).join("\n");
}
