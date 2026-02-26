/**
 * Mock process API: submit a query and get back a trace (TraceView-shaped).
 * No real DCO engine or LLM — in-memory store with deterministic mock data.
 * For dashboard playability without backend.
 */

import type { ProviderId } from "@/dashboard/cost/types";

export interface ProcessTraceNode {
  id: string;
  rawText: string;
  rerankedText: string;
  score?: number;
  status?: "kept" | "pruned";
}

export interface ProcessTraceStep {
  id: string;
  label: string;
  status?: "pending" | "active" | "done";
}

/** Trace returned by processQuery; compatible with TraceView and TraceForExport. */
export interface ProcessTrace {
  trace_id: string;
  query: string;
  response: string;
  traceId: string;
  steps: ProcessTraceStep[];
  nodes?: ProcessTraceNode[];
  /** Simulated nodes shown when the Response step is selected in the timeline. */
  responseNodes?: ProcessTraceNode[];
  /** Tokens saved vs previous run (for token metrics cards). */
  tokensSaved?: number;
  /** Total tokens in prompt / sent (for token metrics cards). */
  tokensSent?: number;
  /** Provider used for this trace (for cost display). */
  provider?: ProviderId;
  /** Input token count (for cost display). */
  inputTokens?: number;
  /** Output token count (for cost display). */
  outputTokens?: number;
  /** Cost in USD when precomputed (optional). */
  cost?: number;
  /** Naive RAG input token count (for TokensSaved comparison: saved = naiveRagInputTokens - dcoInputTokens). */
  naiveRagInputTokens?: number;
}

const DEFAULT_STEPS: ProcessTraceStep[] = [
  { id: "retrieval", label: "Retrieval", status: "done" },
  { id: "rerank", label: "Rerank", status: "done" },
  { id: "response", label: "Response", status: "done" },
];

function makeMockNodes(): ProcessTraceNode[] {
  return [
    {
      id: "node-1",
      rawText: "Retrieved passage from the index.",
      rerankedText:
        "The refund policy allows customers to request a full refund within 30 days of purchase for unused products. For digital goods, refunds are handled on a case-by-case basis. Please contact support for assistance.",
      score: 0.92,
      status: "kept",
    },
    {
      id: "node-2",
      rawText: "Low-scoring chunk.",
      rerankedText: "Low-scoring chunk.",
      score: 0.25,
      status: "pruned",
    },
  ];
}

/** Simulated nodes for the Response step so the NodeInspector shows content when Response is selected. */
function makeMockResponseNodes(): ProcessTraceNode[] {
  return [
    {
      id: "resp-1",
      rawText: "Context chunk used for final answer generation.",
      rerankedText: "Included in prompt to LLM.",
      score: 0.88,
      status: "kept",
    },
    {
      id: "resp-2",
      rawText: "Supporting passage for the response.",
      rerankedText: "Supporting passage for the response.",
      score: 0.75,
      status: "kept",
    },
  ];
}

function generateTraceId(): string {
  return `trace-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const store = new Map<string, ProcessTrace>();

export function processQuery(query: string): Promise<ProcessTrace> {
  const trace_id = generateTraceId();
  const nodes = makeMockNodes();
  const responseNodes = makeMockResponseNodes();
  const trace: ProcessTrace = {
    trace_id,
    query,
    response: `Mock response for: "${query}"`,
    traceId: trace_id,
    steps: [...DEFAULT_STEPS],
    nodes,
    responseNodes,
    tokensSaved: 145,
    tokensSent: 320,
    provider: "groq",
    inputTokens: 320,
    outputTokens: 150,
    naiveRagInputTokens: 800,
  };
  store.set(trace_id, trace);

  // TODO remove after phase 1,2,3 are implemented: Phase 3 + LLM: prompt = query + optimized context pack (kept chunks after rerank)
  const optimizedContextPack = responseNodes.map((n) => n.rerankedText);
  console.log("[Phase 3 + LLM] Prompt = query + Optimized Context Pack", {
    query,
    optimizedContextPack,
  });

  return Promise.resolve(trace);
}

export function getTrace(trace_id: string): ProcessTrace | null {
  return store.get(trace_id) ?? null;
}

export function listTraces(): ProcessTrace[] {
  return Array.from(store.values());
}

/** Reset the mock store (for tests). */
export function clearProcessStore(): void {
  store.clear();
}
