# TODO_13: Edit Correction (UI + Persistence)

Status: DONE

Completed: EditCorrection component with textarea (prefill), Submit correction button, onSubmit(traceId, correctedText); mock correction API in `src/api/correction.ts` (submitCorrection, getCorrection, clearCorrectionStore); Storybook Default, Submitting, Error; unit tests plus integration test that persists via mock API.

## Context

- Links: [PHASE_4.md](../PHASE_4.md), [TODO_11.md](TODO_11.md), [TODO_12.md](TODO_12.md)
- W4.3 (PHASE_4.md): "Implement 'Thumbs Up/Down' and **'Edit Correction'** features."
- Phase 4 DoD: Feedback and trace integrity; corrections are a form of feedback linked to trace_id.
- **Prerequisite:** TODO_11 (feedback UI pattern), TODO_12 (mock feedback API). TODO_12 implements a **stub mock API** for feedback (in-memory, no real backend/DB). This TODO adds the "edit correction" flow using the **same mock API pattern**: user can submit a corrected response for a trace; store it with trace_id via a mock correction API.

## Description

Implement the **Edit Correction** feature: (1) A UI component that allows the user to edit the model response (or a copy of it) and submit a "corrected" version. (2) **Mock persistence** of the correction linked to `trace_id`, using the same stub/mock API style as TODO_12 (e.g. POST/GET correction endpoint with in-memory store; no real backend or database). The correction is stored as feedback data (e.g. trace_id, corrected_text, timestamp) for use in evaluation or gold-set export (TODO_14).

## Expected Inputs

- Props/context: `traceId`, current response text (for prefill or display), `onSubmit` callback or API call to the **mock correction API**.
- Mock API: accept trace_id and corrected text (and optionally metadata); **mock-persist** (e.g. in-memory store, same pattern as TODO_12).

## Expected Outputs

- **UI:** An edit-correction control (e.g. "Edit correction" button + text area/modal) that lets the user submit a corrected response for the trace; wired to the mock correction API.
- **Persistence (mock):** Corrections stored in the mock store and linked to trace_id (e.g. GET by trace_id returns correction if present); **no real backend or DB**.
- Storybook story for the correction UI (default, submitting, error).
- Unit tests for UI behavior and for mock API/store (submit correction, fetch by trace_id, assert stored value).
- `yarn test`, `yarn typecheck`, `yarn build-storybook` pass.

## Acceptance Criteria

- [x] User can enter or edit a "corrected" response for a trace and submit it.
- [x] Correction is **mock-persisted** and linked to trace_id (same stub API pattern as TODO_12; no database required).
- [x] Storybook: at least Default and one async state (Submitting or Error).
- [x] Tests verify submit flow and mock persistence (e.g. submit then GET by trace_id).
- [x] `yarn test`, `yarn typecheck`, `yarn build-storybook` pass.

## Test Plan

- **Unit (Vitest + RTL):** Render correction UI; change text and submit; assert callback or mock API called with trace_id and corrected text. Mock persistence tests: submit correction, fetch by trace_id, assert stored value.
- **Storybook:** Verify correction control and states.
- **Gates:** `yarn test`, `yarn typecheck`, `yarn build-storybook`.

## Files (expected)

- `src/dashboard/components/EditCorrection.tsx` (or similar)
- `src/dashboard/components/EditCorrection.stories.tsx`
- `src/dashboard/components/EditCorrection.test.tsx`
- **Mock API/store** for correction (e.g. POST/GET correction by trace_id; in-memory or same stub module pattern as TODO_12; no DB adapter).

## Notes / Non-goals

- **No real backend or DB** — corrections use the same **stub mock API** pattern as TODO_12; real persistence when backend/DB exist can be a later TODO.
- Export to Gold-Set (TODO_14) will consume corrections and high-quality traces; no need to implement export in this TODO.
- Rich text or diff UI is out of scope unless specified; plain text correction is sufficient for MVP.
