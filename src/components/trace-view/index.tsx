import { useState } from "react";
import { CircleHelp } from "lucide-react";
import type { FeedbackVote } from "@/api/feedback";
import type { ProviderId } from "@/dashboard/cost/types";
import type { TraceForExport } from "@/dashboard/goldSet/types";
import { CostDisplay } from "@/components/cost-display";
import { TokensSaved } from "@/components/tokens-saved";
import type { InspectorNode } from "@/components/node-inspector";
import { NodeInspector } from "@/components/node-inspector";
import { TokenMetricsCards } from "@/components/token-metrics-cards";
import { EditCorrection } from "@/components/edit-correction";
import { ExportGoldSet } from "@/components/export-gold-set";
import { FeedbackButtons } from "@/components/feedback-buttons";
import type { TimelineStep, TimelineTrace } from "@/components/timeline";
import { Timeline } from "@/components/timeline";

export type TraceViewStepId = "retrieval" | "rerank" | "response";

/** Trace shape for TraceView: steps for Timeline and nodes for Node Inspector. */
export interface TraceViewTrace extends TimelineTrace {
  nodes?: InspectorNode[];
  /** Optional nodes to show when the Response step is selected (simulated response context). */
  responseNodes?: InspectorNode[];
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
  onSubmitCorrection?: (traceId: string, correctedText: string) => Promise<void>;
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
  const [selectedStep, setSelectedStep] = useState<TraceViewStepId>("retrieval");

  const steps = trace?.steps?.length ? trace.steps : DEFAULT_STEPS;
  const timelineTrace: TimelineTrace | null = trace
    ? { traceId: trace.traceId, steps }
    : null;
  const inspectorNodes = nodesForStep(selectedStep, trace);

  const sampleChunkExtra = (
    <>
      {traceId != null && onFeedbackUp != null && onFeedbackDown != null && (
        <FeedbackButtons
          traceId={traceId}
          currentVote={currentVote ?? null}
          onUp={onFeedbackUp}
          onDown={onFeedbackDown}
        />
      )}
      {tracesForExport != null && tracesForExport.length > 0 && (
        <ExportGoldSet traces={tracesForExport} />
      )}
    </>
  );

  const correctionSlot =
    traceId != null &&
    initialCorrectionResponse != null &&
    onSubmitCorrection != null ? (
      <EditCorrection
        key={traceId}
        traceId={traceId}
        initialResponse={initialCorrectionResponse}
        onSubmit={onSubmitCorrection}
      />
    ) : undefined;

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <Timeline
        trace={timelineTrace}
        loading={loading}
        error={error}
        selectedStep={selectedStep}
        onStepSelect={(stepId) => setSelectedStep(stepId as TraceViewStepId)}
      />
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

      <section className="flex flex-col gap-4 rounded-md border border-border bg-bg-surface px-5 py-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-text-primary">Node Inspector</h3>
          <p className="flex items-center gap-1.5 text-xs text-text-muted">
            <span>
              Sample chunk, relevance score, and edit correction for the selected step.
            </span>
            <span className="group relative shrink-0">
              <button
                type="button"
                className="rounded p-0.5 text-text-muted transition-colors hover:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-bg-surface"
                aria-label="What is the Node Inspector?"
                aria-describedby="node-inspector-tooltip"
              >
                <CircleHelp size={14} strokeWidth={2} />
              </button>
              <span
                id="node-inspector-tooltip"
                role="tooltip"
                className="pointer-events-none absolute left-1/2 top-full z-10 mt-1.5 w-56 -translate-x-1/2 rounded-md border border-border bg-bg-surface px-2.5 py-2 text-left text-xs font-normal text-text-primary shadow-lg opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
              >
                Shows the retrieved context for the selected step: a sample chunk, its relevance score, and the edit-correction field. Change the timeline step above to see different data.
              </span>
            </span>
          </p>
        </div>
        <NodeInspector
          nodes={inspectorNodes}
          loading={loading}
          error={error}
          sampleChunkExtra={sampleChunkExtra}
          correctionSlot={correctionSlot}
        />
      </section>
    </div>
  );
}
