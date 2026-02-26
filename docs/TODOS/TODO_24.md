# TODO_24: ExportGoldSet component (W4.4)

Status: DONE

Completed: ExportGoldSet at `src/components/export-gold-set/index.tsx`; uses buildGoldSetRecords/goldSetRecordsToJsonl; TraceView and Storybook import from `@/components/export-gold-set`; tests moved to `src/components/export-gold-set/index.test.tsx`; old dashboard component removed.

## Context

- Links: [PHASE_4.md](../PHASE_4.md) (W4.4), [VISUAL_WORK_ITEM.md](../VISUAL_WORK_ITEM.md), reference [ui-refs/dashboard.png](../ui-refs/dashboard.png)
- W4.4 dashboard visual: Export trace(s) to gold set (e.g. button that triggers download).

## Description

Implement or overwrite **ExportGoldSet** so it matches the reference: a control (e.g. button "Export to Gold-Set") that exports the provided trace(s) to a gold-set format (e.g. JSONL). Use path `src/components/export-gold-set/index.tsx`. Integration with buildGoldSetRecords is done where used or inside the component.

## Expected Inputs

- Reference image: `docs/ui-refs/dashboard.png`.
- Props: traces (or current trace); optional filter (e.g. onlyThumbsUp).

## Expected Outputs

- Component at `src/components/export-gold-set/index.tsx` exporting ExportGoldSet.
- Renders export control; on action produces download (or file); styling matches reference.
- `yarn test`, `yarn typecheck` pass.

## Acceptance Criteria

- [ ] Component lives at `src/components/export-gold-set/index.tsx`.
- [ ] Renders an export control (e.g. button with label per reference).
- [ ] Triggering export produces a file/download (e.g. JSONL) using provided traces and existing gold-set logic.
- [ ] Layout and styling match reference.
- [ ] Existing tests and typecheck pass.

## Test Plan

- Unit test: render with mock traces; assert button present; optional: assert export callback or download behavior.
- Gates: `yarn test`, `yarn typecheck`.

## Files (expected)

- `src/components/export-gold-set/index.tsx` (create or overwrite).

## Notes / Non-goals

- buildGoldSetRecords can live in a shared module; this TODO is the UI component and trigger.
