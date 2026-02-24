# FAQs – Dynamic Context Optimizer (DCO)

## What is DCO?

**Dynamic Context Optimizer (DCO)** is AI middleware that sits between the user and the LLM. It addresses the **"context bloat"** problem: as LLM context windows grow, signal-to-noise drops, leading to higher cost, latency, and hallucinations. DCO uses **Hybrid Search**, **Semantic Reranking**, and **Intelligent Routing** to send only high-signal tokens to the model instead of dumping the whole context.

---

## What problem does it solve?

- **Cost** — Fewer input tokens mean lower inference cost.
- **Latency** — Less context to process means faster responses.
- **Quality** — Less noise improves answers and reduces hallucinations.
- **Observability** — You see exactly what was retrieved, reranked, and sent to the model.

---

## What are the main "phases" or features?

**Data flow**  
Query → **Retrieve** (hybrid search) → **Rerank & prune** (score and drop low-relevance chunks) → **Route** (choose model by complexity) → LLM → Response.

**Features**

- **Hybrid retrieval** — Vector (semantic) + BM25 (keyword) search, merged with RRF; LanceDB for vectors.
- **Semantic reranker & pruner** — Cross-encoder re-scores chunks; context below a threshold (e.g. < 0.7) is pruned before the LLM.
- **Intent router** — Classifies query (e.g. simple vs reasoning-heavy) and routes to the right model (e.g. cheaper vs frontier) for cost and quality.
- **Observability dashboard** — Trace history, timeline (Retrieval → Rerank → Response), Node Inspector (raw vs reranked), feedback (thumbs up/down), corrections, gold-set export, theme toggle.

---

## What is the dashboard and what can I do with it?

The dashboard is the **observability UI** for DCO. You can:

- **Run a query** and see a new trace (query → retrieval → rerank → response).
- **Browse trace history** and open any trace.
- **Inspect the trace:** timeline (Retrieval → Rerank → Response) and **Node Inspector** (raw text, reranked text, scores, kept/pruned).
- **Give feedback:** thumbs up/down per trace (stored and linked to `trace_id`).
- **Edit correction:** submit a "correct" response for a trace; it's used in **Export to Gold-Set**.
- **Export to gold-set:** download JSONL (trace_id, query, response or corrected response) for evals; optional "thumbs up only" filter.
- **Toggle theme:** light/dark; preference is persisted.

You can use it today with a **mock API** (no LLM/backend) to try the flow; the same UI is designed to work with a real DCO engine and SSE later.

---

## What is "Export to Gold-Set"?

**Gold-set export** turns dashboard traces into an **evaluation dataset**. You get a JSONL file with one record per trace: `trace_id`, `query`, and `response`. If you've submitted a **correction** for a trace, that corrected text is used as `response`. You can optionally export only traces you marked **thumbs up**. The format is suitable for benchmarking and offline evaluation.

---

## Is my data sent to an LLM when I use the dashboard?

In the **current playable setup**, the dashboard uses a **mock process API**: no real LLM or external backend is called. Traces, feedback, and corrections are in-memory (or mock stores). When you connect the dashboard to a **real DCO engine**, the engine will call LLMs according to your routing and config; the dashboard only displays traces and lets you give feedback and export.

---

## What about privacy and security?

Per the PRD:

- **Sanitization:** Ingested content is stripped of HTML/script to reduce **indirect prompt injection** risk.
- **PII redaction:** A regex-based scrubber can remove emails/phones from context before it's sent to cloud LLMs.
- **Local-first option:** Reranking (e.g. via Transformers.js) can run **locally** so sensitive data is refined before leaving your environment.
- **Bounded autonomy (MCP):** Read-only by default; **writes** require a manual approval step.

---

## What tech stack does DCO use?

- **Language:** TypeScript (Node.js/Bun).
- **AI / orchestration:** LlamaIndex.TS.
- **Embeddings / local ML:** Transformers.js (local-first).
- **Frontend:** React, Tailwind CSS, Framer Motion.
- **Vector DB:** LanceDB (embedded).
- **Telemetry (target):** OpenTelemetry-style; dashboard can consume SSE from the DCO engine.

---

## What are the success metrics (KPIs)?

- **Cost:** >50% reduction in input tokens vs "naive RAG."
- **Accuracy:** Better "faithfulness" (e.g. LLM-as-judge) vs standard retrieval.
- **Latency:** End-to-end (retrieve + rerank) under **1.5 seconds**.
- **Router:** >92% accuracy on simple vs complex intent; classification adds <100 ms.
- **Dashboard:** Trace metadata rendered within <200 ms of the backend event; cost metrics within ~2% of provider billing.
