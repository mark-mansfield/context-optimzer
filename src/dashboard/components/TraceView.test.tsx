import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import { TraceView } from "./TraceView";

beforeEach(cleanup);

const mockTrace = {
  traceId: "trace-1",
  steps: [
    { id: "retrieval", label: "Retrieval" },
    { id: "rerank", label: "Rerank" },
    { id: "response", label: "Response" },
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
  it("composes Timeline and NodeInspector and shows nodes for default step (retrieval)", () => {
    render(<TraceView trace={mockTrace} />);
    expect(screen.getByText("Retrieval")).toBeDefined();
    expect(screen.getByText("Reranked")).toBeDefined();
    expect(screen.getByText("Raw text")).toBeDefined();
  });

  it("shows nodes when Rerank step is selected", () => {
    render(<TraceView trace={mockTrace} />);
    const rerankButton = screen.getAllByRole("button").find((el) => el.textContent?.includes("Rerank"));
    expect(rerankButton).toBeDefined();
    fireEvent.click(rerankButton!);
    expect(screen.getByText("Raw text")).toBeDefined();
    expect(screen.getByText("Reranked text")).toBeDefined();
  });

  it("shows no nodes when Response step is selected and trace has no responseNodes", () => {
    render(<TraceView trace={mockTrace} />);
    const responseButton = screen.getAllByRole("button").find((el) => el.textContent?.includes("Response"));
    expect(responseButton).toBeDefined();
    fireEvent.click(responseButton!);
    expect(screen.getByText("No nodes to display")).toBeDefined();
  });

  it("shows responseNodes when Response step is selected and trace has responseNodes", () => {
    const traceWithResponseNodes = {
      ...mockTrace,
      responseNodes: [
        {
          id: "resp-1",
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
    expect(screen.getByText("Context used for answer.")).toBeDefined();
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
