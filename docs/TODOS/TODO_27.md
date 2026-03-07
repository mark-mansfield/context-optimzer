# TODO_27: E2E visual gate — dashboard snapshot (W4.4)

Status: DONE

Completed: `e2e/dashboard-visual.spec.ts` exists (dark theme, run query, capture trace-detail screenshot); [E2E_VISUAL_TESTS.md](../E2E_VISUAL_TESTS.md) documents run and `--update-snapshots`. Run `yarn playwright test e2e/dashboard-visual.spec.ts` in CI or supported env; local run may hit browser crash in some sandboxes.

## Context

- Links: [PHASE_4.md](../PHASE_4.md) (W4.4), [E2E_VISUAL_TESTS.md](../E2E_VISUAL_TESTS.md), reference [ui-refs/dashboard.png](../ui-refs/dashboard.png)
- W4.4 dashboard visual: Final gate — Playwright snapshot test for trace-detail view; update baseline when UI matches reference.

## Description

Ensure the **E2E visual test** exists and passes for the dashboard trace-detail view. Test should: run app (dark theme), run a query so trace detail is visible, capture snapshot; baseline should match reference. When the UI is updated to match the design, update the baseline with `--update-snapshots`.

## Expected Inputs

- Existing or new `e2e/dashboard-visual.spec.ts`.
- Dashboard running (e.g. dev server or build); viewport and theme per [E2E_VISUAL_TESTS.md](../E2E_VISUAL_TESTS.md).

## Expected Outputs

- Playwright test runs and passes (snapshot matches stored baseline).
- Doc [E2E_VISUAL_TESTS.md](../E2E_VISUAL_TESTS.md) explains how to run and update snapshots.
- When UI matches reference, run with `--update-snapshots` to refresh baseline.

## Acceptance Criteria

- [ ] `yarn playwright test e2e/dashboard-visual.spec.ts` passes (or baseline is updated so it passes).
- [ ] Test uses dark theme and runs a query so trace-detail view is visible before capture.
- [ ] Viewport and setup match [E2E_VISUAL_TESTS.md](../E2E_VISUAL_TESTS.md).
- [ ] E2E_VISUAL_TESTS.md documents: run command, update-baseline command.

## Test Plan

- Run `yarn playwright test e2e/dashboard-visual.spec.ts`; if UI intentionally changed, run with `--update-snapshots` and commit new baseline.
- Gates: Playwright test pass; `yarn test`, `yarn typecheck`.

## Files (expected)

- `e2e/dashboard-visual.spec.ts`; `e2e/dashboard-visual.spec.ts-snapshots/`; `docs/E2E_VISUAL_TESTS.md`.

## Notes / Non-goals

- This is the visual regression gate only; component work is in TODO_18–26.
