# TODO_15: Mock process / trace API

Status: DONE

Completed: Added `src/api/process.ts` with `processQuery(query)`, `getTrace(trace_id)`, `listTraces()`, `clearProcessStore()`. ProcessTrace has trace_id, query, response, traceId, steps, nodes (TraceView- and TraceForExport-compatible). Unit tests in `src/api/process.test.ts`. No LLM or external calls.

## Context

- Links: [PRD.md](../PRD.md), [PHASE_4.md](../PHASE_4.md)
- Phase 4 dashboard is built with mock feedback (TODO_12) and mock correction (TODO_13). There is no LLM connection. To "play with" the dashboard, the app needs a way to "run a query" and get back a trace without calling any real backend or LLM.
- This TODO adds a **mock process API** that accepts a query and returns a trace (TraceViewTrace-shaped) from an in-memory store.

## Description

Implement a **mock process API** (e.g. in `src/api/process.ts` or `src/api/trace.ts`): a function that accepts a query string and returns a new execution trace suitable for the dashboard. The trace must include at least: `trace_id`, `query`, `response`, and the shape expected by TraceView (`traceId`, `steps`, `nodes` with `InspectorNode`). No real LLM or DCO engine — generate deterministic or sample data (e.g. fixed steps, a few mock nodes with rawText/rerankedText/score/status). Optionally provide `listTraces()` and/or `getTrace(trace_id)` so the UI can show history and load a single trace. Use an in-memory store; expose a test helper to clear the store. Add unit tests for the API contract (submit returns trace with required fields; list/get behave as expected).

## Expected Inputs

- Query string (user input).
- Optional: trace_id for getTrace.

## Expected Outputs

- `processQuery(query: string): Promise<Trace>` (or equivalent) returning a trace that matches TraceViewTrace (traceId, steps, nodes) plus query/response for gold-set and display.
- Optional: `listTraces(): Promise<TraceSummary[]>` and `getTrace(trace_id: string): Promise<Trace | null>`.
- Trace type compatible with `TraceView` and with `GoldSetRecord` input (trace_id, query, response).
- Unit tests; `yarn test` and `yarn typecheck` pass.
- Clear/store reset helper for tests.

## Acceptance Criteria

- [x] Mock process function exists and returns a trace with trace_id, query, response, and TraceViewTrace shape (traceId, steps, nodes).
- [x] No LLM or external API calls; all data is in-memory / deterministic.
- [x] UI can call this API to "run a query" and display the result in TraceView.
- [x] Optional list/get implemented if needed for trace history in the app.
- [x] Tests verify returned shape and store behavior; `yarn test`, `yarn typecheck` pass.

## Test Plan

- Unit tests: call process with a query; assert returned object has required fields and correct types; assert list/get if implemented; assert clear resets store.

## Files (expected)

- `src/api/process.ts` (or `src/api/trace.ts`) with mock process, optional list/get, and clear helper.
- `src/api/process.test.ts` (or equivalent).
- Types may live in dashboard (TraceViewTrace, InspectorNode) or be re-exported; ensure process returns a type that TraceView and gold-set export can consume.

## Notes / Non-goals

- No real DCO engine, no LLM, no SSE streaming; this is mock-only for frontend playability.
- Cost/token fields on the trace are optional; can be added in this TODO or later if CostDisplay/TokensSaved need them.
