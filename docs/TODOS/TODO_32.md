# TODO_32: Trace history list contract and presentational HistorySheet component

Status: DONE — Added TraceHistoryItem in src/dashboard/types.ts and presentational HistorySheet in HistorySheet.tsx; fixed ModelBadge provider type and pre-existing NodeInspector story / App test assertions.

## Context

- Plan: history sheet code-split with trace data separation (GraphQL-ready). Trace data stays in the shell; history UI is presentational and receives a minimal list shape.

## Description

Introduce a **minimal trace list type** (`TraceHistoryItem`: `trace_id`, `query`, optional `model`, `provider`) and a **presentational HistorySheet component** that renders the left-side Sheet with "Trace history" and the list. The component accepts only props: `traces: TraceHistoryItem[]`, `selectedTraceId`, `open`, `onOpenChange`, `onSelectTrace`. It does not fetch data or import the process API. This keeps the data layer separate so the list can later be fed by GraphQL.

## Expected Inputs

- Existing Sheet, ModelBadge, and list markup from [Dashboard.tsx](../../src/dashboard/Dashboard.tsx).

## Expected Outputs

- `TraceHistoryItem` type (e.g. in `src/dashboard/types.ts` or next to HistorySheet).
- `HistorySheet` component in `src/dashboard/HistorySheet.tsx` that renders Sheet + header + list from props only; no trace fetching.

## Acceptance Criteria

- [x] `TraceHistoryItem` has `trace_id`, `query`, optional `model`, `provider`.
- [x] `HistorySheet` accepts the props above and renders the same list/Sheet UI as current Dashboard; no imports from `@/api/process` or GraphQL.
- [x] `yarn test` and `yarn typecheck` pass.

## Test Plan

- Optional: unit test for HistorySheet with mock `TraceHistoryItem[]` and assert list items and callbacks. Gates: `yarn test`, `yarn typecheck`.

## Files (expected)

- `src/dashboard/types.ts` (or inline in HistorySheet file).
- `src/dashboard/HistorySheet.tsx`.

## Notes / Non-goals

- No lazy loading or Dashboard integration in this TODO; that is TODO_33. No error boundary here.
