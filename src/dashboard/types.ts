/**
 * Minimal trace item for the history list. Data can come from in-memory state
 * or GraphQL later; the history UI only needs this shape.
 */
export interface TraceHistoryItem {
  trace_id: string;
  query: string;
  model?: string;
  provider?: string;
}
