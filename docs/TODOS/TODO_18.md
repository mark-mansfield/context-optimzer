# TODO_18: Dashboard layout aligned to UI reference (W4.4)

Status: TODO

## Context

- Links: [PHASE_4.md](../PHASE_4.md) (W4.4), [UI reference](../assets/ui-reference.png)
- W4.4 requires aligning the dashboard with the design mockup. Existing layout is in `App.tsx` (header, query + Run, trace list, trace detail). This TODO updates the **dashboard layout itself** to match the UI reference; component-level changes (Timeline, token cards, Node Inspector) are separate TODOs.

## Description

Update the dashboard **layout** in `App.tsx` (and any layout subcomponents) to match [UI reference](assets/ui-reference.png): (1) **Header** — "DCO Dashboard" on the left; on the right, a **settings (gear) icon** and the existing **theme toggle** (single rounded button with Sun icon). (2) **Two-column layout** — left: query input + Run, trace history; right: trace detail (unchanged structure, content updated by other TODOs). (3) **Trace history** — selected trace item must show a **subtle border and lighter background** (e.g. blue highlight as in reference) so the active trace is clearly indicated. Use existing theme tokens and components; add only the gear icon (e.g. Lucide `Settings`) and adjust trace list item styling for selected state.

## Expected Inputs

- Existing `App.tsx` with header, query bar, trace list, trace detail (TraceView + FeedbackButtons, EditCorrection, ExportGoldSet).
- Existing ThemeToggle component.
- UI reference image: `docs/assets/ui-reference.png`.

## Expected Outputs

- Header shows title + gear icon + theme toggle.
- Trace list: selected item has visible border and lighter/highlight background.
- Layout and structure match UI reference for header and list; `yarn test`, `yarn typecheck` pass.

## Acceptance Criteria

- [ ] Header includes a settings (gear) icon in addition to theme toggle.
- [ ] Selected trace in the trace history list is visually distinct (border and/or lighter background).
- [ ] Two-column layout preserved; no regression to query flow or trace selection.
- [ ] Existing tests and typecheck pass.

## Test Plan

- Update or add tests for header content (e.g. gear icon present) and trace list selected state if not already covered.
- Gates: `yarn test`, `yarn typecheck`.

## Files (expected)

- `src/dashboard/App.tsx` (header, trace list item styling).

## Notes / Non-goals

- Timeline, token cards, and Node Inspector layout are **out of scope** (see TODO_19, TODO_20, TODO_21).
- Gear icon can be non-functional (placeholder) for now unless product requires settings behavior.
