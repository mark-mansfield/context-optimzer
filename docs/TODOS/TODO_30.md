# TODO_30: Model badge in trace list (Option D)

Status: TODO

## Context

- Links: [PRD.md](../PRD.md), [PHASE_4.md](../PHASE_4.md), [TODO_28.md](TODO_28.md)
- TODO_28 adds `model` and `routingClass` to the trace. Users want to quickly see which model served each trace in the sidebar list without opening the trace (debugging and cost scanning).

## Description

Add a **model badge** (pill or short label) to each item in the **trace list** (dashboard sidebar). The badge should show a compact indicator of the model used for that trace (e.g. "Llama 3", "Claude", or provider abbreviation). Use trace `model` or `provider` from the trace data; when missing, omit the badge or show a neutral placeholder so existing traces without routing data still render correctly.

## Expected Inputs

- Trace list in dashboard (e.g. Dashboard.tsx or App) that renders traces with trace_id and query.
- Trace objects that may include `model`, `routingClass`, `provider` from TODO_28.

## Expected Outputs

- Each trace list item shows a small model badge (e.g. pill or label) indicating which model served that trace.
- Badge is compact so list remains scannable; tooltip or aria-label for full model name if desired.
- When trace has no model/provider, list item still works without badge or with a neutral label.
- `yarn test`, `yarn typecheck` pass.

## Acceptance Criteria

- [ ] Trace list displays a model badge per trace when data is available.
- [ ] Badge does not break layout or accessibility (focus, contrast, screen readers).
- [ ] Existing tests and typecheck pass; optional visual snapshot update per project policy.
- [ ] No breaking changes to trace list behavior (selection, key, etc.).

## Test Plan

- Unit test: render trace list with traces that have model/provider and without; assert badge presence/absence and content.
- Gates: `yarn test`, `yarn typecheck`.

## Files (expected)

- `src/dashboard/Dashboard.tsx` (or component that renders the trace list): add badge to each list item using trace.model or trace.provider).
- Optionally a small `TraceListBadge` or inline component for the pill.

## Notes / Non-goals

- Model routing card in trace detail is TODO_29. This TODO is only the sidebar list badge.
