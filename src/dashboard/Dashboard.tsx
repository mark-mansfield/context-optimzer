import { useState } from "react";
import { submitFeedback, type FeedbackVote } from "@/api/feedback";
import { getCorrection, submitCorrection } from "@/api/correction";
import { processQuery, type ProcessTrace } from "@/api/process";
import { ThemeToggle } from "@/components/theme-toggle";
import { TraceView } from "@/components/trace-view";

export function Dashboard() {
  const [queryInput, setQueryInput] = useState("");
  const [traces, setTraces] = useState<ProcessTrace[]>([]);
  const [selectedTraceId, setSelectedTraceId] = useState<string | null>(null);
  const [processLoading, setProcessLoading] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);
  const [feedbackVotes, setFeedbackVotes] = useState<Record<string, FeedbackVote>>({});

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
      setProcessError(e instanceof Error ? e.message : "Failed to process query");
    } finally {
      setProcessLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-bg-primary text-text-primary">
      <header className="flex items-center justify-between border-b border-border bg-bg-surface px-4 py-3">
        <h1 className="text-xl font-semibold">DCO Dashboard</h1>
        <ThemeToggle />
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 md:flex-row">
        <section className="flex flex-col gap-2 md:w-80 md:shrink-0">
          <h2 className="text-sm font-medium text-text-primary">Trace history</h2>
          <ul className="flex flex-col gap-1 overflow-y-auto rounded-md border border-border bg-bg-surface p-2">
            {traces.length === 0 && (
              <li className="py-2 text-sm text-text-muted">No traces yet. Run a query to get started.</li>
            )}
            {traces.map((t) => (
              <li key={t.trace_id}>
                <button
                  type="button"
                  onClick={() => setSelectedTraceId(t.trace_id)}
                  className={`flex w-full items-center gap-2 rounded px-2 py-2 text-left text-sm transition-colors hover:bg-bg-muted ${
                    selectedTraceId === t.trace_id
                      ? "bg-accent/15 font-medium ring-1 ring-inset ring-accent/40"
                      : ""
                  }`}
                >
                  <span className="w-[20%] min-w-0 shrink-0 truncate font-mono text-accent">
                    {t.trace_id.slice(-6)}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-text-primary">{t.query}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold text-text-primary">Run a new trace</h2>
            <p className="text-sm text-text-muted">
              Enter a query to run the pipeline and inspect retrieval, reranking, and response.
            </p>
          </div>
          <label htmlFor="dashboard-query-input" className="sr-only">
            Query input
          </label>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
            <input
              id="dashboard-query-input"
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRun()}
              placeholder="Enter a query..."
              className="min-w-0 flex-1 rounded-md border border-border bg-bg-surface px-3 py-2 text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              aria-label="Query input"
            />
            <button
              type="button"
              onClick={handleRun}
              disabled={processLoading || !queryInput.trim()}
              className="rounded-md border border-border bg-bg-muted px-4 py-2.5 font-medium text-text-primary transition-colors hover:bg-bg-elevated disabled:opacity-50 sm:shrink-0"
            >
              {processLoading ? "…" : "Run"}
            </button>
          </div>
          {processError && (
            <p role="alert" className="text-sm text-danger">
              {processError}
            </p>
          )}
          {selectedTrace ? (
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
              }}
              loading={processLoading && traces.length === 0}
              error={processError}
              traceId={selectedTrace.trace_id}
              currentVote={feedbackVotes[selectedTrace.trace_id] ?? null}
              onFeedbackUp={async () => {
                await submitFeedback(selectedTrace.trace_id, "up");
                setFeedbackVotes((prev) => ({ ...prev, [selectedTrace.trace_id]: "up" }));
              }}
              onFeedbackDown={async () => {
                await submitFeedback(selectedTrace.trace_id, "down");
                setFeedbackVotes((prev) => ({ ...prev, [selectedTrace.trace_id]: "down" }));
              }}
              tracesForExport={traces}
              initialCorrectionResponse={
                getCorrection(selectedTrace.trace_id)?.corrected_text ?? selectedTrace.response
              }
              onSubmitCorrection={async (traceId, correctedText) => {
                await submitCorrection(traceId, correctedText);
              }}
            />
          ) : (
            <div className="rounded-md border border-border bg-bg-surface p-6 text-text-muted">
              Select a trace from the list or run a new query to see the trace view.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
