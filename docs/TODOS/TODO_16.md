# TODO_16: Dashboard layout and query flow

Status: DONE

Completed: App.tsx now has header (DCO Dashboard + ThemeToggle), query input + Run button calling processQuery, trace list (trace_id + query), and trace detail (TraceView). Run adds trace to state and selects it; selecting a list item shows TraceView. Loading and error handling for process. Added vitest.setup.ts to mock window.matchMedia for jsdom. All tests and typecheck pass.

## Context

- Links: [PRD.md](../PRD.md), [PHASE_4.md](../PHASE_4.md), [TODO_15.md](TODO_15.md)
- App currently renders only a "DCO Dashboard" heading. Phase 4 requires a playable dashboard: user submits a query, sees a trace, and can inspect it. TODO_15 provides the mock process API; this TODO builds the app layout and query flow **without** wiring feedback/correction/export (that is TODO_17).

## Description

Build the **dashboard layout and query flow** in `App.tsx` (or a small set of components): (1) Header with "DCO Dashboard" and existing ThemeToggle. (2) Query input and a "Run" (or "Process") button that calls the mock process API from TODO_15; on success, add the returned trace to a trace list in state. (3) A **trace list** (e.g. list of trace cards or rows showing trace_id and query summary) so the user can see past runs. (4) When the user selects a trace (e.g. click a list item), show a **trace detail** view that renders `TraceView` with the selected trace (and loading/error states as needed). Layout can be single page (list + detail side-by-side or stacked) or minimal navigation; no router required if not needed. Use existing Tailwind/theme; ensure the app is usable and readable.

## Expected Inputs

- Mock process API from TODO_15: processQuery(query) and optionally listTraces/getTrace.
- Existing components: TraceView, ThemeToggle.

## Expected Outputs

- App with header (title + ThemeToggle), query input + Run button, trace list, and trace detail (TraceView).
- Run button triggers mock process; new trace appears in the list; selecting a trace shows TraceView with that trace.
- Loading and error handling for the process call and for the selected trace.
- `yarn test`, `yarn typecheck` pass; no new Storybook required if App is covered by manual/e2e play.

## Acceptance Criteria

- [x] User can type a query and click Run; mock process is called and a new trace appears in the list.
- [x] User can select a trace from the list and see TraceView with the correct trace data.
- [x] Header shows dashboard title and theme toggle.
- [x] Layout is clear and usable; existing tests and typecheck pass.

## Test Plan

- Unit/integration: render App, optionally mock process API; assert query input and Run exist; assert trace list updates after "run" (if testable without full DOM); or rely on manual verification and typecheck.
- Gates: `yarn test`, `yarn typecheck`.

## Files (expected)

- `src/dashboard/App.tsx` (and possibly small subcomponents for query bar, trace list, trace detail section).
- Updates to `src/dashboard/main.tsx` only if needed for providers or layout.

## Notes / Non-goals

- Feedback, correction, and export are **not** wired in this TODO (see TODO_17).
- No backend, no router required unless you prefer it; single-page layout is sufficient.
