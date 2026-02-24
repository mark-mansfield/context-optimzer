/**
 * Gold-set record format for evaluation benchmarks.
 * Exported as JSONL: one JSON object per line.
 * - trace_id: links to the execution trace
 * - query: user prompt / question
 * - response: model response, or corrected response from TODO_13 when available
 * - exported_at: timestamp of export (minimal metadata)
 */
export interface GoldSetRecord {
  trace_id: string;
  query: string;
  response: string;
  exported_at: number;
}

/** Minimal trace shape required to build a gold-set record. */
export interface TraceForExport {
  trace_id: string;
  query: string;
  response: string;
}

export interface BuildGoldSetOptions {
  /** When true, include only traces that have thumbs-up feedback (TODO_12). */
  onlyThumbsUp?: boolean;
}
