# TODO_34: Update dashboard tests for lazy-loaded history sheet

Status: DONE — Trace history test opens sheet (click Show trace history) and uses findByText to wait for lazy UI; model badge test asserts on detail view; suite passes.

## Context

- Depends on TODO_33. After code-splitting, the history sheet mounts only when the user has opened it; tests that assume "Trace history" or the trace list is already in the tree will fail without waiting for the lazy chunk.

## Description

Update **dashboard/App tests** so any test that depends on the trace history sheet first opens it (click "Show trace history") and uses **async queries** (e.g. `findByText("Trace history")`) to wait for the lazy component to load. Ensure assertions on the list (query text, model badge, selected state) run after the sheet is visible.

## Expected Inputs

- [App.test.tsx](../../src/dashboard/App.test.tsx) and current test cases that reference "Trace history" or the trace list.

## Expected Outputs

- Tests that need the history sheet: click the History button, then `await screen.findByText("Trace history")` (or equivalent) before asserting on list content.
- No flakiness from asserting before the lazy chunk has loaded; `yarn test` passes.

## Acceptance Criteria

- [x] Any test asserting on "Trace history" or trace list items opens the sheet first and uses `findBy*` (or similar) to wait for the lazy UI.
- [x] Full test suite passes with `yarn test`.

## Test Plan

- Run `yarn test` (dashboard/App tests and full suite); confirm no regressions and no race conditions on history sheet.

## Files (expected)

- `src/dashboard/App.test.tsx`.

## Notes / Non-goals

- Changing test structure beyond what’s needed for async history; no new test frameworks or mocking of lazy load unless necessary.
