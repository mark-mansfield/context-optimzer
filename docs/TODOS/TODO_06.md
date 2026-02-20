# TODO_06: Node Inspector (Raw vs. Reranked Context)

Status: DONE

**What changed:** Added `NodeInspector.tsx` with `InspectorNode` type (`id`, `rawText`, `rerankedText`, optional `score`, `status: 'kept' | 'pruned'`) and props `nodes`, `loading`, `error`. Component shows error first, then loading (role="status"), then list of nodes with Raw/Reranked labels and text, optional score and status (kept = green border, pruned = red). Styling uses semantic theme tokens only. Added `NodeInspector.test.tsx` (five tests: raw/reranked content and labels, loading, error, precedence). Added `NodeInspector.stories.tsx` (Default with mock nodes, Loading, Error). All gates pass: `yarn test` (23 passed), `yarn typecheck`, `yarn build-storybook`.

## Context

- Links: [PHASE_4.md](../PHASE_4.md), [PRD.md](../PRD.md), [TODO_04.md](TODO_04.md), [TODO_05.md](TODO_05.md)
- W4.1 (PHASE_4.md): "Implement a 'Node Inspector' to view raw vs. reranked context text."
- Phase 4 DoD: "The 'Context Pruning' visualization accurately reflects the mathematical scores assigned in Phase 2."
- Theme tokens from TODO_04 apply (e.g. `--color-bg-surface`, `--color-success`, `--color-danger` for kept vs pruned).
- Timeline (TODO_05) shows the phase flow; Node Inspector complements it by letting users inspect per-node content and scores.

## Description

Implement a **Node Inspector** React component that lets users view **raw** (Phase 1 retrieval) vs. **reranked** (Phase 2) context for trace nodes. The component displays one or more nodes with their context text and optional score/status (e.g. kept vs pruned). It is presentational and receives node data via props; no SSE or backend integration in this TODO. Use semantic theme tokens and Storybook for Loading, Default (with mock nodes), and Error states.

## Expected Inputs

- Theme tokens and theme store from TODO_04.
- Optional: a minimal node type (e.g. `InspectorNode` with `id`, `rawText`, `rerankedText`, `score`, `status: 'kept' | 'pruned'`) defined in this TODO or a shared types module.

## Expected Outputs

- A `<NodeInspector />` component that accepts props for nodes (and loading/error).
- For each node (or a selected node): visible **raw** context text and **reranked** context text (or a single text with a clear label), plus optional score and kept/pruned status.
- Styling via semantic CSS custom properties (e.g. `--color-bg-surface`, `--color-bg-muted`, `--color-success`, `--color-danger`, `--color-text-primary`).
- Storybook stories: **Loading**, **Default** (mock nodes with raw/reranked text and scores), **Error**.
- Unit tests that assert rendering of node content and loading/error states.

## Acceptance Criteria

- [x] A `NodeInspector` component exists (e.g. `src/dashboard/components/NodeInspector.tsx`) that accepts props for node list (or single node) and loading/error state.
- [x] The component can display at least: raw context text, reranked context text (or equivalent), and optional score/status (kept/pruned).
- [x] Styling uses semantic theme tokens only (no hard-coded hex for foreground/background/status).
- [x] Storybook story file (e.g. `NodeInspector.stories.tsx`) includes: Loading, Default (mock nodes), Error.
- [x] Unit tests (e.g. `NodeInspector.test.tsx`) verify node content and labels render, and loading/error states render when provided.
- [x] `yarn test` passes; `yarn typecheck` passes; `yarn build-storybook` succeeds.

## Test Plan

- **Unit (Vitest + React Testing Library):** Render `NodeInspector` with mock node(s); assert raw and reranked text (or labels) are present. Render with loading true and assert loading UI; render with error and assert error message.
- **Storybook:** Open Node Inspector stories; use theme toolbar to verify light/dark; visually verify Loading, Default (multiple nodes / kept vs pruned), and Error.
- **Gates:** `yarn test`, `yarn typecheck`, `yarn build-storybook` all exit 0.

## Files (expected)

- `src/dashboard/components/NodeInspector.tsx` (new)
- `src/dashboard/components/NodeInspector.stories.tsx` (new)
- `src/dashboard/components/NodeInspector.test.tsx` (new)
- Optionally: shared or local types for node shape (e.g. `InspectorNode`) if not inlined in the component

## Notes / Non-goals

- **No SSE or backend wiring** — component is props-driven; integration can be a later TODO.
- **No Timeline integration** in this TODO (e.g. clicking a timeline step to filter nodes); focus is the inspector UI only.
- Selection of "which node" to inspect can be a single node passed in, or a list with the first/selected one shown; exact UX is flexible as long as raw vs. reranked is visible.
