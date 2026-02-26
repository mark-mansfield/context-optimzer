# Visual work item (reusable)

Use this doc for any screen or UI that has a **screenshot reference**. Replace the placeholders below with the specific reference path, checklist, test, and components for this work item.

- **Reference:** Screenshot at `docs/ui-refs/<work-item-id>/<name>.png` (e.g. `docs/ui-refs/dashboard.png`). Add or restore the image for this work item.
- **Checklist:** _Fill in for this screen_ — e.g. header, layout, theme, key regions. What must be true for the UI to match the reference?
- **Test:** _Fill in_ — e.g. run a flow so the view is visible; run `yarn playwright test e2e/<name>-visual.spec.ts`. Update baseline with `--update-snapshots` when correct. See [E2E_VISUAL_TESTS.md](E2E_VISUAL_TESTS.md).

## Workflow

1. **Look at the reference image** — Open the reference screenshot (see Reference above) and inspect the layout, regions, and UI elements.
2. **Break the design into reusable components** — Identify discrete, reusable pieces (e.g. header, sidebar, list, detail panel, cards, forms). Map each to a single component with a clear responsibility. Add or adjust rows in the Components table below if the image suggests different or additional components.
3. **Generate TODOs from the Components table** — For each row in the Components table below, create one `docs/TODOS/TODO_XX.md` (use the next available numbers). Each TODO must: (a) have a short title naming the component; (b) use the canonical template (Context, Description, Expected Inputs/Outputs, Acceptance Criteria, Test Plan, Files, Notes) per the repo’s todo-authoring convention; (c) include **granular acceptance criteria** (multiple checkboxes) derived from the component’s Responsibility and what you see in the reference image (e.g. layout, labels, styling, behavior). Add one final TODO for the E2E visual gate: run Playwright snapshot test and update baseline per E2E_VISUAL_TESTS.md.
4. **Implement or overwrite** — Work through the TODOs in order; create each component if it does not exist; overwrite existing components to match the reference and this spec.

## Components (explicit)

Implement the **screen/view** as **separate components**. **Create each component if it does not already exist.** When implementing or re-running TODOs, **create or overwrite** components and files as needed to match this spec; do not skip or refuse to overwrite existing components.

**Path convention:** Use `src/components/<component-name>/index.tsx` so imports are clean, e.g. `import X from '@/components/component-name'`.

| Component | Path | Responsibility |
|-----------|------|----------------|
| _Add rows per reference image; one component per row._ | `src/components/<component-name>/index.tsx` | _What this component does and how it should look._ |
