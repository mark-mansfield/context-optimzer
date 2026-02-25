# TODO_19: Timeline component aligned to UI reference (W4.4)

Status: TODO

## Context

- Links: [PHASE_4.md](../PHASE_4.md) (W4.4), [UI reference](../assets/ui-reference.png)
- W4.4 specifies a horizontal timeline with **duration bars** (Retrieval blue, Rerank orange, Response green), timestamps, durations (ms), arrows between steps, and a horizontal scale (e.g. 0–30ms). The existing `Timeline` component shows numbered steps and labels only; it must be **updated** to match the reference.

## Description

Update the existing **Timeline** component (`src/dashboard/components/Timeline.tsx`) to match the [UI reference](assets/ui-reference.png): (1) Render each step as a **colored horizontal bar** — Retrieval (blue), Rerank (orange), Response (green). (2) Each bar shows **label**, **timestamp** (e.g. 08:32), and **duration** (e.g. 45ms, 12ms, 8ms). (3) **Arrows** between steps. (4) A **horizontal time scale** below the bars (e.g. 0ms, 5ms, 10ms, … 30ms at 5ms intervals). Steps remain clickable when `onStepSelect` is provided; selected step can be indicated (e.g. border or opacity). Extend the trace/step data model if needed to support `timestamp` and `durationMs` (mock or derived values are acceptable for the playable dashboard).

## Expected Inputs

- Existing Timeline component and `TimelineStep` / `TimelineTrace` types.
- TraceView / process API may need to supply or derive step durations and timestamps for display (or use sensible defaults for mock data).

## Expected Outputs

- Timeline renders as horizontal duration bars with colors, labels, timestamps, and durations.
- Arrows between steps; time scale below.
- Existing Timeline props (trace, loading, error, selectedStep, onStepSelect) preserved; optional new props for step timing if needed.
- `yarn test`, `yarn typecheck` pass; Storybook story updated if present.

## Acceptance Criteria

- [ ] Retrieval step shown as blue bar, Rerank as orange, Response as green.
- [ ] Each step displays label, timestamp, and duration (ms).
- [ ] Arrows connect the steps; horizontal scale (e.g. 0–30ms) appears below.
- [ ] Step selection (when used) still works; existing tests updated/passing.

## Test Plan

- Update Timeline tests for new structure (bars, scale); snapshot or structure assertions as appropriate.
- Gates: `yarn test`, `yarn typecheck`.

## Files (expected)

- `src/dashboard/components/Timeline.tsx`
- Possibly `src/api/process.ts` or trace types to add duration/timestamp fields for steps (or derive in Timeline).
- Timeline.stories.tsx if present.

## Notes / Non-goals

- Exact scale range (0–30ms) and tick interval can be configurable or derived from step data.
- Backend/SSE integration for real timings is out of scope; mock or computed values are sufficient.
