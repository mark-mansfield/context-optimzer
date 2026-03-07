# TODO_05: Timeline Component (Phase 4 Trace Visualization)

Status: DONE

**What changed:** Added `Timeline.tsx` with `TimelineStep`/`TimelineTrace` types and props for `trace`, `loading`, and `error`. Component renders three phases (Retrieval, Rerank, Response) using semantic theme tokens; shows loading state (role="status") or error (role="alert") when provided; error takes precedence over loading. Added `Timeline.test.tsx` (five tests: step labels, loading, error, error over loading, loading over trace) with cleanup. Added `Timeline.stories.tsx` (TraceView, Loading, Error). All gates pass: `yarn test` (18 passed), `yarn typecheck`, `yarn build-storybook`.

## Context

- Links: [PHASE_4.md](../PHASE_4.md), [PRD.md](../PRD.md), [TODO_04.md](TODO_04.md)
- Phase 4 DoD (PHASE_4.md): "The dashboard includes Storybook components for all major UI states (Loading, Trace-View, Error)."
- W4.1 (PHASE_4.md): Build a "Timeline" component that maps the transition from Phase 1 (Retrieval) through Phase 3 (Response).
- Theme tokens from TODO_04 are available (`--color-accent`, `--color-bg-surface`, etc.) for consistent styling.
- Execution trace schema (PHASE_4.md): `trace_id`, `step_metrics`, and node-related data; exact types can be introduced in this TODO or a shared types module.

## Description

Implement a **Timeline** React component that visually represents the execution flow of a DCO query: **Phase 1 (Retrieval)** → **Phase 2 (Rerank)** → **Phase 3 (Route / Response)**. The component is presentational and receives trace data via props; it does not connect to SSE or backend in this TODO. The goal is to establish the UI structure, use semantic theme tokens, and cover Loading, Trace-View, and Error states in Storybook.

## Expected Inputs

- Theme tokens and `ThemeToggle` / theme store from TODO_04.
- Optional: a minimal trace type (e.g. `TraceStep` or `ExecutionTrace`-like shape) defining steps and labels; can be defined in this TODO in a types file or next to the component.

## Expected Outputs

- A `<Timeline />` component that renders the three phases (Retrieval, Rerank, Route/Response) with clear step labels and optional metadata (e.g. status, duration).
- Use of semantic CSS custom properties (e.g. `--color-bg-surface`, `--color-accent`, `--color-text-secondary`) for backgrounds, active step, and text.
- Storybook stories for: **Loading** (skeleton or spinner), **Trace-View** (with mock trace data), **Error** (error state with message).
- Unit tests that assert correct rendering of steps and optional loading/error states.

## Acceptance Criteria

- [x] A `Timeline` component exists (e.g. `src/dashboard/components/Timeline.tsx`) that accepts props for trace data and loading/error state.
- [x] The component renders at least three distinct steps: Phase 1 (Retrieval), Phase 2 (Rerank), Phase 3 (Route/Response).
- [x] Styling uses semantic theme tokens from `index.css` (no hard-coded hex for foreground/background).
- [x] Storybook story file (e.g. `Timeline.stories.tsx`) includes stories: Loading, Trace-View (with mock trace), Error.
- [x] Unit tests (e.g. `Timeline.test.tsx`) verify that steps render correctly and that loading/error states render when provided.
- [x] `yarn test` passes; `yarn typecheck` passes; `yarn build-storybook` succeeds.

## Test Plan

- **Unit (Vitest + React Testing Library):** Render `Timeline` with mock trace data; assert presence of step labels (Retrieval, Rerank, Route/Response). Render with loading true and assert loading UI; render with error and assert error message.
- **Storybook:** Load Timeline stories; use toolbar theme switcher to verify appearance in light/dark; visually verify Loading, Trace-View, and Error states.
- **Gates:** `yarn test`, `yarn typecheck`, `yarn build-storybook` all exit 0.

## Files (expected)

- `src/dashboard/components/Timeline.tsx` (new)
- `src/dashboard/components/Timeline.stories.tsx` (new)
- `src/dashboard/components/Timeline.test.tsx` (new)
- Optionally: `src/dashboard/types/trace.ts` or types in same folder for trace step shape (if not inlined in component file)

## Notes / Non-goals

- **No SSE or real backend wiring** in this TODO — the component consumes props only. Integration with SSE/streaming can be a later TODO.
- **Node Inspector** (raw vs. reranked context) is out of scope here; focus is the horizontal/vertical timeline of phases only.
- Framer Motion animations (e.g. step entrance) are optional in this TODO; can be added in a follow-up polish TODO.
