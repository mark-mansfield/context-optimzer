import { useState } from "react";
import { CircleHelp, X } from "lucide-react";
import type { FeedbackVote } from "@/api/feedback";
import type { ProviderId } from "@/dashboard/cost/types";
import type { TraceForExport } from "@/dashboard/goldSet/types";
import { CostDisplay } from "@/components/cost-display";
import { ModelRoutingCard } from "@/components/model-routing-card";
import { TokensSaved } from "@/components/tokens-saved";
import type { InspectorNode } from "@/components/node-inspector";
import { NodeInspector } from "@/components/node-inspector";
import { TokenMetricsCards } from "@/components/token-metrics-cards";
import { EditCorrection } from "@/components/edit-correction";
import { ExportGoldSet } from "@/components/export-gold-set";
import { FeedbackButtons } from "@/components/feedback-buttons";
import type { TimelineStep, TimelineTrace } from "@/components/timeline";
import { Timeline } from "@/components/timeline";
import { Button } from "@/components/ui/button";
export type TraceViewStepId = "retrieval" | "rerank" | "response";

/** Trace shape for TraceView: steps for Timeline and nodes for Node Inspector. */
export interface TraceViewTrace extends TimelineTrace {
  /** Nodes as returned by retrieval (Phase 1); raw chunks only. */
  retrievalNodes?: InspectorNode[];
  /** Nodes after rerank (Phase 2); score, status, rerankedText. */
  nodes?: InspectorNode[];
  /** Optional nodes to show when the Response step is selected (simulated response context). */
  responseNodes?: InspectorNode[];
  /** The LLM response text shown in the Response step panel. */
  response?: string;
  /** Optional token metrics for TokenMetricsCards. */
  tokensSaved?: number;
  tokensSent?: number;
  /** Optional cost data for CostDisplay. */
  provider?: ProviderId;
  inputTokens?: number;
  outputTokens?: number;
  cost?: number;
  /** Naive RAG input tokens (for TokensSaved comparison). */
  naiveRagInputTokens?: number;
  /** Model display name (Phase 3 routing). */
  model?: string;
  /** Routing class (e.g. informational | reasoning). */
  routingClass?: "informational" | "reasoning";
  /** Classifier confidence for chosen class, 0–1. */
  routingConfidence?: number;
  /** Optional router rationale or feature summary. */
  routingReason?: string;
}

export interface TraceViewProps {
  trace?: TraceViewTrace | null;
  loading?: boolean;
  error?: string | null;
  /** When provided, Node Inspector shows feedback/export/correction (from App). */
  traceId?: string;
  currentVote?: FeedbackVote | null;
  onFeedbackUp?: () => Promise<void>;
  onFeedbackDown?: () => Promise<void>;
  tracesForExport?: TraceForExport[];
  initialCorrectionResponse?: string;
  onSubmitCorrection?: (
    traceId: string,
    correctedText: string
  ) => Promise<void>;
}

const DEFAULT_STEPS: TimelineStep[] = [
  { id: "retrieval", label: "Retrieval" },
  { id: "rerank", label: "Rerank" },
  { id: "response", label: "Response" },
];

/** Derives which nodes to show in Node Inspector for the given step. */
function nodesForStep(
  stepId: TraceViewStepId,
  trace: TraceViewTrace | null | undefined
): InspectorNode[] {
  if (!trace) return [];
  if (stepId === "response") return trace.responseNodes ?? [];
  if (stepId === "retrieval") return trace.retrievalNodes ?? trace.nodes ?? [];
  return trace.nodes ?? [];
}

