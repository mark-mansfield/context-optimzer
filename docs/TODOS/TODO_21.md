# TODO_21: NodeInspector component (W4.4)

Status: DONE

Completed: NodeInspector at `src/components/node-inspector/index.tsx` with three columns (Sample chunk ~50%, Score ~22%, Edit correction ~28%); exports InspectorNode; optional sampleChunkExtra and correctionSlot; TraceView uses it with FeedbackButtons/ExportGoldSet and EditCorrection as slots; tests and Storybook updated; old dashboard NodeInspector removed.

## Context

- Links: [PHASE_4.md](../PHASE_4.md) (W4.4), [VISUAL_WORK_ITEM.md](../VISUAL_WORK_ITEM.md), reference [ui-refs/dashboard.png](../ui-refs/dashboard.png)
- W4.4 dashboard visual: Node Inspector with three columns — Sample chunk, Score, Edit correction.

## Description

Implement or overwrite **NodeInspector** so it matches the reference: three-column layout (e.g. Sample chunk ~50%, Score ~20–25%, Edit correction ~25–30%), with clear column headers and content. Use path `src/components/node-inspector/index.tsx`.

## Expected Inputs

- Reference image: `docs/ui-refs/dashboard.png`.
- Node data: sample chunk text, score, optional correction; array of nodes if multiple rows.

## Expected Outputs

- Component at `src/components/node-inspector/index.tsx` exporting NodeInspector.
- Three columns with headers and content; proportions and styling match reference.
- `yarn test`, `yarn typecheck` pass.

## Acceptance Criteria

- [ ] Component lives at `src/components/node-inspector/index.tsx`.
- [ ] Renders three columns: Sample chunk, Score, Edit correction (or equivalent labels per reference).
- [ ] Column width proportions match reference (e.g. ~50% / ~22% / ~28%).
- [ ] Column headers and cell content visible; sentence-case or styling per reference.
- [ ] Existing tests and typecheck pass.

## Test Plan

- Unit test: render with mock nodes; assert column headers and content present; optional layout assertions.
- Gates: `yarn test`, `yarn typecheck`.

## Files (expected)

- `src/components/node-inspector/index.tsx` (create or overwrite).

## Notes / Non-goals

- Edit correction cell can link to EditCorrection component or show read-only; detail in EditCorrection TODO.
