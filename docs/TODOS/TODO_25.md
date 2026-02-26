# TODO_25: TraceView component (W4.4)

Status: DONE

Completed: TraceView at `src/components/trace-view/index.tsx`; composes Timeline, TokenMetricsCards, NodeInspector, EditCorrection, FeedbackButtons, ExportGoldSet; App and Storybook import from `@/components/trace-view`; tests moved to `src/components/trace-view/index.test.tsx`; old dashboard TraceView removed.

## Context

- Links: [PHASE_4.md](../PHASE_4.md) (W4.4), [VISUAL_WORK_ITEM.md](../VISUAL_WORK_ITEM.md), reference [ui-refs/dashboard.png](../ui-refs/dashboard.png)
- W4.4 dashboard visual: Trace detail panel that composes Timeline, TokenMetricsCards, NodeInspector, EditCorrection, FeedbackButtons, ExportGoldSet.

## Description

Implement or overwrite **TraceView** so it matches the reference: the trace-detail view with a heading (e.g. "Trace detail panel"), Timeline, TokenMetricsCards, NodeInspector, and feedback/correction/export controls. Use path `src/components/trace-view/index.tsx`. Compose components from `@/components/timeline`, `@/components/token-metrics-cards`, `@/components/node-inspector`, etc.

## Expected Inputs

- Reference image: `docs/ui-refs/dashboard.png`.
- Trace data (trace_id, steps, nodes, response, token/cost data); components from TODO_19–24.

## Expected Outputs

- Component at `src/components/trace-view/index.tsx` exporting TraceView.
- Renders heading, Timeline, TokenMetricsCards, NodeInspector, EditCorrection, FeedbackButtons, ExportGoldSet in layout matching reference.
- `yarn test`, `yarn typecheck` pass.

## Acceptance Criteria

- [ ] Component lives at `src/components/trace-view/index.tsx`.
- [ ] Renders "Trace detail panel" (or equivalent) heading; short trace ID (e.g. last 6 chars) if shown.
- [ ] Composes Timeline, TokenMetricsCards, NodeInspector with correct data.
- [ ] Composes EditCorrection, FeedbackButtons, ExportGoldSet; layout and order match reference.
- [ ] Section order and proportions match reference image.
- [ ] Existing tests and typecheck pass.

## Test Plan

- Unit test: render TraceView with mock trace; assert heading and key child sections present.
- Gates: `yarn test`, `yarn typecheck`.

## Files (expected)

- `src/components/trace-view/index.tsx` (create or overwrite).

## Notes / Non-goals

- API wiring for feedback/correction/export can be in parent (App) or passed as props; this TODO is composition and layout.
