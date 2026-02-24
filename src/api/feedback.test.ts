import { describe, expect, it, beforeEach } from "vitest";
import { submitFeedback, getFeedback, clearFeedbackStore } from "./feedback";

describe("feedback API (mock)", () => {
  beforeEach(() => {
    clearFeedbackStore();
  });

  it("submits feedback and returns success", async () => {
    const result = await submitFeedback("trace-1", "up");
    expect(result.success).toBe(true);
  });

  it("stores feedback by trace_id and returns it via getFeedback", async () => {
    await submitFeedback("trace-abc", "up");
    const record = getFeedback("trace-abc");
    expect(record).toBeDefined();
    expect(record!.trace_id).toBe("trace-abc");
    expect(record!.vote).toBe("up");
    expect(record!.timestamp).toBeDefined();
    expect(typeof record!.timestamp).toBe("number");
  });

  it("getFeedback returns null for unknown trace_id", () => {
    expect(getFeedback("unknown-trace")).toBeNull();
  });

  it("stores down vote and getFeedback returns it", async () => {
    await submitFeedback("trace-down", "down");
    const record = getFeedback("trace-down");
    expect(record!.vote).toBe("down");
  });

  it("submitting again for same trace_id overwrites with latest vote", async () => {
    await submitFeedback("trace-overwrite", "up");
    await submitFeedback("trace-overwrite", "down");
    const record = getFeedback("trace-overwrite");
    expect(record!.vote).toBe("down");
  });
});
