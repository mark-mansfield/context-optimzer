# TODO_28: Add model routing fields to trace data model

Status: DONE — ProcessTrace, TraceViewTrace, and TraceForExport now include optional model, routingClass, routingConfidence (0–1), routingReason. Mock processQuery populates all four. Unit test added in process.test.ts.

## Context

- Links: [PRD.md](../PRD.md), [PHASE_4.md](../PHASE_4.md)
- Phase 3 routes queries by complexity (informational vs reasoning) to different models (e.g. Llama 3 / Claude 3.5 Sonnet). The dashboard and gold-set export need trace-level routing metadata for debugging and evaluation.

## Description

Add **model routing fields** to the trace data model so the UI and gold-set export support full debugging of the routing step. Extend `ProcessTrace` (and the trace shape used by TraceView/export) with: `model` (display name), `routingClass` (e.g. `"informational"` | `"reasoning"`), **`routingConfidence`** (number in 0–1: classifier confidence for the chosen class), and **`routingReason`** (optional short string: e.g. classifier rationale or feature summary). Update the mock process API to populate all of these so the dashboard can display them (TODOs 29–30) and the gold set can include them (TODO_31).

## Expected Inputs

- Existing `ProcessTrace` in `src/api/process.ts`.
- Trace shape used by TraceView and gold-set (`TraceForExport` / record builder).

## Expected Outputs

- `ProcessTrace` includes optional `model`, `routingClass`, **`routingConfidence`** (0–1), and **`routingReason`** (string). All four are first-class for routing-step debugging.
- TraceView trace type (e.g. `TraceViewTrace`) extended with same optional fields.
- Mock `processQuery` sets model, routingClass, routingConfidence, and routingReason on returned traces so UI and export have full routing debug data.
- `yarn test`, `yarn typecheck` pass.

## Acceptance Criteria

- [x] ProcessTrace (and TraceViewTrace) declare optional `model`, `routingClass`, `routingConfidence`, `routingReason`.
- [x] Mock process returns traces with model, routingClass, routingConfidence, and routingReason populated.
- [x] No breaking changes to existing trace consumers; new fields are optional.
- [x] Tests and typecheck pass.

## Test Plan

- Unit tests for process API: assert returned trace can include model, routingClass, routingConfidence, and routingReason when set.
- Gates: `yarn test`, `yarn typecheck`.

## Files (expected)

- `src/api/process.ts` (ProcessTrace interface, mock trace construction).
- `src/components/trace-view/index.tsx` or shared type (TraceViewTrace if defined there).
- `src/dashboard/goldSet/types.ts` (TraceForExport) if export needs to read these fields — minimal change; full export logic in TODO_31.

## Notes / Non-goals

- No new UI in this TODO; only data model and mock. UI (routing card, badge) and gold-set export are separate TODOs.
