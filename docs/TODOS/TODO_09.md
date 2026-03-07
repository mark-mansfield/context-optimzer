# TODO_09: Cost Display Component (Trace Cost Summary)

Status: DONE

**What changed:** Added `CostDisplay.tsx` with provider, inputTokens, outputTokens, optional cost/loading/error; uses `computeCost` when cost not supplied; formatTokenCount (e.g. 1.2k, 1M) and formatCost ($0.002); semantic theme tokens only. Added CostDisplay.test.tsx (7 tests) and CostDisplay.stories.tsx (Default, Groq, Anthropic, WithExplicitCost, Loading, Error). All 44 tests, typecheck, and build-storybook pass.

## Context

- Links: [PHASE_4.md](../PHASE_4.md), [TODO_08.md](TODO_08.md)
- W4.2 (PHASE_4.md): "Create real-time cost calculators based on provider API pricing (Groq, Anthropic, OpenAI)."
- Phase 4 DoD: "FinOps Accuracy: Reported cost metrics match the actual provider billing within a 2% margin of error."
- **Prerequisite:** TODO_08 (cost calculator and pricing config) must be done. This component consumes `computeCost` and pricing types.

## Description

Implement a **CostDisplay** (or **TraceCostSummary**) React component that shows the estimated cost and token counts for a single trace or request. The component is presentational: it receives provider, input tokens, output tokens (and optionally a precomputed cost) via props and displays a concise summary (e.g. "Provider: Anthropic · Input: 1.2k · Output: 340 · Cost: $0.002"). Use semantic theme tokens for styling. Include Storybook stories for Loading, Default (multiple providers), and Error states. No SSE or backend — props only.

## Expected Inputs

- Props: at minimum `provider`, `inputTokens`, `outputTokens`; optional `cost` (if not provided, use `computeCost` from TODO_08 to derive it).
- Optional: `loading`, `error` for async states.
- Theme tokens from existing dashboard (TODO_04).

## Expected Outputs

- A `<CostDisplay />` component (e.g. `src/dashboard/components/CostDisplay.tsx`) that renders provider name, input/output token counts (formatted, e.g. 1.2k), and cost (formatted, e.g. $0.002).
- Uses `computeCost` from TODO_08 when `cost` is not supplied.
- Styling via semantic CSS custom properties only.
- Storybook: **Loading**, **Default** (e.g. one story per provider or one with multiple examples), **Error**.
- Unit tests: render with mock props; assert displayed cost and token text; loading and error states.
- `yarn test`, `yarn typecheck`, `yarn build-storybook` pass.

## Acceptance Criteria

- [x] `CostDisplay` (or `TraceCostSummary`) exists and accepts `provider`, `inputTokens`, `outputTokens`, and optional `cost`, `loading`, `error`.
- [x] When `cost` is not provided, component uses `computeCost(provider, inputTokens, outputTokens)` to display cost.
- [x] Token counts and cost are human-readable (e.g. 1200 → "1.2k", 0.00234 → "$0.002").
- [x] Styling uses semantic theme tokens only.
- [x] Storybook stories: Loading, Default (at least one provider), Error.
- [x] Unit tests verify displayed values and loading/error rendering.
- [x] `yarn test`, `yarn typecheck`, `yarn build-storybook` pass.

## Test Plan

- **Unit (Vitest + RTL):** Render with fixed provider and token counts; assert cost and token strings appear. Render with loading true and assert loading UI; with error and assert error message.
- **Storybook:** Open CostDisplay stories; verify light/dark via theme; visually check Loading, Default, Error.
- **Gates:** `yarn test`, `yarn typecheck`, `yarn build-storybook`.

## Files (expected)

- `src/dashboard/components/CostDisplay.tsx` (or `TraceCostSummary.tsx`)
- `src/dashboard/components/CostDisplay.stories.tsx`
- `src/dashboard/components/CostDisplay.test.tsx`

## Notes / Non-goals

- No SSE or backend wiring; component is props-driven.
- Integration with TraceView or full dashboard layout is out of scope (can be a later TODO).
- Currency is USD; formatting is minimal (e.g. 2–4 decimal places for cost).
