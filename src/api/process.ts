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
    { id: "refund-policy.md:0",      rawText: "Retrieved passage on refund policy.",                  rerankedText: "The refund policy allows customers to request a full refund within 30 days of purchase for unused products. For digital goods, refunds are handled on a case-by-case basis.",  score: 0.94, status: "kept" },
    { id: "shipping-faq.md:0",       rawText: "Retrieved passage on shipping times.",                 rerankedText: "Shipping times vary by region. Standard delivery is 5–7 business days; express options are available at checkout.",                                                          score: 0.88, status: "kept" },
    { id: "returns-guide.md:1",      rawText: "Retrieved passage on initiating a return.",            rerankedText: "To initiate a return, log into your account and open the order history. Select the item and click Request Return.",                                                          score: 0.85, status: "kept" },
    { id: "warranty-terms.md:0",     rawText: "Retrieved passage on warranty coverage.",              rerankedText: "Warranty coverage includes manufacturing defects but excludes normal wear and tear or misuse.",                                                                               score: 0.82, status: "kept" },
    { id: "support-hours.md:0",      rawText: "Retrieved passage on customer support availability.",  rerankedText: "Customer support is available Monday–Friday 9am–6pm EST. Live chat and email are offered 24/7.",                                                                             score: 0.79, status: "kept" },
    { id: "loyalty-program.md:2",    rawText: "Retrieved passage on loyalty points.",                 rerankedText: "Loyalty points are earned on every purchase and can be redeemed for discounts on future orders.",                                                                             score: 0.76, status: "kept" },
    { id: "subscriptions.md:0",      rawText: "Retrieved passage on subscription cancellation.",      rerankedText: "Subscription plans can be cancelled at any time from the account settings page. No cancellation fee applies.",                                                               score: 0.73, status: "kept" },
    { id: "payments.md:1",           rawText: "Retrieved passage on accepted payment methods.",       rerankedText: "Payment methods accepted include major credit cards, PayPal, and select buy-now-pay-later options.",                                                                          score: 0.71, status: "kept" },
    { id: "product-specs.md:3",      rawText: "Retrieved passage on product specifications.",         rerankedText: "Product specifications and dimensions are listed on each product page.",                                                                                                     score: 0.68, status: "pruned" },
    { id: "about-us.md:0",           rawText: "Retrieved passage on company history.",                rerankedText: "The company was founded in 2010 and has since expanded to over 50 countries worldwide.",                                                                                     score: 0.62, status: "pruned" },
    { id: "about-us.md:1",           rawText: "Retrieved passage on company mission.",                rerankedText: "Our mission is to deliver quality products with a focus on sustainability and customer satisfaction.",                                                                        score: 0.58, status: "pruned" },
    { id: "press-releases.md:0",     rawText: "Retrieved passage on investor relations.",             rerankedText: "Press releases and investor relations information can be found in the corporate section of the website.",                                                                     score: 0.54, status: "pruned" },
    { id: "promotions.md:2",         rawText: "Retrieved passage on seasonal promotions.",            rerankedText: "Seasonal promotions run during major holidays. Sign up for the newsletter to receive early access.",                                                                          score: 0.49, status: "pruned" },
    { id: "privacy-policy.md:1",     rawText: "Retrieved passage on cookie usage.",                   rerankedText: "The site uses cookies to improve experience and analyze traffic. See the privacy policy for details.",                                                                        score: 0.44, status: "pruned" },
    { id: "developer-docs.md:0",     rawText: "Retrieved passage on API integration.",                rerankedText: "Technical documentation for API integration is available in the developer portal. Authentication uses OAuth 2.0.",                                                           score: 0.39, status: "pruned" },
    { id: "care-instructions.md:0",  rawText: "Retrieved passage on product care.",                   rerankedText: "Care instructions for each material type are provided on the product label and in the product description.",                                                                  score: 0.35, status: "pruned" },
    { id: "inventory.md:1",          rawText: "Retrieved passage on stock availability.",             rerankedText: "Inventory levels are updated in real time. Out-of-stock items can be added to a waitlist.",                                                                                  score: 0.28, status: "pruned" },
    { id: "marketplace-terms.md:0",  rawText: "Retrieved passage on third-party seller compliance.",  rerankedText: "Third-party sellers must comply with marketplace guidelines. Verified seller badges indicate compliance.",                                                                    score: 0.24, status: "pruned" },
    { id: "legal-terms.md:2",        rawText: "Retrieved passage on terms of use.",                   rerankedText: "Legal terms and conditions govern use of the platform. By placing an order you accept these terms.",                                                                          score: 0.19, status: "pruned" },
    { id: "site-footer.md:0",        rawText: "Retrieved passage on footer links.",                   rerankedText: "Footer links include accessibility, sitemap, and contact. Social media icons link to official channels.",                                                                     score: 0.12, status: "pruned" },
  ];
}

/** Simulated nodes for the Response step — only the kept nodes are sent to the LLM. */
function makeMockResponseNodes(): ProcessTraceNode[] {
  return makeMockNodes().filter((n) => n.status === "kept");
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
