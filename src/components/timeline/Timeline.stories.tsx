import type { Meta, StoryObj } from "@storybook/react";
import { Timeline } from "@/components/timeline";

const mockTrace = {
  traceId: "trace-abc",
  steps: [
    { id: "retrieval", label: "Retrieval" },
    { id: "rerank", label: "Rerank" },
    { id: "response", label: "Response" },
  ],
};

const meta = {
  title: "Components/Timeline",
  component: Timeline,
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TraceView: Story = {
  args: {
    trace: mockTrace,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const Error: Story = {
  args: {
    error: "Failed to load trace",
  },
};
