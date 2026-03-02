import type { Meta, StoryObj } from "@storybook/react";
import type { TraceViewTrace } from "@/components/trace-view";
import { TraceView } from "@/components/trace-view";

const mockTrace: TraceViewTrace = {
  traceId: "trace-abc",
  steps: [
    { id: "retrieval", label: "Retrieval" },
    { id: "rerank", label: "Rerank" },
    { id: "response", label: "Response" },
  ],
  nodes: [
    {
      id: "refund-policy.md:0",
      rawText: "Retrieved passage from the index.",
      rerankedText: "Trimmed context sent to the LLM after rerank.",
      score: 0.92,
      status: "kept",
    },
    {
      id: "shipping-faq.md:2",
      rawText: "Low-scoring chunk.",
      rerankedText: "Low-scoring chunk.",
      score: 0.25,
      status: "pruned",
    },
  ],
  responseNodes: [
    {
      id: "refund-policy.md:0",
      rawText: "Context chunk used for final answer generation.",
      rerankedText: "Included in prompt to LLM.",
      score: 0.88,
      status: "kept",
    },
    {
      id: "returns-guide.md:1",
      rawText: "Supporting passage for the response.",
      rerankedText: "Supporting passage for the response.",
      score: 0.75,
      status: "kept",
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
