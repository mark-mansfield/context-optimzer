import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { FeedbackButtons } from "./FeedbackButtons";

beforeEach(cleanup);

describe("FeedbackButtons", () => {
  it("renders thumbs up and thumbs down buttons", () => {
    render(
      <FeedbackButtons
        traceId="trace-1"
        onUp={() => {}}
        onDown={() => {}}
      />
    );
    expect(screen.getByRole("button", { name: /thumbs up/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /thumbs down/i })).toBeDefined();
  });

  it("calls onUp when thumbs up is clicked", () => {
    const onUp = vi.fn();
    render(
      <FeedbackButtons traceId="trace-1" onUp={onUp} onDown={() => {}} />
    );
    fireEvent.click(screen.getByRole("button", { name: /thumbs up/i }));
    expect(onUp).toHaveBeenCalledTimes(1);
  });

  it("calls onDown when thumbs down is clicked", () => {
    const onDown = vi.fn();
    render(
      <FeedbackButtons traceId="trace-1" onUp={() => {}} onDown={onDown} />
    );
    fireEvent.click(screen.getByRole("button", { name: /thumbs down/i }));
    expect(onDown).toHaveBeenCalledTimes(1);
  });

  it("marks thumbs up as selected when currentVote is up", () => {
    render(
      <FeedbackButtons
        traceId="trace-1"
        onUp={() => {}}
        onDown={() => {}}
        currentVote="up"
      />
    );
    const upButton = screen.getByRole("button", { name: /thumbs up/i });
    expect(upButton.getAttribute("aria-pressed")).toBe("true");
    const downButton = screen.getByRole("button", { name: /thumbs down/i });
    expect(downButton.getAttribute("aria-pressed")).toBe("false");
  });

  it("marks thumbs down as selected when currentVote is down", () => {
    render(
      <FeedbackButtons
        traceId="trace-1"
        onUp={() => {}}
        onDown={() => {}}
        currentVote="down"
      />
    );
    const upButton = screen.getByRole("button", { name: /thumbs up/i });
    expect(upButton.getAttribute("aria-pressed")).toBe("false");
    const downButton = screen.getByRole("button", { name: /thumbs down/i });
    expect(downButton.getAttribute("aria-pressed")).toBe("true");
  });

  it("marks neither as selected when currentVote is null", () => {
    render(
      <FeedbackButtons
        traceId="trace-1"
        onUp={() => {}}
        onDown={() => {}}
        currentVote={null}
      />
    );
    expect(
      screen.getByRole("button", { name: /thumbs up/i }).getAttribute("aria-pressed")
    ).toBe("false");
    expect(
      screen.getByRole("button", { name: /thumbs down/i }).getAttribute("aria-pressed")
    ).toBe("false");
  });

  it("renders loading state when loading is true", () => {
    render(
      <FeedbackButtons
        traceId="trace-1"
        onUp={() => {}}
        onDown={() => {}}
        loading
      />
    );
    expect(screen.getByRole("status")).toBeDefined();
  });

  it("renders error message when error is provided", () => {
    render(
      <FeedbackButtons
        traceId="trace-1"
        onUp={() => {}}
        onDown={() => {}}
        error="Feedback failed"
      />
    );
    expect(screen.getByText("Feedback failed")).toBeDefined();
  });
});
