# TODO_22: EditCorrection component (W4.4)

Status: DONE

Completed: EditCorrection at `src/components/edit-correction/index.tsx`; textarea + Save Correction; TraceView and Storybook import from `@/components/edit-correction`; tests moved to `src/components/edit-correction/index.test.tsx`; old dashboard component removed.

## Context

- Links: [PHASE_4.md](../PHASE_4.md) (W4.4), [VISUAL_WORK_ITEM.md](../VISUAL_WORK_ITEM.md), reference [ui-refs/dashboard.png](../ui-refs/dashboard.png)
- W4.4 dashboard visual: Edit/correct response for the trace; may appear in Node Inspector or trace detail.

## Description

Implement or overwrite **EditCorrection** so it matches the reference: UI to view and submit corrected response text for a trace (e.g. textarea + submit). Use path `src/components/edit-correction/index.tsx`. Wiring to correction API is out of scope here; focus on layout and styling to match reference.

## Expected Inputs

- Reference image: `docs/ui-refs/dashboard.png`.
- Props: traceId, initialResponse (or correction), onSubmit callback.

## Expected Outputs

- Component at `src/components/edit-correction/index.tsx` exporting EditCorrection.
- Renders correction input area and submit control; styling matches reference.
- `yarn test`, `yarn typecheck` pass.

## Acceptance Criteria

- [ ] Component lives at `src/components/edit-correction/index.tsx`.
- [ ] Renders an area for corrected response (e.g. textarea) and a submit/save control.
- [ ] Label/copy and layout match reference (e.g. "Edit correction" or equivalent).
- [ ] Accepts initial value and notifies parent on submit (callback); wiring to API is done where component is used.
- [ ] Existing tests and typecheck pass.

## Test Plan

- Unit test: render with mock props; assert input and submit present; optional submit callback asserted.
- Gates: `yarn test`, `yarn typecheck`.

## Files (expected)

- `src/components/edit-correction/index.tsx` (create or overwrite).

## Notes / Non-goals

- API wiring (submitCorrection, getCorrection) is in dashboard/App or trace-detail wiring; this TODO is the component only.
