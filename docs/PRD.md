# 📄 PRD: Dynamic Context Optimizer (DCO)

**Project Version:** 1.0.0 (MVP)  
**Status:** In-Development  
**Author:** [Your Name]

---

## 1. Executive Summary

The **Dynamic Context Optimizer (DCO)** is an AI-native middleware system designed to solve the **"Context Bloat"** problem in Agentic Workflows. As LLM context windows expand, the signal-to-noise ratio decreases, leading to higher costs, increased latency, and hallucinations.

DCO sits between the user and the LLM, using **Hybrid Search**, **Semantic Reranking**, and **Intelligent Routing** to deliver the most high-signal tokens for any given query.

---

# 2. 👥 User Stories: Dynamic Context Optimizer (DCO)

## US_02: AI Startup FinOps Optimization

**Persona:** AI Startup Founder / Lead  
**Focus:** Inference Cost Reduction (FinOps)

- **As a** Startup Founder,
- **I want to** implement an Agentic Intent Router,
- **So that** I can automatically direct simple queries to cost-effective models (e.g., Llama 3) and reserve Frontier models for high-complexity reasoning.
- **Success Criteria:**
  - [ ] **Accuracy:** Router differentiates between "Simple" (Informational) and "Complex" (Reasoning) intents with > 92% accuracy.
  - [ ] **Observability:** Real-time "Tokens Saved" and "Cost Avoidance" metrics are calculated and piped to the Dashboard.
  - [ ] **Efficiency:** The classification step must add < 100ms of latency to the total request pipeline.

---

## US_03: Local-First Privacy & Tooling

**Persona:** Local-First Developer  
**Focus:** Privacy & MCP (Model Context Protocol) Integration

- **As a** Local-First Developer,
- **I want to** execute Semantic Reranking and Context Pruning locally,
- **So that** sensitive raw data is refined and sanitized before any information is transmitted to a cloud provider.
- **Success Criteria:**
  - [ ] **Execution:** Phase 2 (Reranking) runs in-process using **Transformers.js** with no external API calls.
  - [ ] **Governance:** The system enforces **Bounded Autonomy**, specifically requiring a manual handshake (Approval Gate) for any `write` operations via MCP.
  - [ ] **Privacy:** PII redaction (regex-based) occurs locally after the reranking phase and before Phase 3 routing.

---

## 3. Core Features (The "Phases")

### ⚪ Phase 0: Knowledge Base Ingestion

- **Objective:** Populate the retrieval indexes (LanceDB + BM25) from a fixed corpus so queries can run against real content. For the demo, ingestion is **build-time only**; no runtime upload or multi-tenant ingestion.
- **Requirements:**
  - **Build-time automation:** An ingestion script runs as part of the build (e.g. `yarn build` or `yarn build:with-kb`). It reads from a configured source path (e.g. `content/` or `docs/knowledge-base/` in the repo).
  - **Formats:** Parse and chunk **Markdown**, **JSON**, and **PDF** with a consistent chunking strategy (e.g. smart splitter that respects code blocks and headers).
  - **Output:** Write embeddings to **LanceDB** and build the **BM25** (lexical) index; write to a fixed output path (e.g. `dist/data/` or `public/data/`) so the built app loads it at runtime.
  - **Sanitization:** Strip HTML/script tags from ingested content (per Security & Governance). No runtime ingestion; single index per build.
  - **IDE / agent access:** The knowledge-base source directory (e.g. `content/` or `docs/knowledge-base/`) **must not be read by the IDE agent**. Add it to `.cursorignore` so agent tools cannot read or index that content.

### 🟢 Phase 1: Hybrid Retrieval Engine

- **Objective:** Combine the precision of keywords with the nuance of embeddings.
- **Requirements:**
  - Support for **Vector Search** (Semantic) and **BM25** (Lexical).
  - Implementation of **Reciprocal Rank Fusion (RRF)** to merge results.
  - Integration with **LanceDB** for local-first, zero-cost storage.

### 🟡 Phase 2: Semantic Reranker & Pruner

- **Objective:** Remove "filler" text that dilutes model attention.
- **Requirements:**
  - Use a **Cross-Encoder model** (via Cohere or local Transformers.js) to re-score the top 20 retrieved chunks.
  - **Context Pruning:** Automatically remove chunks with a relevance score below a defined threshold (e.g., `< 0.7`).

### 🟠 Phase 3: Agentic Intent Router

- **Objective:** Route queries to the most cost-effective model.
- **Requirements:**
  - **Complexity Classifier:** Identify if a query is "Informational" (cheap) or "Reasoning-Heavy" (expensive).
  - **Model Routing:** Send simple queries to **Llama 3 (via Groq)** and complex ones to **Claude 3.5 Sonnet**.

### 🔵 Phase 4: Observability Dashboard (React)

- **Objective:** Make the "invisible" optimization visible to the user.
- **Requirements:**
  - **Token Visualization:** Show "Tokens Saved" vs. "Tokens Sent."
  - **Trace Log:** Show the step-by-step logic (`Retrieval` -> `Rerank` -> `Route`).

---

## 4. Technical Stack

- **Language:** TypeScript (Node.js/Bun)
- **AI Orchestration:** LlamaIndex.TS
- **Embeddings:** Transformers.js (Local-first)
- **Frontend:** React + Tailwind CSS
- **Database:** LanceDB (Embedded Vector Store)

---

## 5. Security & Governance

- **Sanitization:** All ingested data must be stripped of HTML/Script tags to prevent Indirect Prompt Injection.
- **Bounded Autonomy:** The system uses read-only file access via MCP; any write operations require a manual "Approval Gate."
- **PII Redaction:** Implement a basic regex-based scrubber to remove emails/phones from context before sending to cloud LLMs.

---

## 6. Success Metrics (KPIs)

- **Cost Efficiency:** >50% reduction in input tokens compared to "Naive RAG."
- **Accuracy:** Improved "Faithfulness" score (LLM-as-a-judge) vs. standard retrieval.
- **Latency:** End-to-end processing (Retrieve + Rerank) under **1.5 seconds**.
