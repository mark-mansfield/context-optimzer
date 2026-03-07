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
  /** Model display name (routing debug). */
  model?: string;
  /** Routing class (e.g. informational | reasoning); snake_case for export. */
  routing_class?: string;
  /** Classifier confidence 0–1. */
  routing_confidence?: number;
  /** Optional router rationale. */
  routing_reason?: string;
}

/** Minimal trace shape required to build a gold-set record. */
export interface TraceForExport {
  trace_id: string;
  query: string;
  response: string;
  /** Model display name (routing debug). */
  model?: string;
  /** Routing class (e.g. informational | reasoning). */
  routingClass?: "informational" | "reasoning";
  /** Classifier confidence 0–1. */
  routingConfidence?: number;
  /** Optional router rationale. */
  routingReason?: string;
}

export interface BuildGoldSetOptions {
  /** When true, include only traces that have thumbs-up feedback (TODO_12). */
  onlyThumbsUp?: boolean;
}
