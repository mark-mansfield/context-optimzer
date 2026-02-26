import { render, screen, cleanup } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import { NodeInspector } from "./index";
import type { InspectorNode } from "./index";

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
    rerankedText: "Another reranked chunk",
    score: 0.3,
    status: "pruned",
  },
];

describe("NodeInspector", () => {
  it("renders Sample chunk, Score, and Edit correction column headers and content", () => {
    render(<NodeInspector nodes={mockNodes} />);
    expect(screen.getByText("Sample chunk")).toBeDefined();
    expect(screen.getByText("Score")).toBeDefined();
    expect(screen.getByText("Edit correction")).toBeDefined();
    expect(screen.getByText("Reranked context after Phase 2")).toBeDefined();
    expect(screen.getByText("0.92")).toBeDefined();
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

  it("shows No nodes to display when nodes is empty", () => {
    render(<NodeInspector nodes={[]} />);
    expect(screen.getByText("No nodes to display.")).toBeDefined();
  });
});
