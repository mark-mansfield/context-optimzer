# TODO_22: Dashboard visual regression — pixel-perfect match and snapshot test (W4.4)

Status: TODO

## Context

- Links: [PHASE_4.md](../PHASE_4.md) (W4.4), [dashboard spec](../ui-refs/dashboard/spec.md), [reference.png](../ui-refs/dashboard/reference.png).
- Follows TODO_18–TODO_21 (layout, Timeline, token cards, Node Inspector). This is the **final** visual gate: check the **entire dashboard** against the reference image and iterate until it matches **pixel-perfect**. Then lock that state in with a snapshot test so future code changes are validated automatically.
- Use **Playwright** (or similar) to validate code changes against the reference: e.g. screenshot the dashboard in a known state and compare to the reference image (or to a stored snapshot taken when the UI matched the reference). The repo already has `@playwright/test` and `test:e2e`; test dir is `e2e/`, base URL `http://localhost:5173`.

## Description

1. **Visual check and iterate:** Run the dashboard (e.g. with mock API), open the trace detail view that corresponds to the reference design. Compare the full dashboard (or the trace-detail view) to [reference.png](../ui-refs/dashboard/reference.png). Iterate on layout, styling, and copy until the UI matches the reference **pixel-perfect** (or within an agreed tolerance if needed for cross-environment differences).
2. **Validate with Playwright:** Use Playwright (or a similar E2E/visual tool) to automate the comparison: e.g. navigate to the dashboard, ensure a trace is selected so the trace detail panel is visible, take a screenshot of the viewport (or the main content area), and compare it to the reference image (or to a baseline snapshot). Fix any code that causes a diff.
3. **Snapshot test when match is perfect:** Once the UI matches the reference image perfectly, add a **snapshot test** that captures this state: e.g. a Playwright screenshot snapshot (or image-snapshot assertion) that compares the current screenshot to a stored baseline. The baseline should be the screenshot taken when the UI was verified to match the reference. Thereafter, `yarn test:e2e` (or the relevant command) fails if UI changes cause a visual diff, protecting against regressions.

## Expected Inputs

- Completed TODO_18–TODO_21 (dashboard layout and components aligned to spec).
- Running dashboard (e.g. `yarn dev`) with mock process/trace API so a trace can be loaded.
- Reference image: [docs/ui-refs/dashboard/reference.png](../ui-refs/dashboard/reference.png).
- Existing Playwright setup: `playwright.config.ts`, `e2e/` test dir, `yarn test:e2e`.

## Expected Outputs

- Dashboard visually matches the reference image pixel-perfect (or within defined tolerance).
- Playwright (or similar) test that: navigates to dashboard, loads trace detail, takes screenshot, and compares to reference or baseline.
- A **snapshot test** that passes when the UI matches the reference and fails when the UI drifts (baseline stored in repo, e.g. `e2e/snapshots/` or `docs/assets/`).
- `yarn test`, `yarn test:e2e`, and `yarn typecheck` pass; README or docs updated if new commands or baselines are added.

## Acceptance Criteria

- [ ] Full dashboard (trace detail view) has been compared to the reference image and iterated until pixel-perfect match (or agreed tolerance).
- [ ] Playwright (or similar) is used to validate: screenshot comparison against reference or baseline.
- [ ] Snapshot test added: when the UI matches the reference perfectly, the test captures that state as the baseline and passes; future runs fail if the UI diverges.
- [ ] Snapshot/baseline and test live in the repo (e.g. `e2e/` plus snapshot dir); `yarn test:e2e` runs the visual check.
- [ ] `yarn test`, `yarn test:e2e`, `yarn typecheck` pass; no new TypeScript errors.

## Test Plan

- Add E2E test(s) in `e2e/`: e.g. `dashboard-visual.spec.ts` (or similar) that loads the dashboard with a trace, takes a screenshot of the trace-detail view, and uses Playwright’s screenshot comparison (e.g. `expect(screenshot).toMatchSnapshot()` with a baseline, or compare to the reference image). When the UI matches the reference, establish the baseline (first run or manual capture); thereafter the test fails on visual drift. Document how to update the baseline if the design intentionally changes.
- Gates: `yarn test`, `yarn test:e2e`, `yarn typecheck`.

## Files (expected)

- `e2e/dashboard-visual.spec.ts` (or equivalent): navigates to dashboard, selects/loads trace, screenshot + snapshot or reference comparison.
- Snapshot/baseline output dir (e.g. `e2e/snapshots/`, or reference image path used for comparison).
- Optionally: `README.md` or `docs/` note on running visual tests and updating baselines.

## Notes / Non-goals

- Pixel-perfect can be relaxed to “within tolerance” for things like fonts or sub-pixel differences across OS/CI; document the approach.
- This TODO assumes the app can reach a state that matches the reference (mock data, seeded trace). If not, add minimal mock/seeding needed.
- Non-goal: changing product design; the snapshot locks the current reference design as the baseline.
