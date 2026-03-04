import { lazy, Suspense, useState } from "react";
import { History, LeafyGreen } from "lucide-react";
import { submitFeedback, type FeedbackVote } from "@/api/feedback";
import { getCorrection, submitCorrection } from "@/api/correction";
import { processQuery, type ProcessTrace } from "@/api/process";
import { ThemeToggle } from "@/components/theme-toggle";
import { TraceView } from "@/components/trace-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TraceHistoryItem } from "@/dashboard/types";
import { HistorySheetErrorBoundary } from "@/dashboard/HistorySheetErrorBoundary";

const LazyHistorySheet = lazy(() =>
  import("./HistorySheet").then((m) => ({ default: m.HistorySheet }))
);

function prefetchHistorySheet() {
  void import("./HistorySheet");
}

export function Dashboard() {
  const [queryInput, setQueryInput] = useState("");
  const [traces, setTraces] = useState<ProcessTrace[]>([]);
  const [selectedTraceId, setSelectedTraceId] = useState<string | null>(null);
  const [processLoading, setProcessLoading] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);
  const [feedbackVotes, setFeedbackVotes] = useState<
    Record<string, FeedbackVote>
  >({});
  const [historySheetOpen, setHistorySheetOpen] = useState(false);
  const [hasOpenedHistory, setHasOpenedHistory] = useState(false);
  const [historyEmbedded, setHistoryEmbedded] = useState(false);
  const [historySheetRetryKey, setHistorySheetRetryKey] = useState(0);

  const traceHistoryItems: TraceHistoryItem[] = traces.map((t) => ({
    trace_id: t.trace_id,
    query: t.query,
    model: t.model,
    provider: t.provider,
  }));

  const selectedTrace = selectedTraceId
    ? traces.find((t) => t.trace_id === selectedTraceId) ?? null
    : null;

  async function handleRun() {
    const query = queryInput.trim();
    if (!query) return;
    setProcessError(null);
    setProcessLoading(true);
    try {
      const trace = await processQuery(query);
      setTraces((prev) => [...prev, trace]);
      setSelectedTraceId(trace.trace_id);
      setQueryInput("");
    } catch (e) {
      setProcessError(
        e instanceof Error ? e.message : "Failed to process query"
      );
    } finally {
      setProcessLoading(false);
    }
  }

  const showHistoryUI = hasOpenedHistory || historyEmbedded;

  return (
    <main className="flex min-h-screen bg-bg-primary text-text-primary">
      {showHistoryUI && (
        <HistorySheetErrorBoundary
          onRetry={() => setHistorySheetRetryKey((k) => k + 1)}
        >
          <Suspense fallback={null}>
            {historyEmbedded ? (
              <div className="flex h-screen w-72 shrink-0 flex-col border-r border-border">
                <LazyHistorySheet
                  key={historySheetRetryKey}
                  traces={traceHistoryItems}
                  selectedTraceId={selectedTraceId}
                  variant="embedded"
                  open={false}
                  onOpenChange={() => {}}
                  onSelectTrace={(traceId) => setSelectedTraceId(traceId)}
                  onEmbedToggle={() => setHistoryEmbedded(false)}
                  onCloseEmbedded={() => setHistoryEmbedded(false)}
                />
              </div>
            ) : (
              <LazyHistorySheet
                key={historySheetRetryKey}
                traces={traceHistoryItems}
                selectedTraceId={selectedTraceId}
                variant="sheet"
                open={historySheetOpen}
                onOpenChange={(open) => {
                  setHistorySheetOpen(open);
                  if (open) setHasOpenedHistory(true);
                }}
                onSelectTrace={(traceId) => {
                  setSelectedTraceId(traceId);
                  setHistorySheetOpen(false);
                }}
                onEmbedToggle={() => {
                  setHistoryEmbedded(true);
                  setHistorySheetOpen(false);
                }}
              />
            )}
          </Suspense>
        </HistorySheetErrorBoundary>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-17 w-full items-center px-4 justify-between border-b border-border bg-bg-surface">
          <h1 className="flex items-center gap-2 text-xl font-semibold">
            <LeafyGreen
              className="size-6 shrink-0 text-amber-400"
              aria-hidden
            />
            Context Hero
          </h1>
          <ThemeToggle />
        </header>
        <section className="mx-auto flex min-w-0 max-w-(--breakpoint-5xl) flex-1 flex-col gap-8 p-8">
          <div className="p-8 flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-semibold">Run a new query</h2>
              <p className="text-sm text-text-muted">
                Enter a query to run the pipeline and inspect retrieval,
                reranking, and response.
              </p>
            </div>
            <label htmlFor="dashboard-query-input" className="sr-only">
              Query input
            </label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
              <Input
                id="dashboard-query-input"
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRun()}
                placeholder="Enter a query..."
                className="min-w-0 max-w-md flex-1"
                aria-label="Query input"
              />
              <Button
                type="button"
                onClick={handleRun}
                disabled={processLoading || !queryInput.trim()}
                variant="outline"
                className="sm:shrink-0"
              >
                {processLoading ? "…" : "Run"}
              </Button>
              {traces.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setHasOpenedHistory(true);
                    setHistorySheetOpen(true);
                  }}
                  onMouseEnter={prefetchHistorySheet}
                  onFocus={prefetchHistorySheet}
                  aria-label="Show trace history"
                  className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md bg-bg-muted p-2 text-text-primary transition-colors hover:opacity-80"
                >
                  <History className="size-5" aria-hidden />
                </button>
              )}
            </div>
            <hr />
            {processError && (
              <p role="alert" className="text-sm text-danger">
                {processError}
              </p>
            )}
            {selectedTrace && (
              <TraceView
                trace={{
                  traceId: selectedTrace.traceId,
                  steps: selectedTrace.steps,
                  retrievalNodes: selectedTrace.retrievalNodes,
                  nodes: selectedTrace.nodes,
                  responseNodes: selectedTrace.responseNodes,
                  response: selectedTrace.response,
                  tokensSaved: selectedTrace.tokensSaved,
                  tokensSent: selectedTrace.tokensSent,
                  provider: selectedTrace.provider,
                  inputTokens: selectedTrace.inputTokens,
                  outputTokens: selectedTrace.outputTokens,
                  cost: selectedTrace.cost,
                  naiveRagInputTokens: selectedTrace.naiveRagInputTokens,
                  model: selectedTrace.model,
                  routingClass: selectedTrace.routingClass,
                  routingConfidence: selectedTrace.routingConfidence,
                  routingReason: selectedTrace.routingReason,
                }}
                loading={processLoading && traces.length === 0}
                error={processError}
                traceId={selectedTrace.trace_id}
                currentVote={feedbackVotes[selectedTrace.trace_id] ?? null}
                onFeedbackUp={async () => {
                  await submitFeedback(selectedTrace.trace_id, "up");
                  setFeedbackVotes((prev) => ({
                    ...prev,
                    [selectedTrace.trace_id]: "up",
                  }));
                }}
                onFeedbackDown={async () => {
                  await submitFeedback(selectedTrace.trace_id, "down");
                  setFeedbackVotes((prev) => ({
                    ...prev,
                    [selectedTrace.trace_id]: "down",
                  }));
                }}
                tracesForExport={traces}
                initialCorrectionResponse={
                  getCorrection(selectedTrace.trace_id)?.corrected_text ??
                  selectedTrace.response
                }
                onSubmitCorrection={async (traceId, correctedText) => {
                  await submitCorrection(traceId, correctedText);
                }}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
