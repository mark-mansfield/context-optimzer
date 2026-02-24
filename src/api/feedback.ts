/**
 * Mock feedback API: submit and get up/down votes by trace_id.
 * No real backend or database — in-memory store only.
 * API contract: trace_id, vote, timestamp.
 */

export type FeedbackVote = "up" | "down";

export interface FeedbackRecord {
  trace_id: string;
  vote: FeedbackVote;
  timestamp: number;
}

export interface SubmitFeedbackResult {
  success: boolean;
}

const store = new Map<string, FeedbackRecord>();

export function submitFeedback(
  trace_id: string,
  vote: FeedbackVote
): Promise<SubmitFeedbackResult> {
  const record: FeedbackRecord = {
    trace_id,
    vote,
    timestamp: Date.now(),
  };
  store.set(trace_id, record);
  return Promise.resolve({ success: true });
}

export function getFeedback(trace_id: string): FeedbackRecord | null {
  return store.get(trace_id) ?? null;
}

/** Reset the mock store (for tests). */
export function clearFeedbackStore(): void {
  store.clear();
}
