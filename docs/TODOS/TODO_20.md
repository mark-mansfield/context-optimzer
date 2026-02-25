# TODO_20: Token metrics cards aligned to UI reference (W4.4)

Status: TODO

## Context

- Links: [PHASE_4.md](../PHASE_4.md) (W4.4), [UI reference](../assets/ui-reference.png)
- W4.4 specifies two **side-by-side cards**: (1) **Tokens Saved** — icon, large number, subtext "vs. previous run"; (2) **Tokens Sent** — icon, large number, subtext "Total tokens in prompt". Existing components (e.g. `TokensSaved`, `CostDisplay`) need to be **updated** or composed to match this card layout and copy.

## Description

Update token/cost display to match the [UI reference](assets/ui-reference.png): (1) **Two cards** laid out side-by-side. (2) **Tokens Saved card**: icon (e.g. stacked disks/pages), prominent large number (e.g. 145), subtext "vs. previous run". (3) **Tokens Sent card**: icon (e.g. opposing arrows), prominent large number (e.g. 320), subtext "Total tokens in prompt". Reuse existing logic (e.g. from `TokensSaved`, `computeCost`, token counts from trace) where applicable; change **presentation** to card style with icons and subtext. If trace data does not yet include "tokens sent", use a placeholder or derived value until backend provides it.

## Expected Inputs

- Existing TokensSaved component and/or CostDisplay; cost/token types and compute logic.
- Trace or process result that may include token counts (DCO input, naive RAG input, etc.).

## Expected Outputs

- Two cards displayed side-by-side: Tokens Saved and Tokens Sent, each with icon, large number, and specified subtext.
- Values sourced from existing token/cost logic or stubbed for mock data.
- `yarn test`, `yarn typecheck` pass; TraceView or App integrates the cards as in the reference.

## Acceptance Criteria

- [ ] Tokens Saved card shows icon, large number, and "vs. previous run".
- [ ] Tokens Sent card shows icon, large number, and "Total tokens in prompt".
- [ ] Cards are side-by-side and visually consistent with UI reference.
- [ ] Existing tests and typecheck pass.

## Test Plan

- Update or add tests for the token cards (structure, labels, optional value assertions).
- Gates: `yarn test`, `yarn typecheck`.

## Files (expected)

- `src/dashboard/components/TokensSaved.tsx` and/or new or updated card components (e.g. `TokenMetricsCards.tsx` or integration in TraceView).
- Possibly `src/dashboard/components/TraceView.tsx` to place cards in layout.
- Cost/format utilities as needed.

## Notes / Non-goals

- Icons can be from Lucide or existing icon set; exact icon choice to match reference as closely as reasonable.
- "Tokens Sent" may be mapped from existing "DCO input tokens" or similar until a dedicated field exists.
