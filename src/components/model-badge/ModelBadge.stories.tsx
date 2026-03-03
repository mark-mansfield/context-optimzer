import type { Meta, StoryObj } from "@storybook/react";
import { ModelBadge } from "@/components/model-badge";

const meta = {
  title: "Components/ModelBadge",
  component: ModelBadge,
} satisfies Meta<typeof ModelBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithModel: Story = {
  args: {
    model: "claude-sonnet-4-20250514",
  },
};

export const WithModelLongName: Story = {
  args: {
    model: "gpt-4o-mini with extended context window",
  },
};

export const ProviderOnlyGroq: Story = {
  args: {
    provider: "groq",
  },
};

export const ProviderOnlyAnthropic: Story = {
  args: {
    provider: "anthropic",
  },
};

export const ProviderOnlyOpenAI: Story = {
  args: {
    provider: "openai",
  },
};

export const ModelAndProvider: Story = {
  args: {
    model: "claude-3-5-sonnet-20241022",
    provider: "anthropic",
  },
};

export const Empty: Story = {
  args: {},
};
