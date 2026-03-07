# TODO_23: FeedbackButtons component (W4.4)

Status: DONE

Completed: FeedbackButtons at `src/components/feedback-buttons/index.tsx`; thumbs up/down with selected state; TraceView and Storybook import from `@/components/feedback-buttons`; tests moved to `src/components/feedback-buttons/index.test.tsx`; old dashboard component removed.

## Context

- Links: [PHASE_4.md](../PHASE_4.md) (W4.4), [VISUAL_WORK_ITEM.md](../VISUAL_WORK_ITEM.md), reference [ui-refs/dashboard.png](../ui-refs/dashboard.png)
- W4.4 dashboard visual: Thumbs up/down for the trace.

## Description

Implement or overwrite **FeedbackButtons** so it matches the reference: thumbs up and thumbs down controls, with clear selected state (e.g. filled when voted). Use path `src/components/feedback-buttons/index.tsx`. Wiring to feedback API is done where the component is used.

## Expected Inputs

- Reference image: `docs/ui-refs/dashboard.png`.
- Props: traceId, currentVote (up | down | null), onVote callback.

## Expected Outputs

- Component at `src/components/feedback-buttons/index.tsx` exporting FeedbackButtons.
- Renders up/down buttons; selected state visible; styling matches reference.
- `yarn test`, `yarn typecheck` pass.

## Acceptance Criteria

- [ ] Component lives at `src/components/feedback-buttons/index.tsx`.
- [ ] Renders thumbs up and thumbs down controls (icons or buttons).
- [ ] Current vote (if any) is visually indicated (e.g. filled/highlighted).
- [ ] Clicking a button invokes onVote with up/down; layout and styling match reference.
- [ ] Existing tests and typecheck pass.

## Test Plan

- Unit test: render with mock props; assert both buttons present; assert onVote called with correct value on click.
- Gates: `yarn test`, `yarn typecheck`.

## Files (expected)

- `src/components/feedback-buttons/index.tsx` (create or overwrite).

## Notes / Non-goals

- submitFeedback/getFeedback wiring is in parent; this TODO is the component only.
