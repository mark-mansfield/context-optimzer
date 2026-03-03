import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import { TraceView } from "./index";

beforeEach(cleanup);

const mockTrace = {
  traceId: "trace-1",
  steps: [
    { id: "retrieval", label: "Retrieval" },
    { id: "rerank", label: "Rerank" },
    { id: "response", label: "Response" },
  ],
  retrievalNodes: [
    { id: "r1", rawText: "Raw chunk from retrieval (no score yet).", rerankedText: "" },
  ],
  nodes: [
    {
      id: "n1",
      rawText: "Raw text",
      rerankedText: "Reranked text",
      score: 0.9,
      status: "kept" as const,
    },
  ],
};

describe("TraceView", () => {
  it("composes Timeline and Chunk Inspector and shows retrieval raw chunk for default step (retrieval)", () => {
    render(<TraceView trace={mockTrace} />);
    expect(screen.getByText("Retrieval")).toBeDefined();
    expect(screen.getByText("Chunk Inspector")).toBeDefined();
    expect(screen.getByText("Context chunk")).toBeDefined();
    expect(screen.getByText("Raw chunk from retrieval (no score yet).")).toBeDefined();
  });

  it("shows sample chunk when Rerank step is selected", () => {
    render(<TraceView trace={mockTrace} />);
    const rerankButton = screen.getAllByRole("button").find((el) => el.textContent?.includes("Rerank"));
    expect(rerankButton).toBeDefined();
    fireEvent.click(rerankButton!);
    expect(screen.getByText("Reranked text")).toBeDefined();
  });

  it("shows LLM Response panel when Response step is selected and trace has a response", () => {
    const traceWithResponse = { ...mockTrace, response: "The capital of France is Paris." };
    render(<TraceView trace={traceWithResponse} />);
    const responseButton = screen.getAllByRole("button").find((el) => el.textContent?.includes("Response"));
    fireEvent.click(responseButton!);
    expect(screen.getByText("LLM Response")).toBeDefined();
    expect(screen.getByText("The capital of France is Paris.")).toBeDefined();
  });

  it("does not show LLM Response panel when Retrieval step is selected", () => {
    const traceWithResponse = { ...mockTrace, response: "The capital of France is Paris." };
    render(<TraceView trace={traceWithResponse} />);
    expect(screen.queryByText("LLM Response")).toBeNull();
  });

  it("shows no nodes message when Response step is selected and trace has no responseNodes", () => {
    render(<TraceView trace={mockTrace} />);
    const responseButton = screen.getAllByRole("button").find((el) => el.textContent?.includes("Response"));
    expect(responseButton).toBeDefined();
    fireEvent.click(responseButton!);
    expect(screen.getByText("No nodes to display.")).toBeDefined();
  });

  it("shows responseNodes sample chunk when Response step is selected and trace has responseNodes", () => {
    const traceWithResponseNodes = {
      ...mockTrace,
      responseNodes: [
        {
          id: "refund-policy.md:0",
          rawText: "Context used for answer.",
          rerankedText: "Included in prompt.",
          score: 0.9,
          status: "kept" as const,
        },
      ],
    };
    render(<TraceView trace={traceWithResponseNodes} />);
    const responseButton = screen.getAllByRole("button").find((el) => el.textContent?.includes("Response"));
    expect(responseButton).toBeDefined();
    fireEvent.click(responseButton!);
    expect(screen.getByText("Included in prompt.")).toBeDefined();
  });

  it("passes loading to children", () => {
    render(<TraceView trace={mockTrace} loading />);
    expect(screen.getAllByRole("status").length).toBeGreaterThanOrEqual(1);
  });

  it("passes error to children", () => {
    render(<TraceView trace={mockTrace} error="Trace failed" />);
    expect(screen.getAllByText("Trace failed").length).toBeGreaterThanOrEqual(1);
  });
});
