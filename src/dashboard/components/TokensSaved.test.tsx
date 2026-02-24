import { render, screen, cleanup } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import { TokensSaved } from "./TokensSaved";

beforeEach(cleanup);

describe("TokensSaved", () => {
  it("renders DCO and Naive RAG token counts and tokens saved", () => {
    render(
      <TokensSaved
        dcoInputTokens={2100}
        naiveRagInputTokens={8500}
      />
    );
    expect(screen.getByText(/2\.1k|2,100/i)).toBeDefined();
    expect(screen.getByText(/8\.5k|8,500/i)).toBeDefined();
    expect(screen.getByText(/6\.4k|6,400|6400/)).toBeDefined();
    expect(screen.getByText(/saved/i)).toBeDefined();
  });

  it("computes tokens saved as naive minus DCO input", () => {
    render(
      <TokensSaved dcoInputTokens={1000} naiveRagInputTokens={5000} />
    );
    expect(screen.getByText(/4k|4\.0k|4,000|4000/)).toBeDefined();
  });

  it("shows zero saved when DCO and Naive are equal", () => {
    render(
      <TokensSaved dcoInputTokens={3000} naiveRagInputTokens={3000} />
    );
    expect(screen.getByText(/0/)).toBeDefined();
  });

  it("shows cost avoided when provider is provided", () => {
    render(
      <TokensSaved
        dcoInputTokens={1000}
        naiveRagInputTokens={1_000_000}
        provider="openai"
      />
    );
    expect(screen.getByText(/\$[\d.]+/)).toBeDefined();
    expect(screen.getByText(/avoided|saved/i)).toBeDefined();
  });

  it("renders loading state when loading is true", () => {
    render(
      <TokensSaved
        dcoInputTokens={0}
        naiveRagInputTokens={0}
        loading
      />
    );
    expect(screen.getByRole("status")).toBeDefined();
  });

  it("renders error message when error is provided", () => {
    render(
      <TokensSaved
        dcoInputTokens={0}
        naiveRagInputTokens={0}
        error="Comparison unavailable"
      />
    );
    expect(screen.getByText("Comparison unavailable")).toBeDefined();
  });

  it("prefers error over content when error is set", () => {
    render(
      <TokensSaved
        dcoInputTokens={1000}
        naiveRagInputTokens={5000}
        error="Failed"
      />
    );
    expect(screen.getByText("Failed")).toBeDefined();
  });
});
