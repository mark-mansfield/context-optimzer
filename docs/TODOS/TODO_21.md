# TODO_21: Node Inspector layout aligned to UI reference (W4.4)

Status: TODO

## Context

- Links: [PHASE_4.md](../PHASE_4.md) (W4.4), [UI reference](../assets/ui-reference.png)
- W4.4 specifies a single **Node Inspector** section with three sub-panels: (1) Sample chunk (chunk text + thumbs up/down + "Export to Gold-Set"), (2) Score (relevance value, "Relevance Score" label, horizontal progress bar), (3) Edit correction (textarea "Provide a corrected response or note...", "Save Correction" button). Existing components—**NodeInspector**, **FeedbackButtons**, **EditCorrection**, **ExportGoldSet**—must be **updated** and composed into this layout.

## Description

Update the **Node Inspector** area to match the [UI reference](assets/ui-reference.png): (1) **Single section** titled "Node Inspector" (or equivalent) containing three sub-panels. (2) **Sample chunk** — display chunk text (from selected node or first node); include **thumbs up/down** and **"Export to Gold-Set"** button in this panel. (3) **Score** — show relevance value (e.g. 0.92), label "Relevance Score", and a **horizontal blue progress bar** representing the score. (4) **Edit correction** — textarea with placeholder "Provide a corrected response or note..." and **"Save Correction"** button. Reuse existing NodeInspector, FeedbackButtons, EditCorrection, and ExportGoldSet; **rearrange** their layout and labels to match the reference. Update TraceView (and optionally App) so the trace detail view presents this combined layout instead of separate blocks.

## Expected Inputs

- Existing NodeInspector (nodes, raw/reranked text, score, status), FeedbackButtons, EditCorrection, ExportGoldSet.
- TraceView and App trace-detail structure.

## Expected Outputs

- One "Node Inspector" section with three clearly separated sub-panels: Sample chunk (with feedback + export), Score (value + progress bar), Edit correction (textarea + Save Correction).
- Copy and placeholders match UI reference ("Provide a corrected response or note...", "Save Correction", "Relevance Score").
- All existing behavior (vote, correct, export) preserved; only layout and presentation change.
- `yarn test`, `yarn typecheck` pass.

## Acceptance Criteria

- [ ] Node Inspector presents as one section with three sub-panels.
- [ ] Sample chunk sub-panel shows chunk text, thumbs up/down, and Export to Gold-Set button.
- [ ] Score sub-panel shows numeric score, "Relevance Score" label, and horizontal progress bar.
- [ ] Edit correction sub-panel shows textarea with specified placeholder and "Save Correction" button.
- [ ] Feedback, correction, and export remain wired and functional; existing tests pass.

## Test Plan

- Update NodeInspector and TraceView tests for new structure; ensure FeedbackButtons, EditCorrection, ExportGoldSet still behave correctly in integration.
- Gates: `yarn test`, `yarn typecheck`.

## Files (expected)

- `src/dashboard/components/NodeInspector.tsx` (layout and sub-panels).
- `src/dashboard/components/TraceView.tsx` (compose Node Inspector with feedback, export, edit in one section; possibly move FeedbackButtons/ExportGoldSet/EditCorrection into or next to Node Inspector).
- `src/dashboard/App.tsx` if trace detail layout is adjusted (e.g. single Node Inspector block instead of separate rows).
- EditCorrection.tsx for placeholder and button label if needed.

## Notes / Non-goals

- Data model for "sample chunk" can be current node or first inspector node; no new APIs required.
- Progress bar can be a simple div or theme-based component; score 0–1 maps to width.
