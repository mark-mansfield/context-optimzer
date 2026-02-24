import { describe, expect, it, beforeEach } from "vitest";
import { buildGoldSetRecords } from "./export";
import { submitFeedback, getFeedback, clearFeedbackStore } from "@/api/feedback";
import { submitCorrection, getCorrection, clearCorrectionStore } from "@/api/correction";

/** Minimal trace shape for export input. */
const trace = (id: string, query: string, response: string) => ({
  trace_id: id,
  query,
  response,
});

describe("buildGoldSetRecords", () => {
  beforeEach(() => {
    clearFeedbackStore();
    clearCorrectionStore();
  });

  it("returns records with trace_id, query, and response", async () => {
    const records = buildGoldSetRecords([
      trace("t1", "What is 2+2?", "4"),
      trace("t2", "Capital of France?", "Paris"),
    ]);
    expect(records).toHaveLength(2);
    expect(records[0]).toMatchObject({
      trace_id: "t1",
      query: "What is 2+2?",
      response: "4",
    });
    expect(records[0].exported_at).toBeDefined();
    expect(records[1]).toMatchObject({
      trace_id: "t2",
      query: "Capital of France?",
      response: "Paris",
    });
  });

  it("uses corrected response when correction exists for trace_id", async () => {
    await submitCorrection("t1", "The answer is 4 (four).");
    const records = buildGoldSetRecords([
      trace("t1", "What is 2+2?", "4"),
    ]);
    expect(records).toHaveLength(1);
    expect(records[0].response).toBe("The answer is 4 (four).");
  });

  it("uses original response when no correction exists", () => {
    const records = buildGoldSetRecords([
      trace("t1", "Query", "Original response"),
    ]);
    expect(records[0].response).toBe("Original response");
  });

  it("when onlyThumbsUp is true, includes only traces with thumbs-up feedback", async () => {
    await submitFeedback("t1", "up");
    await submitFeedback("t2", "down");
    // t3 has no feedback
    const records = buildGoldSetRecords(
      [
        trace("t1", "Q1", "R1"),
        trace("t2", "Q2", "R2"),
        trace("t3", "Q3", "R3"),
      ],
      { onlyThumbsUp: true }
    );
    expect(records).toHaveLength(1);
    expect(records[0].trace_id).toBe("t1");
  });

  it("when onlyThumbsUp is false or omitted, includes all traces", async () => {
    await submitFeedback("t1", "up");
    await submitFeedback("t2", "down");
    const records = buildGoldSetRecords(
      [
        trace("t1", "Q1", "R1"),
        trace("t2", "Q2", "R2"),
      ],
      { onlyThumbsUp: false }
    );
    expect(records).toHaveLength(2);
  });

  it("corrected response is used when both feedback and correction exist", async () => {
    await submitFeedback("t1", "up");
    await submitCorrection("t1", "Corrected text");
    const records = buildGoldSetRecords(
      [trace("t1", "Q", "Original")],
      { onlyThumbsUp: true }
    );
    expect(records[0].response).toBe("Corrected text");
  });
});
