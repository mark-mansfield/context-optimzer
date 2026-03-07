import type { Meta, StoryObj } from "@storybook/react";
import { ModelRoutingCard } from "@/components/model-routing-card";

const meta = {
  title: "Components/ModelRoutingCard",
  component: ModelRoutingCard,
} satisfies Meta<typeof ModelRoutingCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Full: Story = {
  args: {
    model: "claude-sonnet-4-20250514",
    routingClass: "reasoning",
    routingConfidence: 0.92,
    routingReason: "Query requires multi-step analysis.",
  },
};

export const Informational: Story = {
  args: {
    model: "gpt-4o-mini",
    routingClass: "informational",
    routingConfidence: 0.88,
    routingReason: "Simple lookup question.",
  },
};

export const ModelAndClassOnly: Story = {
  args: {
    model: "claude-3-5-sonnet-20241022",
    routingClass: "reasoning",
  },
};

export const WithConfidenceOnly: Story = {
  args: {
    model: "claude-sonnet-4-20250514",
    routingClass: "reasoning",
    routingConfidence: 0.75,
  },
};

export const ModelOnly: Story = {
  args: {
    model: "gpt-4o",
  },
};

export const RoutingClassOnly: Story = {
  args: {
    routingClass: "informational",
  },
};

export const Empty: Story = {
  args: {},
};
