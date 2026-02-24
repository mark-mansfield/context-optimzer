/**
 * Mock correction API: submit and get corrected response by trace_id.
 * No real backend or database — in-memory store only.
 * API contract: trace_id, corrected_text, timestamp.
 */

export interface CorrectionRecord {
  trace_id: string;
  corrected_text: string;
  timestamp: number;
}

export interface SubmitCorrectionResult {
  success: boolean;
}

const store = new Map<string, CorrectionRecord>();

export function submitCorrection(
  trace_id: string,
  corrected_text: string
): Promise<SubmitCorrectionResult> {
  const record: CorrectionRecord = {
    trace_id,
    corrected_text,
    timestamp: Date.now(),
  };
  store.set(trace_id, record);
  return Promise.resolve({ success: true });
}

export function getCorrection(trace_id: string): CorrectionRecord | null {
  return store.get(trace_id) ?? null;
}

/** Reset the mock store (for tests). */
export function clearCorrectionStore(): void {
  store.clear();
}
