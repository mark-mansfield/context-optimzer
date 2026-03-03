# TODO_31: Gold-set export includes model, routing_class, routing_confidence, routing_reason

Status: TODO

## Context

- Links: [PRD.md](../PRD.md), [PHASE_4.md](../PHASE_4.md), [TODO_28.md](TODO_28.md)
- TODO_28 adds `model`, `routingClass`, `routingConfidence`, and `routingReason` to the trace. Gold-set exports should include this full routing metadata so evaluators can analyze router behavior, cost by model, correctness by routing class, and confidence/reason for debugging borderline cases.

## Description

Extend **gold-set record format and export** to include optional **model**, **routing_class**, **routing_confidence**, and **routing_reason** on each exported line. When building gold-set records from traces, copy all four from the trace into the record; when absent, omit the keys so JSONL remains valid. Keep backward compatibility: existing consumers that ignore extra keys still work; new consumers can use the fields for evaluation and routing-step debugging.

## Expected Inputs

- `GoldSetRecord` and `TraceForExport` in `src/dashboard/goldSet/types.ts`.
- `buildGoldSetRecords` and `goldSetRecordsToJsonl` in `src/dashboard/goldSet/export.ts`.
- Traces with optional `model`, `routingClass`, `routingConfidence`, `routingReason` from TODO_28.

## Expected Outputs

- `GoldSetRecord` has optional `model?: string`, `routing_class?: string`, `routing_confidence?: number`, `routing_reason?: string`.
- Export builder copies all four from trace into each record when present.
- Exported JSONL lines may look like: `{"trace_id":"...","query":"...","response":"...","exported_at":...,"model":"Claude 3.5 Sonnet","routing_class":"reasoning","routing_confidence":0.92,"routing_reason":"multi-step reasoning detected"}`.
- `yarn test`, `yarn typecheck` pass.

## Acceptance Criteria

- [ ] GoldSetRecord type includes optional model, routing_class, routing_confidence, routing_reason.
- [ ] buildGoldSetRecords maps trace.model, trace.routingClass, trace.routingConfidence, trace.routingReason into each record when present.
- [ ] goldSetRecordsToJsonl serializes the new fields; exported file is valid JSONL.
- [ ] Existing tests (e.g. export or gold-set tests) updated or extended; no regressions.
- [ ] Tests and typecheck pass.

## Test Plan

- Unit tests: build records from traces with and without model, routingClass, routingConfidence, routingReason; assert exported JSON contains expected keys and values.
- Gates: `yarn test`, `yarn typecheck`.

## Files (expected)

- `src/dashboard/goldSet/types.ts` (GoldSetRecord, optionally TraceForExport).
- `src/dashboard/goldSet/export.ts` (buildGoldSetRecords mapping).

## Notes / Non-goals

- Changing which traces are included (e.g. onlyThumbsUp) is out of scope; only adding fields to the record shape and export logic.
