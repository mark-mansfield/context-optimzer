# TODO_10: Tokens Saved Visualizer (DCO vs Naive RAG)

Status: DONE

**What changed:** Added `TokensSaved.tsx` with `dcoInputTokens`, `naiveRagInputTokens`, optional `provider`/loading/error. Tokens saved = naive − DCO (input-only); cost avoided = `computeCost(provider, inputSaved, 0)` when provider set. Semantic theme tokens; DCO vs Naive line + "N tokens saved (≈ $X avoided)". Added TokensSaved.test.tsx (7 tests) and TokensSaved.stories.tsx (Default, WithCostAvoided, ZeroSaved, Loading, Error). All 51 tests, typecheck, and build-storybook pass.

## Context

- Links: [PHASE_4.md](../PHASE_4.md), [PRD.md](../PRD.md), [TODO_08.md](TODO_08.md), [TODO_09.md](TODO_09.md)
- W4.2 (PHASE_4.md): "Develop a 'Tokens Saved' visualizer comparing the DCO output vs. a standard Naive RAG approach."
- PRD US_02: "Real-time 'Tokens Saved' and 'Cost Avoidance' metrics … piped to the Dashboard."
- **Prerequisite:** TODO_08 (cost calculator) done. Optional: TODO_09 (CostDisplay) for consistency; this component can stand alone and may reuse `computeCost` for cost-avoidance.

## Description

Implement a **TokensSaved** (or **TokensSavedVisualizer**) React component that compares token usage and optional cost between **DCO** (actual) and a **Naive RAG** baseline. For example: "DCO used 2.1k input tokens; Naive RAG would have used 8.5k → **6.4k tokens saved** (≈ $0.012 avoided)." The component is presentational and receives DCO token counts and Naive RAG token counts (and optionally provider for cost calculation) via props. Include a clear visual comparison (e.g. two bars, or a single "saved" metric with optional breakdown). Use semantic theme tokens. Storybook: Default (with saved tokens), Zero saved, Loading, Error. Unit tests for rendered values and states.

## Expected Inputs

- Props: `dcoInputTokens`, `dcoOutputTokens` (or combined), `naiveRagInputTokens` (and optionally `naiveRagOutputTokens`); optional `provider` for cost-avoidance; optional `loading`, `error`.
- Cost calculator from TODO_08 to compute "cost avoided" when provider is provided.

## Expected Outputs

- A `<TokensSaved />` component that displays:
  - DCO token usage (input and/or output).
  - Naive RAG (baseline) token usage.
  - **Tokens saved** (e.g. naive − DCO for input, or as specified by product).
  - Optionally: **Cost avoided** (difference in cost between naive and DCO using `computeCost`).
- Visual comparison (e.g. two horizontal bars or a single "saved" highlight); avoid hard-coded colors — use semantic theme tokens.
- Storybook: **Default** (positive tokens saved), **Zero saved**, **Loading**, **Error**.
- Unit tests: assert tokens saved and optional cost avoided; loading and error states.
- `yarn test`, `yarn typecheck`, `yarn build-storybook` pass.

## Acceptance Criteria

- [x] `TokensSaved` component exists and accepts at least `dcoInputTokens`, `naiveRagInputTokens` (and optional output tokens, provider, loading, error).
- [x] Component computes and displays "tokens saved" (e.g. naive input − DCO input; define consistently).
- [x] When `provider` and token counts allow, component shows "cost avoided" using `computeCost` from TODO_08.
- [x] Visual comparison is clear (e.g. bars or labeled numbers); styling uses semantic theme tokens only.
- [x] Storybook: Default (saved > 0), Zero saved, Loading, Error.
- [x] Unit tests verify tokens-saved value and optional cost-avoided; loading/error rendering.
- [x] `yarn test`, `yarn typecheck`, `yarn build-storybook` pass.

## Test Plan

- **Unit (Vitest + RTL):** Render with known DCO and Naive RAG token counts; assert "tokens saved" text or value. With provider, assert cost-avoided is displayed. Loading and error states.
- **Storybook:** Open TokensSaved stories; verify comparison is readable; check Zero saved and Loading/Error.
- **Gates:** `yarn test`, `yarn typecheck`, `yarn build-storybook`.

## Files (expected)

- `src/dashboard/components/TokensSaved.tsx` (or `TokensSavedVisualizer.tsx`)
- `src/dashboard/components/TokensSaved.stories.tsx`
- `src/dashboard/components/TokensSaved.test.tsx`

## Notes / Non-goals

- No SSE or backend; component is props-driven. Where "Naive RAG" baseline comes from (e.g. backend or heuristic) is out of scope.
- Exact formula for "tokens saved" (input-only vs input+output) should be documented in the component or types; prefer simple (e.g. input tokens saved) for MVP.
- Integration into TraceView or dashboard layout is a separate TODO.
