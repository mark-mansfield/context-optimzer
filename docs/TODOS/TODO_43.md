# TODO_43: Dual-stream retriever orchestration (parallel semantic + lexical, RRF)

Status: DONE — Added typed dual-stream orchestration (`src/retrieval/dual-stream-retriever.ts`) that executes semantic+lexical retrieval in parallel via `Promise.all`, merges ranked IDs with RRF, deduplicates fused output, and returns Phase-2-ready retrieval nodes. Added tests for parallel execution latency budget, RRF dedupe behavior, and user-scoped propagation; validated with full `yarn test` + `yarn typecheck`.

## Context

- [docs/PHASE_1.md](../PHASE_1.md) — Dual-Stream Pipeline; async parallel execution; RRF merge; DoD: combined retrieval < 400ms.
- [docs/PRD.md](../PRD.md) — Phase 1: Vector + BM25, RRF merge, LanceDB.
- [docs/SYSTEM_DESIGN.md](../SYSTEM_DESIGN.md) — Phase 1: Hybrid Retriever outputs raw nodes to Phase 2.

## Description

Implement the **orchestration layer** that runs semantic (LanceDB) and lexical (BM25) search in parallel, then merges their results using the RRF function (TODO_41). The combined retrieval must complete in **under 400ms** (Phase 1 DoD). Input is a user query and `user_id`; output is a single ranked list of context nodes (e.g. chunk id, text, optional score) ready for downstream phases. Embedding of the query for vector search is assumed to be done by the caller or a dedicated embedding step so that this TODO focuses on parallel fetch + RRF.

## Expected Inputs

- User query (string).
- `user_id` for scoped retrieval.
- Optional: top-k per stream, RRF `k`, embedding of query (or callback to get embedding).

## Expected Outputs

- Single ranked list of context nodes (ids and/or text) after RRF merge.
- Execution time for combined retrieval < 400ms under defined test conditions (e.g. benchmark or test with timeout).
- Typed TypeScript API; 100% of retrieval logic typed (Phase 1 DoD).

## Acceptance Criteria

- [x] Semantic and lexical searches run in parallel (e.g. `Promise.all` or equivalent).
- [x] Results are merged via RRF (TODO_41); no duplicate nodes in final list.
- [x] All retrieval is filtered by `user_id` (via TODO_39 and TODO_40).
- [x] Combined retrieval (dense + sparse + merge) executes in < 400ms (measure in test or benchmark).
- [x] Unit or integration tests cover: parallel execution, RRF merge, and performance budget.
- [x] Output shape is suitable for Phase 2 (reranker) and dashboard trace (e.g. “Phase 1: Retrieval” nodes).

## Test Plan

- Integration test: mock or real LanceDB + BM25; run retriever; assert merged list and that both streams contributed.
- Performance test: assert elapsed time < 400ms for a representative query (or document the environment where this holds).
- Unit test with stubbed stores: verify RRF is called with correct inputs and output order.

## Files (expected)

- New module (e.g. `src/retrieval/dual-stream-retriever.ts` or `src/phase1/hybrid-retriever.ts`).
- Corresponding test file; possible shared types for “context node” or “retrieval result”.

## Notes / Non-goals

- Embedding model and query embedding are out of scope if already covered elsewhere; this TODO consumes query embedding and calls LanceDB + BM25 + RRF.
- Phase 2 reranking and Phase 3 routing are not in scope.
