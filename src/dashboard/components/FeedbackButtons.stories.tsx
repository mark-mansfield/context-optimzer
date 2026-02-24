import type { Meta, StoryObj } from "@storybook/react";
import { FeedbackButtons } from "./FeedbackButtons";

const noop = () => {};

const meta = {
  title: "Components/FeedbackButtons",
  component: FeedbackButtons,
  args: {
    traceId: "trace-abc-123",
    onUp: noop,
    onDown: noop,
  },
} satisfies Meta<typeof FeedbackButtons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const VotedUp: Story = {
  args: {
    currentVote: "up",
  },
};

export const VotedDown: Story = {
  args: {
    currentVote: "down",
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const Error: Story = {
  args: {
    error: "Failed to submit feedback",
  },
};
