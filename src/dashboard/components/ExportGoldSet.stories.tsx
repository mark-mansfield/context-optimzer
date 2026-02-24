import type { Meta, StoryObj } from "@storybook/react";
import { ExportGoldSet } from "./ExportGoldSet";

const sampleTraces = [
  {
    trace_id: "trace-1",
    query: "What is the capital of France?",
    response: "The capital of France is Paris.",
  },
  {
    trace_id: "trace-2",
    query: "Explain quantum entanglement.",
    response: "Quantum entanglement is a phenomenon where particles remain correlated.",
  },
];

const meta = {
  title: "Components/ExportGoldSet",
  component: ExportGoldSet,
  args: {
    traces: sampleTraces,
    onExport: (jsonl) => console.log("Exported JSONL:", jsonl),
  },
} satisfies Meta<typeof ExportGoldSet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OnlyThumbsUp: Story = {
  args: {
    onlyThumbsUp: true,
  },
};
