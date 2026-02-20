# TODO_02: Install Phase 4 Dependencies & Configure Build Tooling

Status: DONE

**What changed:** Installed all Phase 4 runtime deps (`react`, `react-dom`, `tailwindcss`, `@tailwindcss/vite`, `framer-motion`) and dev deps (`vite`, `@vitejs/plugin-react`, `@types/react`, `@types/react-dom`, `jsdom`, `@testing-library/react`, `@testing-library/dom`, `@testing-library/jest-dom`). Created `vite.config.ts` with React + Tailwind plugins and `@/` alias. Updated `tsconfig.json` with `jsx: react-jsx` and DOM lib. Updated `vitest.config.ts` with `jsdom` environment and `.tsx` test glob. Scaffolded `index.html`, `src/dashboard/main.tsx`, `App.tsx`, `App.test.tsx`, and `index.css`. Added `dev` and `build` scripts. All gates pass: `yarn test` (1 passed), `yarn typecheck` (0 errors), `yarn build` (produces `dist/`).

## Context

- Links: [PHASE_4.md](../PHASE_4.md), [PRD.md](../PRD.md), [SYSTEM_DESIGN.md](../SYSTEM_DESIGN.md)
- Phase 4 requires a React + Tailwind CSS + Framer Motion frontend with SSE-based data flow.
- The current project has only devDependencies (TypeScript, Vitest, Playwright). No application deps are installed.

## Description

Install all runtime and dev dependencies needed for the Phase 4 Observability Dashboard, and configure the build/dev tooling so that subsequent TODOs can immediately write React components with tests.

**Runtime dependencies:**
- `react`, `react-dom` — UI framework
- `tailwindcss`, `@tailwindcss/vite` — utility-first CSS (v4, Vite plugin)
- `framer-motion` — trace animations (per PHASE_4.md DTD)

**Dev dependencies:**
- `vite` — dev server and bundler
- `@vitejs/plugin-react` — React Fast Refresh in Vite
- `@types/react`, `@types/react-dom` — TypeScript typings
- `jsdom` — DOM environment for Vitest component tests
- `@testing-library/react`, `@testing-library/jest-dom` — component testing utilities

**Configuration changes:**
- Add `vite.config.ts` with the React plugin, Tailwind plugin, and `@/` path alias.
- Update `tsconfig.json` to include `"jsx": "react-jsx"` and add `"dom"` to `lib`.
- Update `vitest.config.ts` to use `jsdom` as the test environment and include `*.test.tsx` files.
- Add `src/dashboard/index.css` with `@import "tailwindcss"` (Tailwind v4 convention).
- Add `src/dashboard/main.tsx` as the Vite entry point (minimal: renders an empty `<App />` shell).
- Add `src/dashboard/App.tsx` with a placeholder component.
- Add `index.html` at the project root pointing to `src/dashboard/main.tsx`.
- Add `dev` and `build` scripts to `package.json`.

## Expected Inputs

- Existing `package.json`, `tsconfig.json`, `vitest.config.ts`.

## Expected Outputs

- All deps installed and lockfile updated.
- `yarn dev` starts Vite and serves the dashboard on localhost.
- `yarn build` produces a production bundle in `dist/`.
- `yarn test` still passes (no regressions).
- `yarn typecheck` still passes.

## Acceptance Criteria

- [ ] `react`, `react-dom`, `tailwindcss`, `@tailwindcss/vite`, `framer-motion` are in `dependencies`.
- [ ] `vite`, `@vitejs/plugin-react`, `@types/react`, `@types/react-dom`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom` are in `devDependencies`.
- [ ] `vite.config.ts` exists with React plugin, Tailwind plugin, and `@/` alias.
- [ ] `tsconfig.json` has `"jsx": "react-jsx"` and `"lib": ["ESNext", "DOM", "DOM.Iterable"]`.
- [ ] `vitest.config.ts` includes `*.test.tsx` in the glob and sets `environment: "jsdom"`.
- [ ] `index.html` exists at root and references `src/dashboard/main.tsx`.
- [ ] `src/dashboard/main.tsx` renders the `<App />` component into `#root`.
- [ ] `src/dashboard/App.tsx` exports a minimal placeholder component.
- [ ] `src/dashboard/index.css` imports Tailwind (`@import "tailwindcss"`).
- [ ] `package.json` has `"dev": "vite"` and `"build": "vite build"` scripts.
- [ ] `yarn test` exits 0.
- [ ] `yarn typecheck` exits 0.
- [ ] `yarn build` exits 0.

## Test Plan

- A smoke test (`src/dashboard/App.test.tsx`) renders `<App />` and asserts it mounts without crashing.
- `yarn test` passes including the new smoke test.
- `yarn typecheck` exits 0 with the JSX/DOM config changes.
- `yarn build` produces output in `dist/`.

## Files (expected)

- `package.json` (modified)
- `tsconfig.json` (modified)
- `vitest.config.ts` (modified)
- `vite.config.ts` (new)
- `index.html` (new)
- `src/dashboard/main.tsx` (new)
- `src/dashboard/App.tsx` (new)
- `src/dashboard/App.test.tsx` (new)
- `src/dashboard/index.css` (new)

## Notes / Non-goals

- Do **not** implement any dashboard features (trace visualization, FinOps, feedback) — those belong to later TODOs.
- Do **not** install backend/pipeline dependencies (LanceDB, LlamaIndex.TS, etc.) — those belong to earlier phases.
- Storybook setup is deferred to a dedicated TODO.
- The placeholder `<App />` component should be as minimal as possible (e.g. a single heading).
