import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { ExportGoldSet } from "./ExportGoldSet";
import { submitFeedback, clearFeedbackStore } from "@/api/feedback";
import { submitCorrection, clearCorrectionStore } from "@/api/correction";

beforeEach(cleanup);

const traces = [
  { trace_id: "t1", query: "Q1", response: "R1" },
  { trace_id: "t2", query: "Q2", response: "R2" },
];

describe("ExportGoldSet", () => {
  it("renders Export to Gold-Set button", () => {
    render(<ExportGoldSet traces={traces} onExport={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: /export to gold-set/i })
    ).toBeDefined();
  });

  it("calls onExport with JSONL string when clicked", () => {
    const onExport = vi.fn();
    render(<ExportGoldSet traces={traces} onExport={onExport} />);
    fireEvent.click(screen.getByRole("button", { name: /export to gold-set/i }));
    expect(onExport).toHaveBeenCalledTimes(1);
    const jsonl = onExport.mock.calls[0][0];
    expect(typeof jsonl).toBe("string");
    const lines = jsonl.trim().split("\n");
    expect(lines).toHaveLength(2);
    const record1 = JSON.parse(lines[0]);
    expect(record1.trace_id).toBe("t1");
    expect(record1.query).toBe("Q1");
    expect(record1.response).toBe("R1");
    expect(record1.exported_at).toBeDefined();
  });

  it("uses corrected response in export when correction exists", async () => {
    clearCorrectionStore();
    const { submitCorrection: sub } = await import("@/api/correction");
    await sub("t1", "Corrected R1");
    const onExport = vi.fn();
    render(<ExportGoldSet traces={traces} onExport={onExport} />);
    fireEvent.click(screen.getByRole("button", { name: /export to gold-set/i }));
    const jsonl = onExport.mock.calls[0][0];
    const lines = jsonl.trim().split("\n");
    const record1 = JSON.parse(lines[0]);
    expect(record1.response).toBe("Corrected R1");
  });

  it("when onlyThumbsUp is true, exports only thumbs-up traces", async () => {
    clearFeedbackStore();
    await submitFeedback("t1", "up");
    await submitFeedback("t2", "down");
    const onExport = vi.fn();
    render(
      <ExportGoldSet
        traces={traces}
        onExport={onExport}
        onlyThumbsUp
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /export to gold-set/i }));
    const jsonl = onExport.mock.calls[0][0];
    const lines = jsonl.trim().split("\n").filter(Boolean);
    expect(lines).toHaveLength(1);
    expect(JSON.parse(lines[0]).trace_id).toBe("t1");
  });
});
