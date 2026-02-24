# TODO_12: Persist Feedback (Mock API for Up/Down Votes)

Status: DONE

Completed: Added mock feedback API in `src/api/feedback.ts`: `FeedbackRecord` (trace_id, vote, timestamp), in-memory store, `submitFeedback(trace_id, vote)`, `getFeedback(trace_id)`, `clearFeedbackStore()` for tests. Unit tests verify submit, get by trace_id, unknown id returns null, overwrite. No dashboard wiring in this TODO.

## Context

- Links: [PHASE_4.md](../PHASE_4.md), [TODO_11.md](TODO_11.md)
- W4.3 (PHASE_4.md): "Implement 'Thumbs Up/Down' … features."
- Phase 4 DoD: "Feedback Functional: User feedback (up/down votes) is successfully persisted to the database and linked to the specific trace_id."
- **Prerequisite:** TODO_11 (Feedback UI) provides the callbacks; this TODO implements a **mock** API so the frontend can call it; no backend or database exists yet — persistence here is mock-only (e.g. in-memory) until a real backend is built.

## Description

Implement a **mock** Thumbs Up/Down API: an endpoint (e.g. POST) that accepts `trace_id` and `vote` (`up` | `down`) and returns success. **No real backend or database** — use in-memory storage or a stub that simulates persistence. Define a minimal feedback shape (trace_id, vote, timestamp) for the API contract. No frontend wiring required in this TODO beyond what is needed to verify the API; dashboard wiring can be a follow-up or part of integration.

## Expected Inputs

- Request: `trace_id` (string), `vote` ('up' | 'down').
- No backend or DB; mock only (e.g. in-memory map or stub).

## Expected Outputs

- An API (e.g. `POST /api/feedback` or equivalent) that accepts `trace_id` and `vote` and **mocks** persistence (e.g. stores in memory or returns success without real storage).
- Feedback "records" only in the mock (e.g. in-memory); schema/documentation includes trace_id, vote, timestamp for the API contract.
- Unit or integration tests that submit feedback and assert the mock stores/returns it (e.g. retrievable by trace_id).
- `yarn test` and `yarn typecheck` pass.

## Acceptance Criteria

- [x] API endpoint exists to submit feedback (trace_id + vote).
- [x] Feedback is **mock-persisted** (e.g. in-memory) and associated with the given trace_id; **no database required**.
- [x] Schema/documentation for feedback record (trace_id, vote, timestamp at minimum).
- [x] Tests verify submission and that the mock stores/returns feedback by trace_id.
- [x] `yarn test`, `yarn typecheck` pass.

## Test Plan

- **Unit/Integration:** Call API with trace_id and vote; verify mock stores the record; query by trace_id and assert vote and timestamp.
- **Gates:** `yarn test`, `yarn typecheck`.

## Files (expected)

- API route or service (e.g. `src/api/feedback.ts` or server route)
- Feedback schema/types (e.g. in `src/dashboard/` or shared types)
- **Mock store** for feedback (e.g. in-memory map or stub module); no DB adapter.
- Tests for the API and mock persistence

## Notes / Non-goals

- **No real backend or DB** — this TODO implements a **mock** Thumbs Up/Down API only; real persistence can be a later TODO when backend/DB exist.
- Full dashboard integration (connecting FeedbackButtons to this API) can be this TODO or a small follow-up; scope to "mock API works and is testable."
- Edit Correction persistence is TODO_13. Export to Gold-Set is TODO_14.
