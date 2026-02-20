# TODO_03: Add Storybook for Dashboard Component Development

Status: DONE

**What changed:** Installed Storybook v8.6 (`storybook`, `@storybook/react-vite`, `@storybook/addon-essentials`, `@storybook/test`). Created `.storybook/main.ts` (react-vite framework, story glob `src/dashboard/**/*.stories.tsx`) and `.storybook/preview.ts` (imports Tailwind CSS). Added `src/dashboard/App.stories.tsx` with a Default story. Added `storybook` and `build-storybook` scripts to `package.json`. Added `storybook-static/` to `.gitignore`. All gates pass: `yarn build-storybook` (exit 0), `yarn test` (1 passed), `yarn typecheck` (0 errors).

## Context

- Links: [PHASE_4.md](../PHASE_4.md), [TODO_02.md](TODO_02.md)
- Phase 4 DoD requires: "The dashboard includes Storybook components for all major UI states (Loading, Trace-View, Error)."
- The React + Tailwind + Vite toolchain is already configured (TODO_02).

## Description

Install and configure Storybook so that dashboard components can be developed, documented, and visually tested in isolation. Storybook must integrate with the existing Vite build and Tailwind CSS setup so stories render with full styling.

**Dependencies:**
- `storybook` — core CLI and dev server
- `@storybook/react-vite` — React framework using the existing Vite config
- `@storybook/addon-essentials` — standard addon pack (controls, actions, docs, viewport)
- `@storybook/test` — testing utilities for interaction tests within stories

**Configuration:**
- Initialize `.storybook/` config directory at the project root.
- Configure `.storybook/main.ts` with the `@storybook/react-vite` framework and story globs targeting `src/dashboard/**/*.stories.tsx`.
- Configure `.storybook/preview.ts` to import `src/dashboard/index.css` so Tailwind styles apply to all stories.
- Add `storybook` and `build-storybook` scripts to `package.json`.

**Validation story:**
- Add `src/dashboard/App.stories.tsx` with a single "Default" story for the existing `<App />` component to prove the setup works end-to-end.

## Expected Inputs

- Existing Vite + React + Tailwind config from TODO_02.
- Existing `<App />` component in `src/dashboard/App.tsx`.

## Expected Outputs

- `yarn storybook` launches the Storybook dev server and renders the App story with Tailwind styles.
- `yarn build-storybook` produces a static Storybook build without errors.
- `yarn test` and `yarn typecheck` still pass (no regressions).

## Acceptance Criteria

- [ ] `storybook`, `@storybook/react-vite`, `@storybook/addon-essentials`, `@storybook/test` are in `devDependencies`.
- [ ] `.storybook/main.ts` exists, configured with `@storybook/react-vite` framework and story glob `src/dashboard/**/*.stories.tsx`.
- [ ] `.storybook/preview.ts` exists and imports `src/dashboard/index.css`.
- [ ] `package.json` has `"storybook": "storybook dev -p 6006"` and `"build-storybook": "storybook build"` scripts.
- [ ] `src/dashboard/App.stories.tsx` exists with at least one story for `<App />`.
- [ ] `yarn build-storybook` exits 0.
- [ ] `yarn test` exits 0 (no regressions).
- [ ] `yarn typecheck` exits 0.

## Test Plan

- `yarn build-storybook` exits 0 (CI-verifiable gate).
- `yarn test` and `yarn typecheck` pass with no regressions.
- Manual: `yarn storybook` renders the App story with Tailwind styling applied.

## Files (expected)

- `package.json` (modified)
- `.storybook/main.ts` (new)
- `.storybook/preview.ts` (new)
- `src/dashboard/App.stories.tsx` (new)

## Notes / Non-goals

- Do **not** write stories for components that don't exist yet (Loading, Trace-View, Error) — those will be added in the TODOs that create those components.
- Interaction tests within stories are out of scope — this TODO is purely setup + one validation story.
- Chromatic or other visual regression services are out of scope.
