# TODO_01: Bootstrap Project Scaffolding

Status: DONE

**What changed:** Initialized the TypeScript project with `package.json` (Yarn, all test scripts), `tsconfig.json` (strict, ESNext, `@/` path alias), `vitest.config.ts` (co-located test discovery, `passWithNoTests`), `playwright.config.ts`, and `.gitignore`. Created the canonical directory structure under `src/pipeline/{retriever,reranker,router}/`, `src/shared/`, `src/dashboard/`, `src/integration/`, and `e2e/`. Both `yarn test` and `npx tsc --noEmit` exit 0.

## Context

- Links: [PRD.md](../PRD.md), [SYSTEM_DESIGN.MD](../SYSTEM_DESIGN.MD), [agent-workflow-tdd.mdc](../../.cursor/rules/agent-workflow-tdd.mdc)

## Description

Set up the foundational project scaffolding so that all subsequent TODOs can follow the TDD workflow immediately. This includes initializing the package manager, TypeScript compiler, test runner, linter, and the canonical directory structure defined in `agent-workflow-tdd.mdc`.

The tech stack (from the PRD):
- **Language:** TypeScript (Node.js)
- **Test Runner:** Vitest
- **E2E Testing:** Playwright
- **Frontend (later):** React + Tailwind CSS
- **Package Manager:** Yarn

## Expected Inputs

- The PRD and SYSTEM_DESIGN documents (already present in `docs/`).
- The directory layout convention from `agent-workflow-tdd.mdc`.

## Expected Outputs

- A fully initialized TypeScript project that can run `yarn test` with zero failures.

## Acceptance Criteria

- [ ] `package.json` exists with `name`, `version`, `private: true`, and the correct `scripts` entries (`test`, `test:watch`, `test:pipeline`, `test:ui`, `test:e2e`).
- [ ] `tsconfig.json` exists with strict mode enabled, ESNext module/target, and path aliases for `@/` → `src/`.
- [ ] Vitest is installed and configured (`vitest.config.ts`) with path aliases matching `tsconfig.json`.
- [ ] Playwright is installed with a minimal config (`playwright.config.ts`).
- [ ] The canonical directory structure exists:
  - `src/pipeline/retriever/`
  - `src/pipeline/reranker/`
  - `src/pipeline/router/`
  - `src/shared/`
  - `src/dashboard/`
  - `src/integration/`
  - `e2e/`
- [ ] Unit tests are co-located next to the files they test (e.g., `foo.ts` → `foo.test.ts` in the same directory).
- [ ] `yarn test` exits with code 0.
- [ ] A `.gitignore` exists covering `node_modules/`, `dist/`, and common OS artifacts.
- [ ] No TypeScript compiler errors (`npx tsc --noEmit` exits 0).

## Test Plan

- `yarn test` — must exit with code 0 (no tests yet, but the runner should not error).
- `npx tsc --noEmit` — type-check passes with zero errors.

## Files (expected)

- `package.json`
- `tsconfig.json`
- `vitest.config.ts`
- `playwright.config.ts`
- `.gitignore`
- `src/pipeline/retriever/.gitkeep`
- `src/pipeline/reranker/.gitkeep`
- `src/pipeline/router/.gitkeep`
- `src/shared/.gitkeep`
- `src/dashboard/.gitkeep`
- `src/integration/.gitkeep`
- `e2e/.gitkeep`

## Notes / Non-goals

- Do **not** install application dependencies (LanceDB, LlamaIndex.TS, Transformers.js, React, Tailwind) yet — those belong to later TODOs for their respective phases.
- Do **not** write any production logic; this TODO is purely scaffolding.
- ESLint/Prettier setup is optional and out of scope — can be a follow-up TODO if desired.
