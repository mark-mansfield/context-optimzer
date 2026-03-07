import type { Meta, StoryObj } from "@storybook/react";
import type { InspectorNode } from "@/components/node-inspector";
import { NodeInspector } from "@/components/node-inspector";

const mockNodes: InspectorNode[] = [
  {
    id: "refund-policy.md:0",
    rawText: "Initial retrieval returned this passage from the index.",
    rerankedText: "After reranking, this is the trimmed context sent to the LLM.",
    score: 0.94,
    status: "kept",
  },
  {
    id: "shipping-faq.md:2",
    rawText: "A second chunk that was retrieved but scored low.",
    rerankedText: "A second chunk that was retrieved but scored low.",
    score: 0.28,
    status: "pruned",
  },
];

const meta = {
  title: "Components/NodeInspector",
  component: NodeInspector,
} satisfies Meta<typeof NodeInspector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    nodes: mockNodes,
  },
};

export const WithEditCorrection: Story = {
  args: {
    nodes: mockNodes,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const Error: Story = {
  args: {
    error: "Failed to load nodes",
  },
};
