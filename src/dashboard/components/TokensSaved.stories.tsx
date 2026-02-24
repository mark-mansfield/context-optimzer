import type { Meta, StoryObj } from "@storybook/react";
import { TokensSaved } from "./TokensSaved";

const meta = {
  title: "Components/TokensSaved",
  component: TokensSaved,
} satisfies Meta<typeof TokensSaved>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    dcoInputTokens: 2100,
    naiveRagInputTokens: 8500,
  },
};

export const WithCostAvoided: Story = {
  args: {
    dcoInputTokens: 2000,
    naiveRagInputTokens: 100_000,
    provider: "openai",
  },
};

export const ZeroSaved: Story = {
  args: {
    dcoInputTokens: 5000,
    naiveRagInputTokens: 5000,
  },
};

export const Loading: Story = {
  args: {
    dcoInputTokens: 0,
    naiveRagInputTokens: 0,
    loading: true,
  },
};

export const Error: Story = {
  args: {
    dcoInputTokens: 0,
    naiveRagInputTokens: 0,
    error: "Comparison unavailable",
  },
};
