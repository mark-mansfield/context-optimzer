# TODO_41: Reciprocal Rank Fusion (RRF) merge function

Status: TODO

## Context

- [docs/PHASE_1.md](../PHASE_1.md) — W1.2: RRF Merge Logic; merging algorithm RRF with configurable `k` (default 60); DoD: unit tests for RRF merge.
- [docs/PRD.md](../PRD.md) — Phase 1: RRF to merge Vector + BM25 results.
- [docs/SYSTEM_DESIGN.md](../SYSTEM_DESIGN.md) — Phase 1 produces ranked context nodes from dual streams.

## Description

Implement the **Reciprocal Rank Fusion (RRF)** function that combines two (or more) ranked lists of items into a single ranked list. Each item is typically identified by a stable ID (e.g. chunk or node ID). RRF score for an item is the sum over lists of `1 / (k + rank)` where `rank` is 1-based and `k` is a configurable constant (default 60). Items appearing in multiple lists get higher fused scores; final list is sorted by fused score descending.

## Expected Inputs

- Two or more ordered arrays of item identifiers (e.g. `string[]` or `{ id: string }[]`) from semantic and lexical streams.
- Optional hyperparameter `k` (number, default 60).

## Expected Outputs

- Single ordered array of item identifiers (or full items with fused score) sorted by RRF score descending, with no duplicates (each node appears once).

## Acceptance Criteria

- [ ] RRF formula implemented correctly: score(node) = sum over lists of `1 / (k + rank)`.
- [ ] Parameter `k` is configurable; default 60 per PHASE_1.md.
- [ ] Output is deterministic; ties can be broken by order of first appearance or stable sort.
- [ ] 100% TypeScript-typed; unit tests cover formula, multiple lists, and missing items in one list.
- [ ] Phase 1 DoD: unit tests for RRF merge function present and passing.

## Test Plan

- Unit tests: two lists with overlapping and distinct IDs; assert fused order and that RRF scores match hand-calculated values.
- Property-style: items in both lists rank higher than items in only one list (for same k).

## Files (expected)

- New module (e.g. `src/retrieval/rrf.ts` or `src/phase1/rrf.ts`).
- Corresponding unit test file.

## Notes / Non-goals

- Fetching the two lists from LanceDB and BM25 is TODO_43; this TODO is pure RRF logic only.
