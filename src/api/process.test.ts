import { describe, expect, it, beforeEach } from "vitest";
import {
  processQuery,
  getTrace,
  listTraces,
  clearProcessStore,
} from "./process";

describe("process API (mock)", () => {
  beforeEach(() => {
    clearProcessStore();
  });

  it("processQuery returns a trace with trace_id, query, response", async () => {
    const trace = await processQuery("What is the capital of France?");
    expect(trace.trace_id).toBeDefined();
    expect(typeof trace.trace_id).toBe("string");
    expect(trace.trace_id.length).toBeGreaterThan(0);
    expect(trace.query).toBe("What is the capital of France?");
    expect(trace.response).toBeDefined();
    expect(typeof trace.response).toBe("string");
  });

  it("processQuery returns TraceView shape: traceId, steps, retrievalNodes, nodes", async () => {
    const trace = await processQuery("Hello");
    expect(trace.traceId).toBe(trace.trace_id);
    expect(Array.isArray(trace.steps)).toBe(true);
    expect(trace.steps.length).toBeGreaterThan(0);
    trace.steps.forEach((step) => {
      expect(step).toHaveProperty("id");
      expect(step).toHaveProperty("label");
    });
    expect(Array.isArray(trace.retrievalNodes)).toBe(true);
    trace.retrievalNodes?.forEach((node) => {
      expect(node).toHaveProperty("id");
      expect(node).toHaveProperty("rawText");
      expect(node).toHaveProperty("rerankedText");
      expect(node.status).toBeUndefined();
      expect(node.score).toBeUndefined();
    });
    expect(Array.isArray(trace.nodes)).toBe(true);
    trace.nodes?.forEach((node) => {
      expect(node).toHaveProperty("id");
      expect(node).toHaveProperty("rawText");
      expect(node).toHaveProperty("rerankedText");
      expect(["kept", "pruned"]).toContain(node.status ?? "kept");
    });
  });

  it("processQuery stores trace so getTrace returns it", async () => {
    const created = await processQuery("Test query");
    const found = getTrace(created.trace_id);
    expect(found).not.toBeNull();
    expect(found!.trace_id).toBe(created.trace_id);
    expect(found!.query).toBe(created.query);
    expect(found!.response).toBe(created.response);
  });

  it("getTrace returns null for unknown trace_id", () => {
    expect(getTrace("unknown-id")).toBeNull();
  });

  it("listTraces returns all stored traces in order", async () => {
    const t1 = await processQuery("First");
    const t2 = await processQuery("Second");
    const list = listTraces();
    expect(list.length).toBe(2);
    expect(list[0].trace_id).toBe(t1.trace_id);
    expect(list[1].trace_id).toBe(t2.trace_id);
    expect(list[0].query).toBe("First");
    expect(list[1].query).toBe("Second");
  });

  it("clearProcessStore removes all traces", async () => {
    await processQuery("One");
    expect(listTraces().length).toBe(1);
    clearProcessStore();
    expect(listTraces().length).toBe(0);
    expect(getTrace("any")).toBeNull();
  });

  it("each processQuery returns a unique trace_id", async () => {
    const a = await processQuery("Q");
    const b = await processQuery("Q");
    expect(a.trace_id).not.toBe(b.trace_id);
  });

  it("processQuery returns trace with model routing fields for routing-step debugging", async () => {
    const trace = await processQuery("How do I return an item?");
    expect(trace.model).toBeDefined();
    expect(typeof trace.model).toBe("string");
    expect(trace.model!.length).toBeGreaterThan(0);
    expect(trace.routingClass).toBeDefined();
    expect(["informational", "reasoning"]).toContain(trace.routingClass);
    expect(trace.routingConfidence).toBeDefined();
    expect(typeof trace.routingConfidence).toBe("number");
    expect(trace.routingConfidence!).toBeGreaterThanOrEqual(0);
    expect(trace.routingConfidence!).toBeLessThanOrEqual(1);
    expect(trace.routingReason).toBeDefined();
    expect(typeof trace.routingReason).toBe("string");
  });
});
