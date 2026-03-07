import { describe, expect, it, beforeEach } from "vitest";
import {
  submitCorrection,
  getCorrection,
  clearCorrectionStore,
} from "./correction";

describe("correction API (mock)", () => {
  beforeEach(() => {
    clearCorrectionStore();
  });

  it("submits correction and returns success", async () => {
    const result = await submitCorrection("trace-1", "Corrected answer text");
    expect(result.success).toBe(true);
  });

  it("stores correction by trace_id and returns it via getCorrection", async () => {
    await submitCorrection("trace-abc", "The corrected response.");
    const record = getCorrection("trace-abc");
    expect(record).toBeDefined();
    expect(record!.trace_id).toBe("trace-abc");
    expect(record!.corrected_text).toBe("The corrected response.");
    expect(record!.timestamp).toBeDefined();
    expect(typeof record!.timestamp).toBe("number");
  });

  it("getCorrection returns null for unknown trace_id", () => {
    expect(getCorrection("unknown-trace")).toBeNull();
  });

  it("submitting again for same trace_id overwrites with latest text", async () => {
    await submitCorrection("trace-overwrite", "First correction");
    await submitCorrection("trace-overwrite", "Second correction");
    const record = getCorrection("trace-overwrite");
    expect(record!.corrected_text).toBe("Second correction");
  });
});
