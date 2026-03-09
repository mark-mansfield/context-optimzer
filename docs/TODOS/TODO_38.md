# TODO_38: Content sanitization (strip HTML/script tags)

Status: DONE — Added `src/ingestion/sanitize.ts` and unit tests: strips script/style (with content), strips all HTML tags; preserves plain text and Markdown content; pure and deterministic.

## Context

- [docs/PRD.md](../PRD.md) — Sanitization: strip HTML/script tags from ingested content (Phase 0 / Security & Governance).
- [docs/SECURITY.md](../SECURITY.md) — Ingestion: strip HTML/Scripts, sanitize Markdown; ASI-01 mitigation (Indirect Prompt Injection).
- [docs/PHASE_1.md](../PHASE_1.md) — DoD: ingestion indexes MD/JSON/PDF with consistent chunking; security applies at ingestion.

## Description

Implement a **sanitization** step used during ingestion to strip HTML and script tags from ingested content. This reduces risk of Indirect Prompt Injection (ASI-01) and aligns with OWASP guidance. Sanitization runs before chunking and indexing so that only safe text reaches the vector and lexical stores.

## Expected Inputs

- Raw string content (e.g. from Markdown, JSON, or PDF text extraction).

## Expected Outputs

- Sanitized string: HTML tags, script tags, and optionally dangerous patterns removed; plain text and safe Markdown structure preserved where applicable.

## Acceptance Criteria

- [x] All HTML tags (e.g. `<div>`, `<script>`, `<img>`) are stripped or escaped so they are not executed or rendered as HTML.
- [x] Script and style tag contents are removed; no executable script reaches the index.
- [x] Logic is pure and deterministic; 100% TypeScript-typed with unit tests.

## Test Plan

- Unit tests: inputs containing `<script>`, `<img onerror>`, inline HTML; assert output has no executable tags.
- Regression: safe Markdown (headers, code blocks) is preserved for downstream chunking.

## Files (expected)

- New utility module (e.g. `src/ingestion/sanitize.ts` or `src/security/sanitize.ts`).
- Corresponding unit test file.

## Notes / Non-goals

- PII redaction is separate (Phase 2/3); this TODO is ingestion-time tag stripping only.
- Full Markdown AST sanitization is optional; minimum is tag stripping to prevent injection.
