import type { Meta, StoryObj } from "@storybook/react";
import { TraceView } from "./TraceView";
import type { TraceViewTrace } from "./TraceView";

const mockTrace: TraceViewTrace = {
  traceId: "trace-abc",
  steps: [
    { id: "retrieval", label: "Retrieval" },
    { id: "rerank", label: "Rerank" },
    { id: "response", label: "Response" },
  ],
  nodes: [
    {
      id: "node-1",
      rawText: "Retrieved passage from the index.",
      rerankedText: "Trimmed context sent to the LLM after rerank.",
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
  ],
};

const meta = {
  title: "Components/TraceView",
  component: TraceView,
} satisfies Meta<typeof TraceView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    trace: mockTrace,
  },
};

export const Loading: Story = {
  args: {
    trace: mockTrace,
    loading: true,
  },
};

export const Error: Story = {
  args: {
    trace: mockTrace,
    error: "Failed to load trace",
  },
};
