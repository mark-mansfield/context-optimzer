import { useState } from "react";
import { getFeedback, submitFeedback } from "@/api/feedback";
import { getCorrection, submitCorrection } from "@/api/correction";
import { processQuery, type ProcessTrace } from "@/api/process";
import { EditCorrection } from "./components/EditCorrection";
import { ExportGoldSet } from "./components/ExportGoldSet";
import { FeedbackButtons } from "./components/FeedbackButtons";
import { ThemeToggle } from "./components/ThemeToggle";
import { TraceView } from "./components/TraceView";

export function App() {
  const [queryInput, setQueryInput] = useState("");
  const [traces, setTraces] = useState<ProcessTrace[]>([]);
  const [selectedTraceId, setSelectedTraceId] = useState<string | null>(null);
  const [processLoading, setProcessLoading] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);
  const [, setFeedbackVersion] = useState(0);

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
        <section className="flex flex-col gap-2 md:w-80 md:flex-shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRun()}
              placeholder="Enter a query..."
              className="min-w-0 flex-1 rounded-lg border border-border bg-bg-surface px-3 py-2 text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              aria-label="Query input"
            />
            <button
              type="button"
              onClick={handleRun}
              disabled={processLoading || !queryInput.trim()}
              className="rounded-lg bg-accent px-4 py-2 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {processLoading ? "…" : "Run"}
            </button>
          </div>
          {processError && (
            <p role="alert" className="text-sm text-danger">
              {processError}
            </p>
          )}
          <h2 className="text-sm font-medium text-text-secondary">Trace history</h2>
          <ul className="flex flex-col gap-1 overflow-auto rounded-lg border border-border bg-bg-surface p-2">
            {traces.length === 0 && (
              <li className="py-2 text-sm text-text-muted">No traces yet. Run a query above.</li>
            )}
            {traces.map((t) => (
              <li key={t.trace_id}>
                <button
                  type="button"
                  onClick={() => setSelectedTraceId(t.trace_id)}
                  className={`w-full rounded px-2 py-2 text-left text-sm transition-colors hover:bg-bg-muted ${
                    selectedTraceId === t.trace_id ? "bg-bg-muted font-medium" : ""
                  }`}
                >
                  <span className="block truncate font-mono text-text-muted">{t.trace_id}</span>
                  <span className="block truncate text-text-primary">{t.query}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex min-w-0 flex-1 flex-col gap-4">
          {selectedTrace ? (
            <>
              <TraceView
                trace={{
                  traceId: selectedTrace.traceId,
                  steps: selectedTrace.steps,
                  nodes: selectedTrace.nodes,
                  responseNodes: selectedTrace.responseNodes,
                }}
                loading={processLoading && traces.length === 0}
                error={processError}
              />
              <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
                <FeedbackButtons
                  traceId={selectedTrace.trace_id}
                  currentVote={getFeedback(selectedTrace.trace_id)?.vote ?? null}
                  onUp={async () => {
                    await submitFeedback(selectedTrace.trace_id, "up");
                    setFeedbackVersion((v) => v + 1);
                  }}
                  onDown={async () => {
                    await submitFeedback(selectedTrace.trace_id, "down");
                    setFeedbackVersion((v) => v + 1);
                  }}
                />
                <ExportGoldSet traces={traces} />
              </div>
              <EditCorrection
                key={selectedTrace.trace_id}
                traceId={selectedTrace.trace_id}
                initialResponse={
                  getCorrection(selectedTrace.trace_id)?.corrected_text ?? selectedTrace.response
                }
                onSubmit={async (traceId, correctedText) => {
                  await submitCorrection(traceId, correctedText);
                }}
              />
            </>
          ) : (
            <div className="rounded-lg border border-border bg-bg-surface p-6 text-text-muted">
              Select a trace from the list or run a new query to see the trace view.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
