import { lazy, Suspense, useState } from "react";
import { LeafyGreen } from "lucide-react";
import { submitFeedback, type FeedbackVote } from "@/api/feedback";
import { getCorrection, submitCorrection } from "@/api/correction";
import { processQuery, type ProcessTrace } from "@/api/process";
import { ThemeToggle } from "@/components/theme-toggle";
import { TraceView } from "@/components/trace-view";
import type { TraceHistoryItem } from "@/dashboard/types";
import { HistorySheetErrorBoundary } from "@/dashboard/HistorySheetErrorBoundary";
import { QueryRunRow } from "@/components/query-run-row";

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
      <div className="flex flex-1 flex-col">
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
        <section className="mx-auto flex w-full flex-1 flex-col gap-8 p-4 sm:p-6 lg:p-8 sm:w-full! md:max-w-3xl">
          <div className="flex flex-col gap-4 p-2 sm:p-4">
            <QueryRunRow
              value={queryInput}
              onValueChange={setQueryInput}
              onRun={handleRun}
              loading={processLoading}
              showHistoryButton={traces.length > 0}
              onOpenHistory={() => {
                setHasOpenedHistory(true);
                setHistorySheetOpen(true);
              }}
              onPrefetchHistory={prefetchHistorySheet}
            />

            {processError && (
              <>
                <hr />
                <p role="alert" className="text-sm text-danger">
                  {processError}
                </p>
              </>
            )}
            {selectedTrace && (
              <>
                <hr />
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
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
