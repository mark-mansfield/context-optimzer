# TODO_36: History sheet embed toggle (pin to sidebar) with code-splitting

Status: DONE

Completed: Added HistoryPanel (root `<aside>`), refactored HistorySheet to support `variant: 'sheet' | 'embedded'` with pin/unpin, Dashboard state and left sidebar when embedded; single lazy chunk preserved; `yarn test` passes.

## Context

- [docs/PHASE_4.md](docs/PHASE_4.md) — dashboard and trace history (W4.6; TODO_32–34: code-split history sheet, Suspense + error boundary).
- Trace history is currently a left-side sheet (lazy-loaded when user opens or prefetches). This TODO adds a **pin/embed** toggle: same content can be shown as an overlay sheet or as an inline left sidebar. All history UI must stay in one lazy chunk; Dashboard must not statically import history components.
- Relevant code: [src/dashboard/HistorySheet.tsx](src/dashboard/HistorySheet.tsx), [src/dashboard/Dashboard.tsx](src/dashboard/Dashboard.tsx).

## Description

Add a pin/embed button next to the sheet close button. When clicked, the trace history switches from overlay sheet to an inline left sidebar (`<aside>`), and vice versa. Extract shared content into a `HistoryPanel` (root `<aside>`), keep a single lazy-loaded chunk for all history UI, and preserve code-splitting (no new static imports of history in Dashboard).

## Expected Inputs

- User clicks History button: sheet opens (current behavior).
- User clicks pin button in sheet header: sheet closes, panel appears in left sidebar.
- User clicks unpin in embedded panel: sidebar hides; History button can open sheet again.
- Optional: `historyEmbedded` persisted in localStorage so choice survives reload.

## Expected Outputs

- HistoryPanel component (root `<aside>`) with header (title + pin/unpin + optional close) and trace list.
- HistorySheet refactored to use HistoryPanel and support `variant: 'sheet' | 'embedded'`; single lazy export.
- Dashboard: `historyEmbedded` state, left sidebar when embedded, mount lazy tree when `hasOpenedHistory || historyEmbedded`, pass `variant` and `onEmbedToggle`.

## Acceptance Criteria

- [x] Pin button in sheet header toggles to embedded left sidebar; same content visible.
- [x] Unpin (when embedded) hides sidebar; sheet can be opened again via History button.
- [x] HistoryPanel renders as `<aside>` and is used in both sheet and embedded layouts.
- [x] Single lazy import for history feature; chunk loads only when `hasOpenedHistory || historyEmbedded`.
- [x] Prefetch on History button hover/focus retained; no new static imports of history UI in Dashboard.
- [x] `yarn test` passes; no new TypeScript errors.

## Test Plan

- Manual/UI: open sheet, pin to sidebar, unpin, open sheet again; verify layout and behavior.
- Optional: unit test for HistoryPanel (props render list/header) if desired; existing Dashboard/HistorySheet behavior covered by current tests where applicable.

## Files (expected)

- `docs/TODOS/TODO_36.md` (this file)
- `src/dashboard/HistoryPanel.tsx` (new)
- `src/dashboard/HistorySheet.tsx` (refactor)
- `src/dashboard/Dashboard.tsx` (state, layout, variant/embed props)

## Notes / Non-goals

- Renaming error boundary to HistoryErrorBoundary is optional.
- localStorage persistence for `historyEmbedded` is optional.
