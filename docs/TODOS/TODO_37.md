# TODO_37: Smart Chunking Strategy (Smart Splitter)

Status: DONE — Added `src/chunking/smart-splitter.ts` and unit tests: segments by fenced/indented code blocks and ATX headers, builds chunks with configurable maxChunkSize and overlap; deterministic; content preserved (normalized newlines).

## Context

- [docs/PHASE_1.md](../PHASE_1.md) — W1.3: Chunking Strategy; DoD requires consistent chunking for MD/JSON/PDF.
- [docs/PRD.md](../PRD.md) — Phase 0 & Phase 1: parse and chunk Markdown, JSON, PDF with consistent strategy (e.g. smart splitter that respects code blocks and headers).
- [docs/SYSTEM_DESIGN.md](../SYSTEM_DESIGN.md) — Pipeline feeds Phase 1 retriever.

## Description

Implement a **Smart Splitter** that produces consistent chunks from raw document text while respecting code blocks and technical headers to prevent context fragmentation. The splitter will be used by the ingestion pipeline (TODO_44) and must support Markdown, JSON, and PDF-derived text. Chunks should have stable boundaries (e.g. by headers, code fences, or size with overlap) so that retrieval indexes receive coherent segments.

## Expected Inputs

- Raw text (string) from parsed Markdown, JSON, or PDF.
- Optional config: max chunk size, overlap, separators (headers, code blocks, paragraphs).

## Expected Outputs

- Array of text chunks (strings) suitable for embedding and BM25 indexing.
- Chunks do not split mid–code-block or mid–header; boundaries align to semantic structure where possible.

## Acceptance Criteria

- [x] Splitter respects Markdown code blocks (fenced and indented) and does not fragment them.
- [x] Splitter respects technical headers (e.g. `##`, `###`) as preferred split points.
- [x] Configurable max chunk size and optional overlap; output is deterministic for same input.
- [x] 100% TypeScript-typed; unit tests cover code-block preservation and header-boundary behavior.

## Test Plan

- Unit tests: input with code blocks and headers; assert no chunk contains a partial code block or broken header.
- Property-style: chunk concatenation (with separators) preserves original content semantics where applicable.

## Files (expected)

- New module under `src/` (e.g. `chunking/` or `ingestion/smart-splitter.ts`).
- Corresponding unit test file.

## Notes / Non-goals

- Actual ingestion script or LanceDB/BM25 writes are out of scope (TODO_44).
- PDF/JSON parsing details may be in a separate parser layer; this TODO consumes already-extracted text.
