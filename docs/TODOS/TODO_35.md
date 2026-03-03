# TODO_35: Update PHASE_4 (W4.6 visual) and PRD for history code-split and data separation

Status: DONE — Added W4.6 (visual) to PHASE_4 table and Domain Concerns; added trace list code-split and data-separation bullet to PRD Phase 4.

## Context

- Implements documentation follow-up for the history sheet code-split (TODO_32–TODO_34): trace history loads on user intent, presentational UI with trace data kept separate for future GraphQL.

## Description

Update **PHASE_4** and the **PRD** so they reflect the trace history sheet behavior and architecture: (1) Add **W4.6 (visual)** in PHASE_4 describing the trace history as a code-split, user-intent-driven sheet (lazy load, Suspense, error boundary, prefetch) with trace data separation. (2) Update the **PRD** Phase 4 requirements to state that the trace list (sidebar/sheet) is loaded on user intent and that list data is kept separate from the history UI so it can be supplied by GraphQL later.

## Expected Inputs

- [PHASE_4.md](../PHASE_4.md) (Visual work items table and Domain Concerns & Work Items).
- [PRD.md](../PRD.md) (Phase 4: Observability Dashboard requirements).

## Expected Outputs

- PHASE_4: New work item **W4.6 (visual)** in the visual work items table and in the Domain Concerns section, referencing trace history sheet code-split, user-intent loading, and trace data separation (TODO_32–TODO_34).
- PRD: Phase 4 requirements updated to mention trace list/sidebar is code-split on user intent and that trace list data is supplied by the shell (GraphQL-ready).

## Acceptance Criteria

- [x] PHASE_4 lists W4.6 (visual) with a short description of history sheet code-split and data separation; optional reference to TODO_32–TODO_34.
- [x] PRD Phase 4 includes the trace list code-split and data-separation intent in the dashboard requirements.
- [x] No code or test changes; documentation only.

## Test Plan

- Read-through of PHASE_4 and PRD for consistency with implemented behavior.

## Files (expected)

- `docs/PHASE_4.md`
- `docs/PRD.md`

## Notes / Non-goals

- Changing other work items or PRD sections. No implementation work.
