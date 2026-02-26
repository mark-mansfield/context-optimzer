# TODO_20: TokenMetricsCards component (W4.4)

Status: DONE

Completed: TokenMetricsCards at `src/components/token-metrics-cards/index.tsx`; two cards (Tokens Saved, Tokens Sent) with icons and subtext; TraceView imports from `@/components/token-metrics-cards`; tests moved to `src/components/token-metrics-cards/index.test.tsx`; old dashboard component removed.

## Context

- Links: [PHASE_4.md](../PHASE_4.md) (W4.4), [VISUAL_WORK_ITEM.md](../VISUAL_WORK_ITEM.md), reference [ui-refs/dashboard.png](../ui-refs/dashboard.png)
- W4.4 dashboard visual: two side-by-side cards — Tokens Saved, Tokens Sent (or equivalent).

## Description

Implement or overwrite **TokenMetricsCards** so it matches the reference: two cards in a row, each with icon, large number, and subtext (e.g. "vs. previous run", "Total tokens in prompt"). Use path `src/components/token-metrics-cards/index.tsx`.

## Expected Inputs

- Reference image: `docs/ui-refs/dashboard.png`.
- Token/cost data (tokens saved, tokens sent or equivalent); use placeholders if not yet from backend.

## Expected Outputs

- Component at `src/components/token-metrics-cards/index.tsx` exporting TokenMetricsCards.
- Two cards side-by-side; styling and copy match reference.
- `yarn test`, `yarn typecheck` pass.

## Acceptance Criteria

- [ ] Component lives at `src/components/token-metrics-cards/index.tsx`.
- [ ] Renders two cards in one row (e.g. grid or flex).
- [ ] First card: Tokens Saved (or equivalent), icon, large number, subtext e.g. "vs. previous run".
- [ ] Second card: Tokens Sent (or equivalent), icon, large number, subtext e.g. "Total tokens in prompt".
- [ ] Visual style (spacing, typography) matches reference.
- [ ] Existing tests and typecheck pass.

## Test Plan

- Unit test: render TokenMetricsCards with mock values; assert two cards and labels/numbers present.
- Gates: `yarn test`, `yarn typecheck`.

## Files (expected)

- `src/components/token-metrics-cards/index.tsx` (create or overwrite).

## Notes / Non-goals

- Can reuse existing cost/token logic; this TODO is presentation to match reference.
