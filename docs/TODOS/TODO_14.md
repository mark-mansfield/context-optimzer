# TODO_14: Export to Gold-Set Button

Status: DONE

Completed: Gold-set types and export in `src/dashboard/goldSet/` (types.ts, export.ts): `GoldSetRecord` (trace_id, query, response, exported_at), `buildGoldSetRecords(traces, { onlyThumbsUp })` using TODO_12 getFeedback and TODO_13 getCorrection (corrected response when present), `goldSetRecordsToJsonl`. ExportGoldSet button component triggers export/download; optional `onExport(jsonl)` and `onlyThumbsUp`. Unit tests for export logic and button; Storybook Default and OnlyThumbsUp.

## Context

- Links: [PHASE_4.md](../PHASE_4.md), [TODO_12.md](TODO_12.md), [TODO_13.md](TODO_13.md)
- W4.3 (PHASE_4.md): "Build a **'Export to Gold-Set'** button to turn high-quality traces into future evaluation benchmarks."
- **Prerequisite:** TODO_12 (mock feedback API: vote by trace_id), TODO_13 (mock correction API: corrected response by trace_id). This TODO adds the export action and format, **using those same mock APIs/stores** to read feedback and corrections when building the gold-set.

## Description

Implement an **Export to Gold-Set** feature: a button (or action) that exports selected or high-quality traces into a gold-set format suitable for evaluation benchmarks. **Integrate with TODO_12 and TODO_13:** use the **mock feedback API** (or store) to read vote by trace_id (e.g. "high-quality" = thumbs up) and the **mock correction API** (or store) to read corrected response by trace_id; when a correction exists, use it as the response in the gold-set record. Define what "high-quality" means (e.g. thumbs up, or has correction, or explicit selection). Output format should be machine-readable (e.g. JSON or JSONL) and include at least trace_id, query, response (or **corrected response when available from TODO_13**), and any minimal metadata needed for eval. The export may be client-side (collect trace data, query mock feedback/correction by trace_id, and download file) or server-side (API that uses same mocks); prefer the smallest viable implementation.

## Expected Inputs

- One or more traces (e.g. selected trace IDs or "all thumbs-up" traces). Trace/ExecutionTrace shape (trace_id, query, response, step_metrics/node_scores as needed).
- **TODO_12 mock:** ability to get feedback by trace_id (vote: 'up' | 'down', timestamp) — e.g. same in-memory store or GET endpoint from TODO_12.
- **TODO_13 mock:** ability to get correction by trace_id (corrected_text, timestamp) — e.g. same in-memory store or GET endpoint from TODO_13.

## Expected Outputs

- A button or control "Export to Gold-Set" that triggers export.
- Gold-set file (e.g. JSON/JSONL) containing trace records with at least: trace_id, query, response (or **corrected response from TODO_13 mock when present**), and minimal metadata.
- Export logic **reads feedback from TODO_12 mock** (e.g. filter by thumbs-up) and **corrections from TODO_13 mock** (use corrected_text as response when available).
- Criteria for which traces are included (e.g. user selection, thumbs-up from TODO_12, or has correction from TODO_13) documented or configurable.
- Unit tests: build gold-set from mock traces + TODO_12 mock feedback + TODO_13 mock corrections; assert export format, included fields, and that corrected response is used when present; optionally assert filtering (e.g. only thumbs-up).
- `yarn test`, `yarn typecheck` pass; Storybook story for the button/state if UI-only.

## Acceptance Criteria

- [x] "Export to Gold-Set" control exists and produces a downloadable (or API-returned) file.
- [x] Export uses **TODO_12 mock** to read feedback by trace_id (for filtering e.g. thumbs-up) and **TODO_13 mock** to read correction by trace_id (use corrected response in gold-set when present).
- [x] Export format is documented and includes trace_id, query, response (or corrected from TODO_13), and minimal metadata.
- [x] Inclusion criteria (which traces) are defined and implemented (e.g. selected, thumbs-up from TODO_12, or with correction from TODO_13).
- [x] Tests verify export structure, inclusion logic, and that corrected response is used when correction exists for a trace_id.
- [x] `yarn test`, `yarn typecheck` pass.

## Test Plan

- **Unit:** Build gold-set payload from mock traces + **TODO_12 mock feedback store/API** (e.g. set thumbs-up for some trace_ids) + **TODO_13 mock correction store/API** (e.g. set corrected_text for some trace_ids); assert schema and fields; assert corrected response appears in gold-set when correction exists; if filtering by quality, assert only qualifying traces (e.g. thumbs-up) included.
- **Gates:** `yarn test`, `yarn typecheck`.

## Files (expected)

- `src/dashboard/components/ExportGoldSet.tsx` (or button in existing view) and/or export util (e.g. `src/dashboard/goldSet/export.ts`) that **calls TODO_12 mock** (get feedback by trace_id) and **TODO_13 mock** (get correction by trace_id) when building gold-set records.
- Types for gold-set record format
- Tests for export logic and format, using the same mock feedback and correction modules/API as TODO_12 and TODO_13
- Optional: Storybook story for Export button

## Notes / Non-goals

- Full benchmark runner or eval harness is out of scope; only the export of traces to a gold-set file.
- Format should be compatible with common eval patterns (e.g. prompt + expected/completion pairs); exact schema can be refined in this TODO.
- **No new persistence** — reuse TODO_12 and TODO_13 mock APIs/stores only; do not introduce a separate backend or DB for export.
