# TODO_08: Provider Pricing Config & Cost Calculator

Status: DONE

**What changed:** Added `src/dashboard/cost/types.ts` (ProviderId, ProviderPricing, PricingConfig), `pricing.ts` (DEFAULT_PRICING for Groq, Anthropic, OpenAI with documented sources), and `computeCost.ts` (pure computeCost(provider, inputTokens, outputTokens, config?)). Tests: zero tokens → 0, positive cost, linearity in input/output, smoke per provider, custom config. All 37 tests and typecheck pass.

## Context

- Links: [PHASE_4.md](../PHASE_4.md), [PRD.md](../PRD.md)
- W4.2 (PHASE_4.md): "Create real-time cost calculators based on provider API pricing (Groq, Anthropic, OpenAI)."
- Phase 4 DoD: "FinOps Accuracy: Reported cost metrics match the actual provider billing within a 2% margin of error."
- PRD US_02: "Real-time 'Tokens Saved' and 'Cost Avoidance' metrics are calculated and piped to the Dashboard."

## Description

Implement a **provider-agnostic cost calculator** and **pricing configuration** for Groq, Anthropic, and OpenAI. The calculator accepts a provider id, input token count, and output token count, and returns an estimated cost in dollars. Pricing data (per 1M input/output tokens) is configurable so it can be updated when provider APIs change. No UI in this TODO — pure logic and types; the dashboard will consume this in a later TODO.

## Expected Inputs

- Provider identifier (e.g. `'groq' | 'anthropic' | 'openai'` or extended set).
- Input token count (number).
- Output token count (number).
- Optional: pricing config override (for tests or env-specific rates).

## Expected Outputs

- A shared type for supported providers and a pricing shape (e.g. input price per 1M tokens, output price per 1M tokens).
- A default pricing config (e.g. in a constants or config module) for Groq, Anthropic, OpenAI with documented source (e.g. provider docs / date).
- A pure function `computeCost(provider, inputTokens, outputTokens, pricingConfig?)` that returns a number (cost in dollars).
- Unit tests: property-based where sensible (e.g. cost scales linearly with tokens; zero tokens → zero cost); plus at least one value-based smoke test per provider.
- `yarn test` and `yarn typecheck` pass.

## Acceptance Criteria

- [x] Types exist for supported providers and pricing (e.g. `ProviderId`, `PricingConfig`, `ProviderPricing`).
- [x] Default pricing config covers Groq, Anthropic, and OpenAI (per-1M input/output; document source).
- [x] `computeCost(provider, inputTokens, outputTokens[, config])` returns a number (dollars); zero tokens yields zero cost.
- [x] Unit tests cover: zero tokens → zero cost; positive tokens → positive cost; cost linear in tokens (or equivalent property); one smoke assertion per provider.
- [x] No UI or React components in this TODO.
- [x] `yarn test` and `yarn typecheck` pass.

## Test Plan

- **Unit (Vitest):** Call `computeCost` with 0,0 → 0. Call with known token counts and default config; assert result is positive and approximately matches hand calculation. Property: for fixed provider, doubling tokens (input or output) roughly doubles the corresponding part of the cost.
- **Gates:** `yarn test`, `yarn typecheck`.

## Files (expected)

- `src/dashboard/cost/` or `src/dashboard/lib/cost/`: types, default pricing config, `computeCost` (e.g. `pricing.ts`, `computeCost.ts`, or single `costCalculator.ts`).
- `src/dashboard/cost/computeCost.test.ts` (or equivalent) for calculator tests.

## Notes / Non-goals

- No API calls to fetch live pricing; use static config. Live pricing can be a future enhancement.
- No dashboard UI or Storybook in this TODO.
- Pricing values should be easy to update (e.g. constants or JSON) when provider rates change.
