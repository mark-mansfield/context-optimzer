# TODO_26: Dashboard App layout (W4.4)

Status: DONE

Completed: App at `src/dashboard/App.tsx` composes TraceView from `@/components/trace-view`; header (DCO Dashboard + ThemeToggle), query input + Run, two-column layout (trace list left, trace detail right); selected trace styling; no further layout changes required.

## Context

- Links: [PHASE_4.md](../PHASE_4.md) (W4.4), [VISUAL_WORK_ITEM.md](../VISUAL_WORK_ITEM.md), reference [ui-refs/dashboard.png](../ui-refs/dashboard.png)
- W4.4 dashboard visual: Root layout — header (title, theme toggle), query input + Run, two-column (trace list, trace detail).

## Description

Implement or overwrite the **dashboard App** so it matches the reference: header with "DCO Dashboard" (or equivalent), ThemeToggle (from `@/components/theme-toggle`), query input and Run button, left column (trace history list), right column (TraceView for selected trace). Use `src/dashboard/App.tsx` as the dashboard root. Compose TraceView from `@/components/trace-view`.

## Expected Inputs

- Reference image: `docs/ui-refs/dashboard.png`.
- ThemeToggle, TraceView; mock process API (run query, list traces, select trace).

## Expected Outputs

- Dashboard at `src/dashboard/App.tsx`: header, query bar, two-column layout, trace list with selected state, trace detail (TraceView).
- Selected trace in list visually distinct (e.g. border/background).
- `yarn test`, `yarn typecheck` pass.

## Acceptance Criteria

- [ ] Header shows title (e.g. "DCO Dashboard") and ThemeToggle; optional settings icon per reference.
- [ ] Query input and Run button; submitting runs query and updates trace list.
- [ ] Two-column layout: left = query + trace history list; right = trace detail (TraceView when a trace is selected).
- [ ] Trace list: each item shows trace ID (e.g. last 6 chars) and query; selected item has distinct styling (border and/or background).
- [ ] Selecting a trace shows TraceView in the right column; layout matches reference.
- [ ] Existing tests and typecheck pass.

## Test Plan

- Unit/integration tests: render App; assert header, query bar, trace list and detail area; assert selected trace styling.
- Gates: `yarn test`, `yarn typecheck`.

## Files (expected)

- `src/dashboard/App.tsx` (create or overwrite); may touch `src/dashboard/main.tsx` for imports.

## Notes / Non-goals

- Mock API and theme store assumed; this TODO is layout and composition to match reference.