export function TraceView({
  trace,
  loading = false,
  error = null,
  traceId,
  currentVote = null,
  onFeedbackUp,
  onFeedbackDown,
  tracesForExport,
  initialCorrectionResponse,
  onSubmitCorrection,
}: TraceViewProps) {
  const [selectedStep, setSelectedStep] =
    useState<TraceViewStepId>("retrieval");
  const [correctionOpen, setCorrectionOpen] = useState(false);

  const steps = trace?.steps?.length ? trace.steps : DEFAULT_STEPS;
  const timelineTrace: TimelineTrace | null = trace
    ? { traceId: trace.traceId, steps }
    : null;
  const inspectorNodes = nodesForStep(selectedStep, trace);

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <Timeline
        trace={timelineTrace}
        loading={loading}
        error={error}
        selectedStep={selectedStep}
        onStepSelect={(stepId) => setSelectedStep(stepId as TraceViewStepId)}
      />

      {selectedStep === "response" && trace?.response != null && (
        <section className="flex flex-col gap-3 rounded-md border border-border bg-bg-surface px-5 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-text-primary">
                LLM Response
              </h3>
              {traceId != null &&
                onFeedbackUp != null &&
                onFeedbackDown != null && (
                  <FeedbackButtons
                    traceId={traceId}
                    currentVote={currentVote ?? null}
                    onUp={onFeedbackUp}
                    onDown={onFeedbackDown}
                  />
                )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {tracesForExport != null && tracesForExport.length > 0 && (
                <ExportGoldSet traces={tracesForExport} />
              )}
              {traceId != null &&
                initialCorrectionResponse != null &&
                onSubmitCorrection != null && (
                  <Button
                    onClick={() => setCorrectionOpen(true)}
                    variant={"outline"}
                  >
                    Correct response
                  </Button>
                )}
            </div>
          </div>
          <p className="text-sm text-text-primary whitespace-pre-wrap">
            {trace.response}
          </p>
        </section>
      )}

      <TokenMetricsCards
        tokensSaved={trace?.tokensSaved}
        tokensSent={trace?.tokensSent}
        loading={loading}
        error={error}
      />

      {trace != null &&
        trace.naiveRagInputTokens != null &&
        (trace.inputTokens != null || trace.tokensSent != null) && (
          <TokensSaved
            dcoInputTokens={trace.inputTokens ?? trace.tokensSent ?? 0}
            naiveRagInputTokens={trace.naiveRagInputTokens}
            provider={trace.provider}
            loading={loading}
            error={error}
          />
        )}

      {selectedStep === "response" &&
        (trace?.model != null || trace?.routingClass != null) && (
          <ModelRoutingCard
            model={trace.model}
            routingClass={trace.routingClass}
            routingConfidence={trace.routingConfidence}
            routingReason={trace.routingReason}
          />
        )}

      {trace?.provider != null && (
        <CostDisplay
          provider={trace.provider}
          inputTokens={trace.inputTokens ?? trace.tokensSent ?? 0}
          outputTokens={trace.outputTokens ?? 0}
          cost={trace.cost}
          loading={loading}
          error={error}
        />
      )}

      {correctionOpen &&
        traceId != null &&
        initialCorrectionResponse != null &&
        onSubmitCorrection != null && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Edit correction"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setCorrectionOpen(false);
            }}
          >
            <div className="flex w-full max-w-lg flex-col gap-4 rounded-lg border border-border bg-bg-surface p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-text-primary">
                  Correct response
                </h2>
                <button
                  type="button"
                  onClick={() => setCorrectionOpen(false)}
                  aria-label="Close"
                  className="rounded p-1 text-text-muted transition-colors hover:text-text-primary"
                >
                  <X size={16} />
                </button>
              </div>
              <EditCorrection
                key={traceId}
                traceId={traceId}
                initialResponse={initialCorrectionResponse}
                onSubmit={async (id, text) => {
                  await onSubmitCorrection(id, text);
                  setCorrectionOpen(false);
                }}
              />
            </div>
          </div>
        )}

      <section className="flex flex-col gap-4 rounded-md border border-border bg-bg-surface px-5 py-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-text-primary">
            Chunk Inspector
          </h3>
          <p className="flex items-center gap-1.5 text-xs text-text-muted">
            <span>Context chunk, relevance score for the selected step.</span>
            <span className="group relative shrink-0">
              <button
                type="button"
                className="rounded p-0.5 text-text-muted transition-colors hover:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-bg-surface"
                aria-label="What is the Chunk Inspector?"
                aria-describedby="node-inspector-tooltip"
              >
                <CircleHelp size={14} strokeWidth={2} />
              </button>
              <span
                id="node-inspector-tooltip"
                role="tooltip"
                className="pointer-events-none absolute left-1/2 top-full z-10 mt-1.5 w-56 -translate-x-1/2 rounded-md border border-border bg-bg-surface px-2.5 py-2 text-left text-xs font-normal text-text-primary shadow-lg opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
              >
                Shows the retrieved context for the selected step: Change the
                timeline step above to see different data.
              </span>
            </span>
          </p>
        </div>
        <NodeInspector
          nodes={inspectorNodes}
          loading={loading}
          error={error}
          showScoreColumn={selectedStep !== "retrieval"}
        />
      </section>
    </div>
  );
}
