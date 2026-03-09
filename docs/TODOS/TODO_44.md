# TODO_44: Ingestion pipeline (parse MD/JSON/PDF → sanitize → chunk → dual index)

Status: DONE — Implemented build-time ingestion pipeline (`src/ingestion/pipeline.ts`) for MD/JSON/PDF → sanitize → smart split → dual indexing (LanceDB + BM25 snapshot), plus integration test (`src/ingestion/pipeline.test.ts`) and build scripts (`ingest:kb`, `build:with-kb`). Added `.cursorignore` entry for `docs/knowledge-base/**`. Verified with full `yarn test` + `yarn typecheck`.

## Context

- [docs/PHASE_1.md](../PHASE_1.md) — DoD: “Successfully parses and indexes Markdown, JSON, and PDF formats with consistent chunking.”
- [docs/PRD.md](../PRD.md) — Phase 0: build-time ingestion; parse/chunk Markdown, JSON, PDF; sanitize; write to LanceDB + BM25; output to fixed path (e.g. `dist/data/` or `public/data/`); knowledge-base source in `.cursorignore`.
- [docs/SECURITY.md](../SECURITY.md) — Ingestion: strip HTML/scripts, sanitize Markdown.

## Description

Implement the **ingestion pipeline** that: (1) reads source documents from a configured path (e.g. `content/` or `docs/knowledge-base/`), (2) parses Markdown, JSON, and PDF into raw text, (3) sanitizes content (strip HTML/script tags — TODO_38), (4) chunks with the Smart Splitter (TODO_37), (5) assigns `user_id` or default tenant for the build-time corpus, (6) writes embeddings and metadata to LanceDB (TODO_39) and text to BM25 index (TODO_40), and (7) writes indexes to a fixed output path so the built app can load them at runtime. For the demo, ingestion is **build-time only** (e.g. `yarn build:with-kb`); no runtime upload or multi-tenant ingestion. Ensure the knowledge-base source directory is listed in `.cursorignore` so agent tools do not read/index that content.

## Expected Inputs

- Config: source path (e.g. `content/` or `docs/knowledge-base/`), output path (e.g. `dist/data/` or `public/data/`), optional `user_id` for corpus.
- Corpus files: Markdown, JSON, and PDF in the source path.

## Expected Outputs

- LanceDB table and BM25 index persisted to the output path.
- Build script (e.g. `yarn build:with-kb`) that runs the pipeline; `yarn build` may or may not run it by default per PRD.
- Knowledge-base source directory added to `.cursorignore`.
- Documented chunking and sanitization so that Phase 1 retrieval runs against real content.

## Acceptance Criteria

- [x] Markdown, JSON, and PDF are parsed and converted to text; chunking uses Smart Splitter (TODO_37).
- [x] All content is sanitized (TODO_38) before chunking and indexing.
- [x] Embeddings are written to LanceDB with metadata (including `user_id`); BM25 index is built from same chunks.
- [x] Output is written to configured path; app can load from it at runtime.
- [x] Source directory for knowledge-base is in `.cursorignore`.
- [x] Pipeline is runnable via a defined script (e.g. `yarn build:with-kb`); no runtime ingestion in this TODO.

## Test Plan

- Integration test: run pipeline on a small fixture (one MD, one JSON, one PDF); assert output path contains LanceDB data and BM25 index; run retriever (TODO_43) and get non-empty results.
- Unit tests for parsers (MD/JSON/PDF) if not covered elsewhere.

## Files (expected)

- Ingestion script or module (e.g. `scripts/ingest.ts` or `src/ingestion/pipeline.ts`).
- Config or env for paths; updates to `package.json` for `build:with-kb`.
- `.cursorignore` update.
- Possibly parser modules for MD/JSON/PDF under `src/ingestion/` or `scripts/`.

## Notes / Non-goals

- Multi-tenant or user-upload ingestion is out of scope; single index per build.
- Embedding model choice and execution may be in this pipeline or a shared service; dependency on LanceDB and BM25 write APIs from TODO_39 and TODO_40.
