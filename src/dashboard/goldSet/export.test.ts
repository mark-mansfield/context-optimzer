import { describe, expect, it, beforeEach } from "vitest";
import { buildGoldSetRecords, goldSetRecordsToJsonl } from "./export";
import {
  submitFeedback,
  getFeedback,
  clearFeedbackStore,
} from "@/api/feedback";
import {
  submitCorrection,
  getCorrection,
  clearCorrectionStore,
} from "@/api/correction";

/** Minimal trace shape for export input. */
const trace = (
  id: string,
  query: string,
  response: string,
  extra?: {
    model?: string;
    routingClass?: "informational" | "reasoning";
    routingConfidence?: number;
    routingReason?: string;
  }
) => ({
  trace_id: id,
  query,
  response,
  ...extra,
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
    const records = buildGoldSetRecords([trace("t1", "What is 2+2?", "4")]);
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
      [trace("t1", "Q1", "R1"), trace("t2", "Q2", "R2")],
      { onlyThumbsUp: false }
    );
    expect(records).toHaveLength(2);
  });

  it("corrected response is used when both feedback and correction exist", async () => {
    await submitFeedback("t1", "up");
    await submitCorrection("t1", "Corrected text");
    const records = buildGoldSetRecords([trace("t1", "Q", "Original")], {
      onlyThumbsUp: true,
    });
    expect(records[0].response).toBe("Corrected text");
  });

  it("copies model, routing_class, routing_confidence, routing_reason from trace when present", () => {
    const records = buildGoldSetRecords([
      trace("t1", "Q", "R", {
        model: "Claude 3.5 Sonnet",
        routingClass: "reasoning",
        routingConfidence: 0.92,
        routingReason: "multi-step reasoning detected",
      }),
    ]);
    expect(records).toHaveLength(1);
    expect(records[0].model).toBe("Claude 3.5 Sonnet");
    expect(records[0].routing_class).toBe("reasoning");
    expect(records[0].routing_confidence).toBe(0.92);
    expect(records[0].routing_reason).toBe("multi-step reasoning detected");
  });

  it("omits routing fields from record when trace has no routing data", () => {
    const records = buildGoldSetRecords([trace("t1", "Q", "R")]);
    expect(records[0].model).toBeUndefined();
    expect(records[0].routing_class).toBeUndefined();
    expect(records[0].routing_confidence).toBeUndefined();
    expect(records[0].routing_reason).toBeUndefined();
  });

  it("goldSetRecordsToJsonl serializes records with routing fields as valid JSONL", () => {
    const records = buildGoldSetRecords([
      trace("t1", "Q", "R", {
        model: "Llama 3.1 8B",
        routingClass: "informational",
        routingConfidence: 0.88,
        routingReason: "Short factual query.",
      }),
    ]);
    const jsonl = goldSetRecordsToJsonl(records);
    const line = jsonl.split("\n")[0];
    const parsed = JSON.parse(line) as Record<string, unknown>;
    expect(parsed.trace_id).toBe("t1");
    expect(parsed.model).toBe("Llama 3.1 8B");
    expect(parsed.routing_class).toBe("informational");
    expect(parsed.routing_confidence).toBe(0.88);
    expect(parsed.routing_reason).toBe("Short factual query.");
  });
});
