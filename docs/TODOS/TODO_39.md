# TODO_39: LanceDB vector store for semantic search

Status: TODO

## Context

- [docs/PHASE_1.md](../PHASE_1.md) — W1.1: Multi-Stream Indexing; LanceDB as embedded vector store; DoD: retrieval logic typed, user_id filter at DB level.
- [docs/PRD.md](../PRD.md) — Phase 1: Vector Search (Semantic), LanceDB for local-first storage.
- [docs/SECURITY.md](../SECURITY.md) — Metadata anchoring; tenant/session isolation (User A vs User B).
- [docs/SYSTEM_DESIGN.md](../SYSTEM_DESIGN.md) — Phase 1 Hybrid Retriever consumes vector + lexical.

## Description

Implement the **LanceDB** vector store integration for semantic (dense) search. This includes: creating/opening a table with an embedding column and metadata (including `user_id` for filtering), inserting embedding vectors with metadata, and querying by vector to return top-k results. The store must support filtering by `user_id` at query time so that retrieval is tenant-isolated.

## Expected Inputs

- Embedding vectors (numeric arrays) and associated metadata (e.g. `user_id`, `text`, `chunk_id`).
- Query embedding vector and `user_id` for scoped search; top-k parameter.

## Expected Outputs

- Ability to add vectors + metadata to the store and to run similarity search returning top-k rows filtered by `user_id`.
- Typed TypeScript API (no untyped escape hatches in retrieval logic).

## Acceptance Criteria

- [ ] LanceDB table created/opened with schema supporting embedding dimension and metadata (including `user_id`).
- [ ] Insert and query APIs are typed; query accepts `user_id` and returns only rows matching that metadata.
- [ ] Unit tests cover: insert, query by vector, and filter-by-`user_id` behavior.
- [ ] 100% of retrieval logic in this module is TypeScript-typed (per Phase 1 DoD).

## Test Plan

- Unit tests: insert documents with different `user_id`; query with one `user_id`; assert results only from that user.
- Unit tests: query returns top-k by similarity; k and ordering are correct.

## Files (expected)

- New module (e.g. `src/retrieval/lancedb-store.ts` or under `src/phase1/`).
- Corresponding unit test file.
- Optional: shared types for document/node metadata.

## Notes / Non-goals

- Embedding model integration (e.g. Transformers.js) can be a separate TODO or existing dependency; this TODO assumes vectors are supplied by the caller.
- BM25 index is separate (TODO_40). RRF merge is TODO_41.
