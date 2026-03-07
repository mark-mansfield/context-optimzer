# E2E visual tests

- **Run:** `yarn playwright test e2e/dashboard-visual.spec.ts`
- **Update baseline:** `yarn playwright test e2e/dashboard-visual.spec.ts --update-snapshots`

Test uses dark theme and runs a query so the trace-detail view is visible before capturing.
