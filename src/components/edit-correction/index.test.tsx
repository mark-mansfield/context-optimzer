import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { EditCorrection } from "./index";

beforeEach(cleanup);

describe("EditCorrection", () => {
  it("renders textarea prefilled with initial response and submit button", () => {
    render(
      <EditCorrection
        traceId="trace-1"
        initialResponse="Original model response"
        onSubmit={vi.fn()}
      />
    );
    const textarea = screen.getByRole("textbox", { name: /corrected response/i });
    expect(textarea).toBeDefined();
    expect((textarea as HTMLTextAreaElement).value).toBe("Original model response");
    expect(screen.getByRole("button", { name: /save correction|edit correction/i })).toBeDefined();
  });

  it("calls onSubmit with traceId and corrected text when user submits", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <EditCorrection
        traceId="trace-abc"
        initialResponse="Original"
        onSubmit={onSubmit}
      />
    );
    const textarea = screen.getByRole("textbox", { name: /corrected response/i });
    fireEvent.change(textarea, { target: { value: "Corrected answer" } });
    fireEvent.click(screen.getByRole("button", { name: /save correction|edit correction/i }));
    expect(onSubmit).toHaveBeenCalledWith("trace-abc", "Corrected answer");
  });

  it("shows loading state when submitting", async () => {
    let resolveSubmit: () => void;
    const onSubmit = vi.fn().mockImplementation(
      () => new Promise<void>((r) => { resolveSubmit = r; })
    );
    render(
      <EditCorrection
        traceId="trace-1"
        initialResponse="Original"
        onSubmit={onSubmit}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /save correction|edit correction/i }));
    await waitFor(() => {
      expect(screen.getByRole("status")).toBeDefined();
    });
    resolveSubmit!();
  });

  it("renders error message when error prop is provided", () => {
    render(
      <EditCorrection
        traceId="trace-1"
        initialResponse="Original"
        onSubmit={vi.fn()}
        error="Failed to save correction"
      />
    );
    expect(screen.getByText("Failed to save correction")).toBeDefined();
  });

  it("persists correction via mock API when onSubmit calls submitCorrection", async () => {
    const { submitCorrection, getCorrection, clearCorrectionStore } = await import(
      "@/api/correction"
    );
    clearCorrectionStore();
    render(
      <EditCorrection
        traceId="trace-persist"
        initialResponse="Original"
        onSubmit={async (tid, text) => {
          await submitCorrection(tid, text);
        }}
      />
    );
    const textarea = screen.getByRole("textbox", { name: /corrected response/i });
    fireEvent.change(textarea, { target: { value: "Corrected by user" } });
    fireEvent.click(screen.getByRole("button", { name: /save correction/i }));
    await waitFor(() => {
      expect(getCorrection("trace-persist")).not.toBeNull();
    });
    const record = getCorrection("trace-persist");
    expect(record!.corrected_text).toBe("Corrected by user");
    expect(record!.trace_id).toBe("trace-persist");
  });
});
