# TODO_33: Lazy-load HistorySheet with Suspense, error boundary, and prefetch

Status: DONE — Dashboard uses React.lazy(HistorySheet), hasOpenedHistory gate, Suspense with left-panel fallback, HistorySheetErrorBoundary with Retry, prefetch on History button hover/focus; trace list mapped to TraceHistoryItem[].

## Context

- Depends on TODO_32 (HistorySheet component and TraceHistoryItem). Plan: code-split history on user intent; preserve close animation; keep trace data in Dashboard.

## Description

Wire the trace history sheet as a **lazy-loaded** component: load the chunk only after the user shows intent (hover on history button) . Add **Suspense** with a minimal left-panel fallback, an **error boundary** around the lazy HistorySheet (message + Retry on chunk load failure), and **prefetch** on History button `onMouseEnter`/`onFocus`. Use a **hasOpenedHistory** gate so the Sheet stays mounted after first open (close animation works). Dashboard maps `ProcessTrace[]` to `TraceHistoryItem[]` and passes props into the lazy component; trace data remains owned by Dashboard.

## Expected Inputs

- `HistorySheet` and `TraceHistoryItem` from TODO_32.
- Current Dashboard state: `traces`, `selectedTraceId`, `historySheetOpen`, `setHistorySheetOpen`, `setSelectedTraceId`.

## Expected Outputs

- Dashboard uses `React.lazy(() => import("./HistorySheet")...)`; renders lazy HistorySheet only when `hasOpenedHistory` is true; passes `open={historySheetOpen}`, `onOpenChange`, and mapped `traces`/`selectedTraceId`/`onSelectTrace`.
- Suspense wrap with a minimal loading fallback (e.g. left-side "Loading…" panel).
- Error boundary component that catches chunk load errors and shows "Couldn't load history" + Retry (re-mount lazy child).
- History button triggers prefetch (e.g. `import("./HistorySheet")`) on mouse enter and focus.

## Acceptance Criteria

- [x] History sheet JS loads only after user opens (or prefetches); first open may show fallback briefly.
- [x] Closing the sheet runs the existing close animation (Sheet stays mounted when `hasOpenedHistory` is true).
- [x] Failed chunk load is caught; user sees message and can Retry.
- [x] Prefetch on History button hover/focus reduces perceived load on first click.
- [x] `yarn test` and `yarn typecheck` pass.

## Test Plan

- Manual: open history (see fallback if any), close (see animation), retry after simulated chunk failure. Gates: `yarn test`, `yarn typecheck`. Test updates for async history are TODO_34.

## Files (expected)

- `src/dashboard/HistorySheetErrorBoundary.tsx` (or equivalent).
- `src/dashboard/Dashboard.tsx` (lazy import, hasOpenedHistory, Suspense, error boundary, prefetch, map to TraceHistoryItem).

## Notes / Non-goals

- Test updates for tests that assert on "Trace history" or the list are in TODO_34.
