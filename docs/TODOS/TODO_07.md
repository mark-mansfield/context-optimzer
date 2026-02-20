# TODO_07: TraceView Layout — Wiring Timeline ↔ Node Inspector

Status: DONE

**What changed:** Extended Timeline with optional `selectedStep` and `onStepSelect`; steps render as buttons when `onStepSelect` is provided and the selected step is highlighted. Added TraceView container that composes Timeline and NodeInspector with shared state: TraceView holds `selectedStep` (default `retrieval`) and passes trace (steps), `selectedStep`, and `onStepSelect` to Timeline; derives `nodesForStep` (retrieval/rerank → trace.nodes, response → []) and passes nodes + loading/error to NodeInspector. Added `TraceViewTrace` type (extends TimelineTrace with `nodes?: InspectorNode[]`). Layout: flex column, Timeline above Node Inspector. Added TraceView.test.tsx (composes and shows nodes; step selection updates inspector; loading/error passed to children) and TraceView.stories.tsx (Default, Loading, Error). All gates pass: `yarn test` (28 passed), `yarn typecheck`, `yarn build-storybook`.

## Context

- Links: [PHASE_4.md](../PHASE_4.md), [TODO_05.md](TODO_05.md), [TODO_06.md](TODO_06.md)
- W4.1 (PHASE_4.md): Timeline maps Phase 1 → Phase 3; Node Inspector shows raw vs. reranked context. This TODO composes them.
- **Prerequisites:** TODO_05 (Timeline) and TODO_06 (Node Inspector) must be done. TraceView consumes both and owns shared state.

## Description

Implement a **TraceView** container that composes the Timeline and Node Inspector with **shared state**: the parent holds the trace data and the **selected step** (phase). Timeline shows the phases and reports step selection; Node Inspector receives the same trace and selected step and displays nodes appropriate to that phase (e.g. Retrieval → raw only; Rerank → raw + reranked + scores). No SSE or backend in this TODO — TraceView receives trace (and loading/error) via props.

### Wiring (Timeline ↔ Node Inspector)

- **State in parent:** TraceView holds `selectedStep: 'retrieval' | 'rerank' | 'route'` (or equivalent step id/index) and the full trace (steps + nodes).
- **Timeline** receives: `steps` (or derived from trace), `selectedStep`, `onStepSelect(step)`. On step click, it calls `onStepSelect`; TraceView updates `selectedStep`.
- **Node Inspector** receives: `nodes` (from trace), `selectedStep`. It derives what to show: for `retrieval` show raw context; for `rerank` show raw + reranked + score/status; for `route` show nothing or a short summary. Optional: also pass `selectedNodeId` and allow drilling into one node (list or table can set this in a follow-up).
- **Data shape:** Trace includes phases and a list of nodes; each node has `id`, `rawText`, `rerankedText` (or same as raw for Phase 1), `score`, `status: 'kept' | 'pruned'`. Types can live in a shared `trace` types module used by Timeline, NodeInspector, and TraceView.

## Expected Inputs

- Existing `<Timeline />` and `<NodeInspector />` from TODO_05 and TODO_06, with props as specified there (or extended with `selectedStep` / `onStepSelect` as needed).
- Shared trace type (from TODO_05/06 or new in this TODO) that includes steps and nodes.

## Expected Outputs

- A `<TraceView />` component that renders Timeline and Node Inspector in a layout (e.g. Timeline above, Node Inspector below or beside).
- TraceView owns `selectedStep` state and passes it (and trace-derived props) to both children; Timeline step clicks update `selectedStep` and Node Inspector content updates accordingly.
- Storybook story for TraceView with mock trace: clicking Timeline steps changes what Node Inspector shows.
- Unit test(s) that assert step selection updates and that Node Inspector receives the correct props for the selected step.
- `yarn test`, `yarn typecheck`, `yarn build-storybook` all pass.

## Acceptance Criteria

- [x] `TraceView` exists (e.g. `src/dashboard/components/TraceView.tsx`) and composes `Timeline` and `NodeInspector`.
- [x] TraceView holds `selectedStep` (or equivalent) in component state and passes it to Timeline and Node Inspector.
- [x] Timeline receives an `onStepSelect` (or equivalent) callback; clicking a step updates TraceView state and thus the selected step.
- [x] Node Inspector receives `nodes` and `selectedStep` and displays phase-appropriate content (retrieval vs rerank vs route).
- [x] Layout is explicit (CSS/Tailwind): Timeline and Node Inspector are both visible and clearly related (e.g. stacked or two-column).
- [x] TraceView story in Storybook uses mock trace; changing selected step via Timeline updates the Node Inspector content.
- [x] Unit test(s) verify that after a step is selected, Node Inspector gets the expected props (or that content changes); and/or that Timeline receives and uses `selectedStep` and `onStepSelect`.
- [x] `yarn test`, `yarn typecheck`, `yarn build-storybook` exit 0.

## Test Plan

- **Unit:** Render TraceView with mock trace; simulate Timeline step click (or call the callback passed to Timeline); assert state update and/or that NodeInspector is rendered with the correct `selectedStep`/nodes for that phase.
- **Storybook:** Open TraceView story; click each Timeline step and confirm Node Inspector content updates (e.g. Rerank shows scores, Route shows summary or empty).
- **Gates:** `yarn test`, `yarn typecheck`, `yarn build-storybook`.

## Files (expected)

- `src/dashboard/components/TraceView.tsx` (new)
- `src/dashboard/components/TraceView.stories.tsx` (new)
- `src/dashboard/components/TraceView.test.tsx` (new)
- If not already present: shared types for trace/steps/nodes (e.g. `src/dashboard/types/trace.ts`) so Timeline, NodeInspector, and TraceView use a consistent shape.

## Notes / Non-goals

- **No SSE or backend:** TraceView receives trace via props; live streaming integration is a later TODO.
- **Optional:** `selectedNodeId` for drilling into a single node in the inspector can be added in this TODO or a follow-up; minimal scope is phase-level selection driving Node Inspector content.
- Timeline and NodeInspector may need small prop extensions (e.g. `selectedStep`, `onStepSelect`) if not already present; implement only what’s needed for this wiring.
