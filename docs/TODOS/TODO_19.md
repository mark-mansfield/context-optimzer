# TODO_19: Timeline component (W4.4)

Status: DONE

Completed: Timeline implemented at `src/components/timeline/index.tsx` with TimelineStep, TimelineTrace, TimelineProps; horizontal step bars (Retrieval, Rerank, Response), labels, timestamps, durationMs, arrows; TraceView and Storybook import from `@/components/timeline`; tests moved to `src/components/timeline/index.test.tsx`; old dashboard Timeline removed.

## Context

- Links: [PHASE_4.md](../PHASE_4.md) (W4.4), [VISUAL_WORK_ITEM.md](../VISUAL_WORK_ITEM.md), reference [ui-refs/dashboard.png](../ui-refs/dashboard.png)
- W4.4 dashboard visual: Timeline shows Retrieval → Rerank → Response with timestamps, durations, and arrows.

## Description

Implement or overwrite the **Timeline** component so it matches the reference: horizontal step bars (Retrieval, Rerank, Response), each with label, timestamp, duration (ms), and arrows between steps. Use path `src/components/timeline/index.tsx`.

## Expected Inputs

- Reference image: `docs/ui-refs/dashboard.png`.
- Trace/step data: step labels, optional timestamp and durationMs (mock or derived OK).

## Expected Outputs

- Component at `src/components/timeline/index.tsx` exporting Timeline.
- Renders horizontal bars and arrows matching reference; steps optionally clickable (onStepSelect).
- `yarn test`, `yarn typecheck` pass.

## Acceptance Criteria

- [ ] Component lives at `src/components/timeline/index.tsx`.
- [ ] Renders one bar per step (Retrieval, Rerank, Response) with distinct styling (e.g. color).
- [ ] Each bar shows label, timestamp (e.g. 08:32), and duration (e.g. 45ms).
- [ ] Arrows or connectors between steps; layout matches reference.
- [ ] Optional: selected step visually indicated; onStepSelect callback when provided.
- [ ] Existing tests and typecheck pass.

## Test Plan

- Unit tests: render with mock steps; assert labels, timestamps, durations present; optional scale/order.
- Gates: `yarn test`, `yarn typecheck`.

## Files (expected)

- `src/components/timeline/index.tsx` (create or overwrite).

## Notes / Non-goals

- Timeline data shape can be extended for timestamp/duration; mock values acceptable.
