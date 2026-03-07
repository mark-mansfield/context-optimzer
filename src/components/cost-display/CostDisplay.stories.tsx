import type { Meta, StoryObj } from "@storybook/react";
import { CostDisplay } from "@/components/cost-display";

const meta = {
  title: "Components/CostDisplay",
  component: CostDisplay,
} satisfies Meta<typeof CostDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    provider: "openai",
    inputTokens: 1200,
    outputTokens: 340,
  },
};

export const Groq: Story = {
  args: {
    provider: "groq",
    inputTokens: 50_000,
    outputTokens: 1200,
  },
};

export const Anthropic: Story = {
  args: {
    provider: "anthropic",
    inputTokens: 100_000,
    outputTokens: 2500,
  },
};

export const WithExplicitCost: Story = {
  args: {
    provider: "openai",
    inputTokens: 5000,
    outputTokens: 800,
    cost: 0.0125,
  },
};

export const Loading: Story = {
  args: {
    provider: "openai",
    inputTokens: 0,
    outputTokens: 0,
    loading: true,
  },
};

export const Error: Story = {
  args: {
    provider: "openai",
    inputTokens: 0,
    outputTokens: 0,
    error: "Cost unavailable",
  },
};
