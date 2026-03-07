# TODO_17: Wire feedback, correction, and export on trace detail

Status: DONE

Completed: Trace detail in App.tsx now includes FeedbackButtons (wired to submitFeedback/getFeedback with feedbackVersion state to refresh vote display), EditCorrection (wired to submitCorrection, initialResponse from getCorrection or trace.response, keyed by trace_id), and ExportGoldSet (traces={traces}). All use mock APIs; no LLM or backend. yarn test and yarn typecheck pass.

## Context

- Links: [PRD.md](../PRD.md), [PHASE_4.md](../PHASE_4.md), [TODO_12.md](TODO_12.md), [TODO_13.md](TODO_13.md), [TODO_14.md](TODO_14.md), [TODO_16.md](TODO_16.md)
- TODO_16 delivers the dashboard layout and trace detail view (TraceView). The dashboard already has FeedbackButtons, EditCorrection, and ExportGoldSet components, and mock APIs for feedback (TODO_12) and correction (TODO_13). This TODO **wires** those components to the mock APIs on the trace detail view so the user can "play" with voting, correcting, and exporting.

## Description

On the **trace detail** view (the view that shows TraceView for the selected trace), add and wire: (1) **FeedbackButtons** — wire to `submitFeedback` and `getFeedback` from `@/api/feedback`; pass current trace's trace_id; show current vote (from getFeedback) and handle loading/error. (2) **EditCorrection** — wire to `submitCorrection` from `@/api/correction`; pass trace_id; optionally preload existing correction via getCorrection for display. (3) **ExportGoldSet** — provide the current trace (or the full trace list) so the user can export to gold-set; use existing `buildGoldSetRecords` which already uses getFeedback and getCorrection. Ensure all three features work against the mock APIs (no backend/LLM). Optional: CostDisplay and TokensSaved on the same view if trace data includes cost/token fields; otherwise omit or stub.

## Expected Inputs

- Trace detail view from TODO_16 (selected trace with trace_id and TraceViewTrace data).
- Existing: FeedbackButtons, EditCorrection, ExportGoldSet; api/feedback (submitFeedback, getFeedback); api/correction (submitCorrection, getCorrection); goldSet/export (buildGoldSetRecords, goldSetRecordsToJsonl).

## Expected Outputs

- Trace detail shows TraceView plus FeedbackButtons, EditCorrection, and ExportGoldSet, all wired to mock APIs.
- Thumbs up/down persists via submitFeedback; current vote reflected via getFeedback.
- Edit correction persists via submitCorrection; user can submit corrected text for the trace.
- Export to Gold-Set produces a download (or file) that includes the selected trace(s), with feedback and correction applied per TODO_14 (corrected response when present, optional onlyThumbsUp filter).
- `yarn test`, `yarn typecheck` pass.

## Acceptance Criteria

- [x] FeedbackButtons on trace detail call submitFeedback on vote and reflect state from getFeedback.
- [x] EditCorrection on trace detail calls submitCorrection with the trace's trace_id.
- [x] ExportGoldSet is available (e.g. "Export to Gold-Set" with current trace or trace list) and export uses feedback/correction from mock APIs.
- [x] User can play with vote, correction, and export without any LLM or real backend.
- [x] Existing tests and typecheck pass.

## Test Plan

- Unit tests for any new wiring logic if extracted; otherwise rely on existing component tests and manual verification that trace detail integrates all three features.
- Gates: `yarn test`, `yarn typecheck`.

## Files (expected)

- `src/dashboard/App.tsx` or trace-detail component: add FeedbackButtons, EditCorrection, ExportGoldSet to the trace detail section and connect them to `@/api/feedback`, `@/api/correction`, and gold-set export.

## Notes / Non-goals

- No new APIs; reuse existing mock feedback, correction, and export logic.
- No LLM or real backend; this is frontend-only wiring for playability.
