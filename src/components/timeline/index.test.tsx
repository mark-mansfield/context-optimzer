import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { Timeline } from "./index";

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

  it("renders Trace Timeline section label", () => {
    render(<Timeline trace={mockTrace} />);
    expect(screen.getByText("Trace Timeline")).toBeDefined();
  });

  it("calls onStepSelect when a step block is clicked", () => {
    const onStepSelect = vi.fn();
    render(<Timeline trace={mockTrace} selectedStep="retrieval" onStepSelect={onStepSelect} />);
    fireEvent.click(screen.getByText("Rerank"));
    expect(onStepSelect).toHaveBeenCalledWith("rerank");
  });

  it("shows timestamps and durations and 0–30ms scale when using default step timing", () => {
    render(<Timeline trace={mockTrace} />);
    expect(screen.getByText("08:32")).toBeDefined();
    expect(screen.getByText("45ms")).toBeDefined();
    expect(screen.getByText("12ms")).toBeDefined();
    expect(screen.getByText("8ms")).toBeDefined();
    expect(screen.getByText("0")).toBeDefined();
    expect(screen.getByText("30ms")).toBeDefined();
  });
});
