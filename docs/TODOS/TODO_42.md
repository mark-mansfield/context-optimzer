# TODO_42: user_id metadata filtering at database level

Status: DONE — Added shared retrieval filter contract (`src/retrieval/types.ts`) and cross-store isolation integration test (`src/retrieval/user-filtering.test.ts`) proving no cross-tenant leakage across LanceDB and BM25. Verified with full `yarn test` + `yarn typecheck`.

## Context

- [docs/PHASE_1.md](../PHASE_1.md) — DoD: “All retrieved nodes are filtered by a `user_id` metadata tag at the database level.”
- [docs/SECURITY.md](../SECURITY.md) — Isolation: strict tenant/session isolation; User A’s context never influences User B.
- [docs/PRD.md](../PRD.md) — Phase 1 retrieval; Security & Governance.

## Description

Ensure that **all retrieval paths** (LanceDB and BM25) enforce `user_id` (or tenant) filtering at the database/index level so that no results from other users are ever returned. This may be implemented as part of TODO_39 and TODO_40; this TODO exists to explicitly verify and document the contract, and to add any shared abstraction or tests that guarantee both stores apply the filter consistently. If TODO_39 and TODO_40 already enforce `user_id` in their query APIs, this TODO can be a verification and integration-test task.

## Expected Inputs

- Query requests that include `user_id` (or tenant/session identifier).
- Both vector and lexical query paths.

## Expected Outputs

- Guarantee that LanceDB and BM25 query APIs only return nodes/chunks whose `user_id` metadata matches the request.
- Shared type or contract (e.g. `RetrievalFilter` with `user_id`) so future retrieval implementations also enforce it.
- Integration or unit tests that prove cross-tenant leakage is impossible (e.g. insert as user A, query as user B returns nothing).

## Acceptance Criteria

- [x] LanceDB queries are scoped by `user_id` (already in TODO_39; confirm and document).
- [x] BM25 queries are scoped by `user_id` (already in TODO_40; confirm and document).
- [x] At least one test demonstrates: data for user A is never returned when querying as user B.
- [x] No retrieval API allows “all users” or unfiltered results in production code paths.

## Test Plan

- Integration or unit test: seed data for `user_id: 'alice'` and `user_id: 'bob'`; query as `bob`; assert no `alice` documents in results for both vector and lexical.
- Optional: shared filter type and documentation in SYSTEM_DESIGN or SECURITY.

## Files (expected)

- Possibly updates to TODO_39/TODO_40 modules if filter was not yet applied; shared types or retrieval contract; test file(s).

## Notes / Non-goals

- Auth or session management (who is the current user) is out of scope; this TODO assumes `user_id` is provided by the caller.
- PII redaction and approval gates are separate (later phases).
