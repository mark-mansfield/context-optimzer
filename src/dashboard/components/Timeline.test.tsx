import { render, screen, cleanup } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import { Timeline } from "./Timeline";

beforeEach(cleanup);

const mockTrace = {
  traceId: "trace-1",
  steps: [
    { id: "retrieval", label: "Retrieval" },
    { id: "rerank", label: "Rerank" },
    { id: "response", label: "Response" },
  ],
};

describe("Timeline", () => {
  it("renders three step labels when trace is provided", () => {
    render(<Timeline trace={mockTrace} />);
    expect(screen.getByText("Retrieval")).toBeDefined();
    expect(screen.getByText("Rerank")).toBeDefined();
    expect(screen.getByText("Response")).toBeDefined();
  });

  it("renders loading state when loading is true", () => {
    render(<Timeline loading />);
    expect(screen.getByRole("status")).toBeDefined();
  });

  it("renders error message when error is provided", () => {
    render(<Timeline error="Something went wrong" />);
    expect(screen.getByText("Something went wrong")).toBeDefined();
  });

  it("prefers error over loading when both are set", () => {
    render(<Timeline loading error="Failed" />);
    expect(screen.getByText("Failed")).toBeDefined();
  });

  it("prefers loading over trace when loading is true and no error", () => {
    render(<Timeline trace={mockTrace} loading />);
    expect(screen.getByRole("status")).toBeDefined();
  });
});
