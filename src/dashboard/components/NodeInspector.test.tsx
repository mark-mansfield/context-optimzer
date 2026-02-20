import { render, screen, cleanup } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import { NodeInspector } from "./NodeInspector";
import type { InspectorNode } from "./NodeInspector";

beforeEach(cleanup);

const mockNodes: InspectorNode[] = [
  {
    id: "node-1",
    rawText: "Raw context from retrieval",
    rerankedText: "Reranked context after Phase 2",
    score: 0.92,
    status: "kept",
  },
  {
    id: "node-2",
    rawText: "Another raw chunk",
    rerankedText: "Another raw chunk",
    score: 0.3,
    status: "pruned",
  },
];

describe("NodeInspector", () => {
  it("renders raw and reranked labels and text when nodes are provided", () => {
    render(<NodeInspector nodes={mockNodes} />);
    expect(screen.getAllByText("Raw").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Reranked").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Raw context from retrieval")).toBeDefined();
    expect(screen.getByText("Reranked context after Phase 2")).toBeDefined();
  });

  it("renders loading state when loading is true", () => {
    render(<NodeInspector loading />);
    expect(screen.getByRole("status")).toBeDefined();
  });

  it("renders error message when error is provided", () => {
    render(<NodeInspector error="Failed to load nodes" />);
    expect(screen.getByText("Failed to load nodes")).toBeDefined();
  });

  it("prefers error over loading when both are set", () => {
    render(<NodeInspector loading error="Error" />);
    expect(screen.getByText("Error")).toBeDefined();
  });

  it("prefers loading over nodes when loading is true and no error", () => {
    render(<NodeInspector nodes={mockNodes} loading />);
    expect(screen.getByRole("status")).toBeDefined();
  });
});
