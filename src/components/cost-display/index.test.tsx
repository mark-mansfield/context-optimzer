import { render, screen, cleanup } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import { CostDisplay } from "./index";

beforeEach(cleanup);

describe("CostDisplay", () => {
  it("renders provider, token counts, and cost when given valid props", () => {
    render(
      <CostDisplay
        provider="openai"
        inputTokens={1200}
        outputTokens={340}
      />
    );
    expect(screen.getByText(/OpenAI|openai/i)).toBeDefined();
    expect(screen.getByText(/1\.2k|1,200/i)).toBeDefined();
    expect(screen.getByText(/340/)).toBeDefined();
    expect(screen.getByText(/\$[\d.]+/)).toBeDefined();
  });

  it("uses provided cost when cost prop is supplied", () => {
    render(
      <CostDisplay
        provider="anthropic"
        inputTokens={1000}
        outputTokens={200}
        cost={0.005}
      />
    );
    expect(screen.getByText(/\$0\.005/)).toBeDefined();
  });

  it("computes cost when cost prop is not supplied", () => {
    render(
      <CostDisplay provider="groq" inputTokens={1_000_000} outputTokens={0} />
    );
    const costEl = screen.getByText(/\$[\d.]+/);
    expect(costEl.textContent).toMatch(/\$0\.05/);
  });

  it("renders loading state when loading is true", () => {
    render(
      <CostDisplay
        provider="openai"
        inputTokens={0}
        outputTokens={0}
        loading
      />
    );
    expect(screen.getByRole("status")).toBeDefined();
  });

  it("renders error message when error is provided", () => {
    render(
      <CostDisplay
        provider="openai"
        inputTokens={0}
        outputTokens={0}
        error="Cost unavailable"
      />
    );
    expect(screen.getByText("Cost unavailable")).toBeDefined();
  });

  it("prefers error over content when error is set", () => {
    render(
      <CostDisplay
        provider="openai"
        inputTokens={100}
        outputTokens={50}
        error="Failed"
      />
    );
    expect(screen.getByText("Failed")).toBeDefined();
  });

  it("prefers loading over content when loading is true and no error", () => {
    render(
      <CostDisplay
        provider="openai"
        inputTokens={100}
        outputTokens={50}
        loading
      />
    );
    expect(screen.getByRole("status")).toBeDefined();
  });

  it("handles invalid token counts without showing NaN (hardened)", () => {
    render(
      <CostDisplay
        provider="openai"
        inputTokens={Number.NaN}
        outputTokens={Number.NaN}
      />
    );
    expect(screen.getByText(/Input: 0/)).toBeDefined();
    expect(screen.getByText(/Output: 0/)).toBeDefined();
    expect(screen.getByText(/\$0\.00/)).toBeDefined();
    expect(screen.queryByText(/NaN/)).toBeNull();
  });
});
