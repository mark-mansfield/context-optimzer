import { describe, expect, it } from "vitest";
import { computeCost } from "./computeCost";
import type { ProviderId, PricingConfig } from "./types";
import { DEFAULT_PRICING } from "./pricing";

describe("computeCost", () => {
  const providers: ProviderId[] = ["groq", "anthropic", "openai"];

  it("returns 0 when input and output tokens are 0", () => {
    for (const provider of providers) {
      expect(computeCost(provider, 0, 0)).toBe(0);
    }
  });

  it("returns 0 when input and output tokens are 0 with custom config", () => {
    const config: PricingConfig = {
      groq: { inputPerM: 1, outputPerM: 2 },
      anthropic: { inputPerM: 3, outputPerM: 15 },
      openai: { inputPerM: 2.5, outputPerM: 10 },
    };
    for (const provider of providers) {
      expect(computeCost(provider, 0, 0, config)).toBe(0);
    }
  });

  it("returns positive cost for positive token counts", () => {
    for (const provider of providers) {
      const cost = computeCost(provider, 1000, 500);
      expect(cost).toBeGreaterThan(0);
    }
  });

  it("cost scales linearly with input tokens for fixed provider", () => {
    const provider: ProviderId = "openai";
    const c1 = computeCost(provider, 1_000_000, 0);
    const c2 = computeCost(provider, 2_000_000, 0);
    expect(c2).toBeGreaterThan(0);
    expect(c1).toBeGreaterThan(0);
    const ratio = c2 / c1;
    expect(ratio).toBeCloseTo(2, 5);
  });

  it("cost scales linearly with output tokens for fixed provider", () => {
    const provider: ProviderId = "openai";
    const c1 = computeCost(provider, 0, 1_000_000);
    const c2 = computeCost(provider, 0, 2_000_000);
    expect(c2).toBeGreaterThan(0);
    expect(c1).toBeGreaterThan(0);
    const ratio = c2 / c1;
    expect(ratio).toBeCloseTo(2, 5);
  });

  it("smoke: groq with 1M in and 1M out uses default pricing", () => {
    const cost = computeCost("groq", 1_000_000, 1_000_000);
    const expected =
      DEFAULT_PRICING.groq.inputPerM + DEFAULT_PRICING.groq.outputPerM;
    expect(cost).toBeCloseTo(expected, 10);
  });

  it("smoke: anthropic with 1M in and 1M out uses default pricing", () => {
    const cost = computeCost("anthropic", 1_000_000, 1_000_000);
    const expected =
      DEFAULT_PRICING.anthropic.inputPerM + DEFAULT_PRICING.anthropic.outputPerM;
    expect(cost).toBeCloseTo(expected, 10);
  });

  it("smoke: openai with 1M in and 1M out uses default pricing", () => {
    const cost = computeCost("openai", 1_000_000, 1_000_000);
    const expected =
      DEFAULT_PRICING.openai.inputPerM + DEFAULT_PRICING.openai.outputPerM;
    expect(cost).toBeCloseTo(expected, 10);
  });

  it("uses custom config when provided", () => {
    const config: PricingConfig = {
      groq: { inputPerM: 0.1, outputPerM: 0.2 },
      anthropic: { inputPerM: 3, outputPerM: 15 },
      openai: { inputPerM: 2.5, outputPerM: 10 },
    };
    const cost = computeCost("groq", 1_000_000, 2_000_000, config);
    expect(cost).toBeCloseTo(0.1 + 0.4, 10);
  });

  it("returns 0 when token counts are NaN or negative (hardened)", () => {
    expect(computeCost("groq", NaN, 0)).toBe(0);
    expect(computeCost("groq", 0, NaN)).toBe(0);
    expect(computeCost("groq", -100, 0)).toBe(0);
    expect(computeCost("groq", 0, -50)).toBe(0);
  });

  it("returns 0 when provider is not in config (hardened)", () => {
    const cost = computeCost(
      "unknown" as ProviderId,
      1_000_000,
      1_000_000
    );
    expect(cost).toBe(0);
  });
});
