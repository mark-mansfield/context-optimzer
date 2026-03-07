import type { Meta, StoryObj } from "@storybook/react";
import { Dashboard } from "./Dashboard";

const meta = {
  title: "Dashboard/Dashboard",
  component: Dashboard,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Dashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
