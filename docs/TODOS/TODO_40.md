# TODO_40: BM25 sparse (lexical) index

Status: DONE — Added typed BM25-like lexical index (`src/retrieval/bm25-index.ts`) with deterministic tokenization, BM25 scoring, top-k search, and `user_id` filtering. Added unit tests for ranking and tenant isolation; validated with full `yarn test` + `yarn typecheck`.

## Context

- [docs/PHASE_1.md](../PHASE_1.md) — W1.1: Multi-Stream Indexing; BM25-compatible sparse index for keyword matching.
- [docs/PRD.md](../PRD.md) — Phase 1: BM25 (Lexical) search alongside Vector Search.
- [docs/SECURITY.md](../SECURITY.md) — Retrieval: enforce metadata filters (ACLs); tenant isolation via `user_id`.

## Description

Implement a **BM25-compatible sparse (lexical) index** for keyword-matching retrieval. The index should be buildable from text chunks (with optional metadata such as `user_id`), and support querying by keywords to return top-k document/chunk IDs or records. Results must be filterable by `user_id` so that only chunks belonging to the requesting user are returned.

## Expected Inputs

- Text chunks (and optional metadata, including `user_id`) for building the index.
- Query string (or tokenized terms) and `user_id` for scoped search; top-k parameter.

## Expected Outputs

- Index build API: add documents/chunks, then finalize or query.
- Query API: given query text and `user_id`, return top-k results (e.g. chunk IDs or records) ranked by BM25 relevance, restricted to that `user_id`.

## Acceptance Criteria

- [x] BM25 (or BM25-like) scoring is used for ranking; implementation or library is documented.
- [x] Index supports metadata filter by `user_id` at query time (tenant isolation).
- [x] APIs are 100% TypeScript-typed; unit tests cover build, query, and `user_id` filtering.
- [x] Integration point compatible with dual-stream retriever (TODO_43): returns list of ranked items that can be merged via RRF.

## Test Plan

- Unit tests: build index with chunks from two `user_id`s; query with one `user_id`; assert only that user’s chunks in results.
- Unit tests: query ranking order matches BM25 expectations for simple keyword queries.

## Files (expected)

- New module (e.g. `src/retrieval/bm25-index.ts` or `src/phase1/bm25.ts`).
- Corresponding unit test file.

## Notes / Non-goals

- Tokenization strategy can be simple (whitespace + optional stemming); no requirement for external NLP services.
- RRF merge (TODO_41) and dual-stream orchestration (TODO_43) consume this module’s output.
