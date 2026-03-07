# Dashboard User Stories

User stories for the Phase 4 Observability Dashboard. They describe how a developer or operator uses the UI to run queries, inspect traces, give feedback, and build evaluation datasets. The current implementation supports these flows via a **mock API** (no LLM/backend); the same stories apply when connected to a real DCO engine.

---

## Example queries

Use these in the dashboard query input to exercise retrieval → rerank → response and inspect traces:

- **Refund / support:** *What is the refund policy for orders over $100?*
- **Account / auth:** *How do I reset my password?*
- **Documentation:** *Which API endpoints require authentication?*
- **Summarization:** *Summarize the key safety precautions in the user manual.*
- **Product / eligibility:** *What are the eligibility criteria for the premium tier?*
- **Technical:** *How do I configure rate limiting for the search API?*

---

## US_D1: Run a query and see a trace

**Persona:** Developer / Operator  
**Focus:** Query submission and trace visibility

- **As a** developer,
- **I want to** enter a query and run it from the dashboard,
- **So that** I can see how the system would process that query and inspect the resulting trace (retrieval → rerank → response).

- **Success Criteria:**
  - [ ] A query input and "Run" (or "Process") button are visible on the dashboard.
  - [ ] Submitting a query creates a new trace and it appears in the trace history.
  - [ ] The new trace is selected by default so I see the trace detail view immediately.
  - [ ] I can submit multiple queries and each produces a distinct trace with a unique trace_id.

---

## US_D2: Browse trace history and open a trace

**Persona:** Developer / Operator  
**Focus:** Trace list and selection

- **As a** developer,
- **I want to** see a list of past traces (e.g. trace_id and query summary) and click one to open it,
- **So that** I can revisit any previous run and compare behavior across queries.

- **Success Criteria:**
  - [ ] Trace history shows each trace with at least trace_id and the query text (or a short summary).
  - [ ] Clicking a trace in the list loads that trace in the detail view (Timeline, Node Inspector, response).
  - [ ] The selected trace is clearly indicated in the list (e.g. highlight or active state).
  - [ ] An empty state is shown when there are no traces (e.g. "No traces yet. Run a query above.").

---

## US_D3: Inspect trace steps and context (Timeline + Node Inspector)

**Persona:** Developer / Operator  
**Focus:** Trace visualization and context pruning

- **As a** developer,
- **I want to** see the trace as a timeline (Retrieval → Rerank → Response) and inspect raw vs. reranked context for each step,
- **So that** I can debug retrieval/reranking and understand what context was kept or pruned.

- **Success Criteria:**
  - [ ] The trace detail view shows a Timeline with steps (e.g. Retrieval, Rerank, Response).
  - [ ] I can select a step and see the Node Inspector for that step (where applicable).
  - [ ] For each node I can see raw text, reranked text, score, and status (kept/pruned).
  - [ ] Loading and error states are shown when a trace is being loaded or has failed.

---

## US_D4: Give feedback (thumbs up / thumbs down)

**Persona:** Developer / Operator  
**Focus:** Quality signal for traces

- **As a** developer,
- **I want to** vote thumbs up or thumbs down on a trace,
- **So that** I can mark which responses are high quality and use that signal later (e.g. for gold-set export or analytics).

- **Success Criteria:**
  - [ ] Thumbs up and thumbs down controls are visible on the trace detail view.
  - [ ] My vote is persisted (e.g. via mock or real feedback API) and linked to the trace_id.
  - [ ] The current vote is reflected in the UI (e.g. selected state); changing my vote updates the stored value.
  - [ ] I can vote on any trace I have open without leaving the view.

---

## US_D5: Submit a corrected response (Edit Correction)

**Persona:** Developer / Operator  
**Focus:** Correction for evaluation and gold-set

- **As a** developer,
- **I want to** edit and submit a "corrected" version of the model response for a trace,
- **So that** I can build gold-set data with ideal answers for evaluation and fine-tuning.

- **Success Criteria:**
  - [ ] An "Edit correction" (or similar) control is available on the trace detail view, with a text area pre-filled with the current response (or existing correction).
  - [ ] Submitting the form persists the corrected text for that trace_id (e.g. via mock or real correction API).
  - [ ] When I export to gold-set, the corrected response is used for that trace when a correction exists.
  - [ ] Switching to another trace shows that trace’s response/correction in the form (or a fresh form for the new trace).

---

## US_D6: Export traces to gold-set (JSONL)

**Persona:** Developer / Operator  
**Focus:** Evaluation dataset creation

- **As a** developer,
- **I want to** export one or more traces to a gold-set file (e.g. JSONL with trace_id, query, response),
- **So that** I can use them as evaluation benchmarks or for offline analysis.

- **Success Criteria:**
  - [ ] An "Export to Gold-Set" (or similar) button is available (e.g. on the trace detail view or from the trace list).
  - [ ] Export produces a file (or string) with at least trace_id, query, and response (or corrected response when available).
  - [ ] When a trace has a correction, the exported record uses the corrected text as the response.
  - [ ] Optionally, I can export only traces I marked thumbs up (or all traces). The export format is documented and machine-readable (e.g. JSONL).

---

## US_D7: Toggle theme (light / dark)

**Persona:** Developer / Operator  
**Focus:** Accessibility and preference

- **As a** developer,
- **I want to** switch the dashboard between light and dark theme,
- **So that** I can reduce eye strain or match my environment.

- **Success Criteria:**
  - [ ] A theme toggle (e.g. sun/moon icon) is visible in the header.
  - [ ] Clicking it switches between light and dark; the preference is persisted (e.g. localStorage) and applied on reload.
  - [ ] All main UI areas (header, trace list, trace detail, feedback, forms) use the selected theme consistently.

---

## Summary

| ID       | Summary                          | Primary flow                    |
|----------|----------------------------------|---------------------------------|
| US_D1    | Run query and see trace          | Query input → Run → trace view |
| US_D2    | Browse history and open trace    | Trace list → select → detail    |
| US_D3    | Inspect steps and context        | Timeline + Node Inspector       |
| US_D4    | Thumbs up/down feedback          | Vote on trace → persisted       |
| US_D5    | Edit correction                  | Correct response → persisted    |
| US_D6    | Export to gold-set               | Export button → JSONL file      |
| US_D7    | Toggle light/dark theme          | Header toggle → preference      |

These stories align with the Phase 4 DoD and the playable dashboard (TODO_15–17). When the dashboard is connected to a real DCO engine and SSE, the same stories apply with live traces and streaming.
