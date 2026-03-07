import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@/components/ui/input";

const meta = {
  title: "Components/Input",
  component: Input,
  argTypes: {
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    type: {
      control: "select",
      options: ["text", "email", "password", "search"],
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Placeholder text",
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: "Some value",
    placeholder: "Enter something...",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled input",
    disabled: true,
  },
};

export const QueryInput: Story = {
  args: {
    placeholder: "Enter a query...",
    "aria-label": "Query input",
  },
  decorators: [
    (Story) => (
      <div className="flex max-w-md gap-2">
        <Story />
      </div>
    ),
  ],
};
