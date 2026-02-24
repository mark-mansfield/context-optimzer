import type { Meta, StoryObj } from "@storybook/react";
import { EditCorrection } from "./EditCorrection";

const meta = {
  title: "Components/EditCorrection",
  component: EditCorrection,
  args: {
    traceId: "trace-abc-123",
    initialResponse:
      "The capital of France is Paris. It is known for the Eiffel Tower.",
    onSubmit: async () => {},
  },
} satisfies Meta<typeof EditCorrection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Submitting: Story = {
  args: {
    loading: true,
  },
};

export const Error: Story = {
  args: {
    error: "Failed to save correction",
  },
};
