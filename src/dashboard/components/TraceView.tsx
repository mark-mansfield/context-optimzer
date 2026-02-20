import { useState } from "react";
import type { InspectorNode } from "./NodeInspector";
import { NodeInspector } from "./NodeInspector";
import type { TimelineStep, TimelineTrace } from "./Timeline";
import { Timeline } from "./Timeline";

export type TraceViewStepId = "retrieval" | "rerank" | "response";

/** Trace shape for TraceView: steps for Timeline and nodes for Node Inspector. */
export interface TraceViewTrace extends TimelineTrace {
  nodes?: InspectorNode[];
}

export interface TraceViewProps {
  trace?: TraceViewTrace | null;
  loading?: boolean;
  error?: string | null;
}

const DEFAULT_STEPS: TimelineStep[] = [
  { id: "retrieval", label: "Retrieval" },
  { id: "rerank", label: "Rerank" },
  { id: "response", label: "Response" },
];

/** Derives which nodes to show in Node Inspector for the given step. */
function nodesForStep(stepId: TraceViewStepId, nodes: InspectorNode[] | undefined): InspectorNode[] {
  if (!nodes?.length) return [];
  if (stepId === "response") return [];
  return nodes;
}

export function TraceView({ trace, loading = false, error = null }: TraceViewProps) {
  const [selectedStep, setSelectedStep] = useState<TraceViewStepId>("retrieval");

  const steps = trace?.steps?.length ? trace.steps : DEFAULT_STEPS;
  const timelineTrace: TimelineTrace | null = trace
    ? { traceId: trace.traceId, steps }
    : null;
  const inspectorNodes = nodesForStep(selectedStep, trace?.nodes);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        minWidth: 0,
      }}
    >
      <Timeline
        trace={timelineTrace}
        loading={loading}
        error={error}
        selectedStep={selectedStep}
        onStepSelect={(stepId) => setSelectedStep(stepId as TraceViewStepId)}
      />
      <NodeInspector
        nodes={inspectorNodes}
        loading={loading}
        error={error}
      />
    </div>
  );
}
