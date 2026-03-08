# Architecture Constraints, Technical Debt & Cloud Deployment

**Status:** Reference  
**Applies to:** Phase 1 (Hybrid Retrieval) and overall DCO architecture (single process, build-time index, single-tenant by `user_id`).

This document captures when the current architecture will create technical debt, and how it fits (and does not fit) cloud deployment.

---

## 1. How This Fits in the Cloud

The DCO design is **single process, build-time index, single-tenant by `user_id`**. That design **is usable in the cloud** as long as you run **one instance** and accept the constraints below.

### 1.1 Deploying to the cloud

- **One process:** Run the Node/Bun app on a single cloud VM, container, or always-on instance (e.g. EC2, GCE, ECS, App Service, Cloud Run with min instances = 1).
- **Build-time index:** Build the app and the vector/lexical index in CI; bake the index into the image or deploy artifact (e.g. `dist/data/` or `public/data/`). The cloud instance runs the app and reads the index from local disk. No separate vector-DB service is required.
- **Single-tenant by `user_id`:** You can still have many users. One index holds all chunks with `user_id` metadata; every request is scoped by the requesting user’s id. “Single-tenant” here means one logical index filtered by user, not “only one customer.” Multi-user SaaS is supported.

**Summary:** The architecture is **usable in the cloud** — one deployment, one process, one on-disk index, all users filtered by `user_id`.

### 1.2 Constraints to keep it that way

| Aspect | Constraint |
|--------|------------|
| **Instances** | Run **one** app instance. Multiple instances cannot share the embedded index; scaling out would require a shared vector store and a different architecture. |
| **Persistence** | The instance needs **local disk** (or an attached volume) that survives restarts so the index does not need to be rebuilt on every deploy. Bake the index into the image or mount a volume. |
| **Serverless** | The design can be made to work (e.g. load index from object storage into Lambda `/tmp` on cold start), but cold starts and size limits make it awkward. This design fits **VM/container** deployment better than many small serverless invocations. |
| **Scaling** | Scale **vertically** (larger instance) if you need more throughput or a larger index. Horizontal scaling (more instances) is where the architecture creates technical debt (see §2). |

---

## 2. When This Architecture Creates Technical Debt

The following triggers indicate when the current design will start to create **noticeable technical debt** and likely require re-architecture or significant rework.

### 2.1 Horizontal scaling (multiple instances)

- **Current:** LanceDB and BM25 are **embedded**; one store per process, local disk.
- **Debt trigger:** You need **horizontal scaling** — multiple app instances, serverless replicas, or high concurrency across machines.
- **Why:** Embedded DB is not shared across processes. You get duplication, split brain, or “which instance has the index?” You will need a **shared vector store** (LanceDB Cloud, pgvector, Pinecone, etc.) and possibly a shared BM25/search service.
- **Rough threshold:** More than one app instance serving retrieval, or serverless with cold starts and a large index.

### 2.2 Runtime or per-tenant ingestion

- **Current:** **Build-time only** ingestion; single index per build; no runtime upload (per PRD).
- **Debt trigger:** You need **runtime ingestion** (new documents without redeploy), **per-tenant corpora**, or user-uploaded content.
- **Why:** There is no API or pipeline for “add document and update index”; no notion of multiple indexes or tenant-specific stores. You will bolt on ingestion APIs, index versioning, and possibly a separate ingestion worker — and the “single index at build” assumption becomes wrong.
- **Rough threshold:** First requirement for “ingest without rebuild” or “different content per tenant.”

### 2.3 Retrieval SLA becomes unsustainable

- **Current:** Phase 1 target **&lt;400 ms** combined retrieval; PRD “under 1.5 s” end-to-end.
- **Debt trigger:** Corpus or traffic grows so that you **routinely miss** that target without hacks (e.g. shrinking top-k, aggressive approximation).
- **Why:** The number is a hard promise. You will add caches, precomputation, or a different retrieval architecture instead of “run the same pipeline bigger.”
- **Rough threshold:** You cannot meet 400 ms / 1.5 s at p95 with the current design, or you must degrade quality (e.g. smaller k) to meet it.

### 2.4 Richer access control

- **Current:** **user_id** filter at DB level; tenant isolation.
- **Debt trigger:** You need **org/team/role-based access**, shared workspaces, or “same document, different visibility by role.”
- **Why:** Everything is keyed by `user_id`. You will need a richer metadata/ACL layer (possibly at the application layer) and possibly different indexing (e.g. by org + role) — so the simple “filter by user_id” contract becomes technical debt.
- **Rough threshold:** First requirement that cannot be expressed as “one user_id per query.”

### 2.5 More retrieval sources or split services

- **Current:** Two streams (LanceDB + BM25), one process, one ingestion pipeline that feeds both.
- **Debt trigger:** You add a **third stream** (e.g. graph, external API) or move vector or BM25 to **separate services**.
- **Why:** Sync and consistency (“same chunks in both indexes”) are implicit today. More sources or services mean explicit contracts, versioning, and idempotent ingestion — the “dual-stream + single pipeline” design becomes a special case you work around.
- **Rough threshold:** Third retrieval backend, or “vector DB as a service, BM25 elsewhere.”

### 2.6 Different deployment model (serverless, edge, client)

- **Current:** **Local-first**, in-process, Node/Bun, index on disk.
- **Debt trigger:** You move to **serverless** (cold start + large index), **edge** (no persistent disk), or **“run in browser / on device.”**
- **Why:** Embedded LanceDB and on-disk index do not fit those environments. You will need a remote vector store, a different runtime, or a different product shape — the “embedded, one process” assumption becomes debt.
- **Rough threshold:** Decision to run retrieval in Lambda, on the edge, or client-side.

### 2.7 Backend / API shape diverges from “GraphQL-ready” design

- **Current:** Trace list data is supplied by the dashboard shell and **designed to be GraphQL-driven** later (Phase 4).
- **Debt trigger:** You add a **real API backend** with a different shape (REST, different schema), or you never introduce GraphQL.
- **Why:** The UI and state are structured for a future GraphQL contract. If the real backend does not match, you refactor the shell/history layer; if GraphQL never arrives, you carry unused abstraction. Both are debt.
- **Rough threshold:** Backend API is implemented and does not match the assumed data shape, or a long period passes with no GraphQL.

---

## 3. Summary Table

| Trigger | Kind of debt |
|--------|----------------|
| Multiple instances / horizontal scale | Move to shared vector (and possibly search) service |
| Runtime or per-tenant ingestion | Add ingestion API, index lifecycle, possibly separate ingestion service |
| Cannot meet 400 ms / 1.5 s | Caching, re-architecting retrieval, or relaxing the SLA |
| More than user_id (org/role/shared) | Richer ACLs and indexing model |
| Third retrieval source or split services | Explicit contracts and sync story |
| Serverless / edge / client | Replace embedded DB with remote store or different runtime |
| Backend/API does not match “GraphQL-ready” | Refactor shell and trace list data flow |

The architecture remains manageable **until** one of these triggers occurs (scale, dynamic ingestion, stricter or broader access, or a different deployment model).

---

## 4. Related docs

- [PRD.md](PRD.md) — Product requirements; build-time ingestion, Phase 1 scope.
- [PHASE_1.md](PHASE_1.md) — Hybrid retrieval DoD and work items.
- [SECURITY.md](SECURITY.md) — Tenant isolation, metadata anchoring.
- [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md) — Pipeline overview.
