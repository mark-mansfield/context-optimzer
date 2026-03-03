# TODO_29: Model routing card in trace detail (Option A)

Status: TODO

## Context

- Links: [PRD.md](../PRD.md), [PHASE_4.md](../PHASE_4.md), [TODO_28.md](TODO_28.md)
- TODO_28 adds `model`, `routingClass`, `routingConfidence`, and `routingReason` to the trace. Users need to debug the routing step: see which model was used, why (class), how confident the classifier was, and any short rationale.

## Description

Add a **Model routing** card/section in the **trace detail** view (next to or near CostDisplay) so users can fully debug the routing step. Show: (1) routed **model** name, (2) **routing class** (e.g. Informational / Reasoning), (3) **routing confidence** when present (e.g. "92%" or "0.92"), (4) **routing reason** when present (short classifier rationale or feature summary). Only render when the trace has `model` or `routingClass` (or provider); confidence and reason are optional and may be absent for older traces.

## Expected Inputs

- Trace detail view (TraceView) with trace data that includes `model`, `routingClass`, `routingConfidence`, `routingReason` from TODO_28.
- Existing CostDisplay and token metrics layout in trace detail.

## Expected Outputs

- A "Model routing" block in the trace detail that displays model name, routing class, confidence (when present), and reason (when present).
- Layout consistent with existing cards (e.g. same border/surface as CostDisplay); placement near CostDisplay or token metrics.
- When trace has no routing fields, section is hidden or shows a neutral state (e.g. "No routing data").
- `yarn test`, `yarn typecheck` pass.

## Acceptance Criteria

- [ ] Trace detail shows model name, routing class, and when present: routing confidence and routing reason.
- [ ] Component or section is accessible and readable (labels, contrast).
- [ ] No layout break when routing data is missing; optional snapshot or visual test update if required by project.
- [ ] Tests and typecheck pass.

## Test Plan

- Unit test: render trace detail with/without model, routingClass, routingConfidence, routingReason; assert section visibility and content (including confidence and reason when present).
- Gates: `yarn test`, `yarn typecheck`. Update visual snapshot if project gates dashboard UI with Playwright.

## Files (expected)

- `src/components/trace-view/index.tsx` (add routing block and pass trace.model, trace.routingClass, trace.routingConfidence, trace.routingReason).
- Possibly new `src/components/model-routing-card/index.tsx` if extracted for reuse/storybook.

## Notes / Non-goals

- Trace list badge (quick model indicator in sidebar) is TODO_30. This TODO is only the detail-view card.
