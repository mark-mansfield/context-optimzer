import { render, screen, cleanup } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import { TokenMetricsCards } from "./index";

beforeEach(cleanup);

describe("TokenMetricsCards", () => {
  it("renders Tokens Saved and Tokens Sent cards with values", () => {
    render(<TokenMetricsCards tokensSaved={145} tokensSent={320} />);
    expect(screen.getByText("Tokens Saved")).toBeDefined();
    expect(screen.getByText("Tokens Sent")).toBeDefined();
    expect(screen.getByText("145")).toBeDefined();
    expect(screen.getByText("320")).toBeDefined();
    expect(screen.getByText("vs. previous run")).toBeDefined();
    expect(screen.getByText("Total tokens in prompt")).toBeDefined();
  });

  it("renders loading state when loading is true", () => {
    render(<TokenMetricsCards tokensSaved={0} tokensSent={0} loading />);
    expect(screen.getByRole("status")).toBeDefined();
  });

  it("renders error when error is provided", () => {
    render(<TokenMetricsCards error="Failed to load" />);
    expect(screen.getByText("Failed to load")).toBeDefined();
  });

  it("renders two equal-width cards side-by-side with rounded corners", () => {
    const { container } = render(<TokenMetricsCards tokensSaved={145} tokensSent={320} />);
    const grid = container.querySelector(".grid");
    expect(grid).toBeDefined();
    expect(grid?.classList.contains("sm:grid-cols-2")).toBe(true);
    const cards = container.querySelectorAll(".rounded-md.border");
    expect(cards.length).toBe(2);
  });
});
