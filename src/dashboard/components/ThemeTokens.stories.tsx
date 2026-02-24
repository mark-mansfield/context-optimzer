import type { Meta, StoryObj } from "@storybook/react";

const tokens = [
  { name: "--color-bg-primary", label: "Background Primary" },
  { name: "--color-bg-surface", label: "Background Surface" },
  { name: "--color-bg-muted", label: "Background Muted" },
  { name: "--color-bg-elevated", label: "Background Elevated" },
  { name: "--color-border", label: "Border" },
  { name: "--color-text-primary", label: "Text Primary" },
  { name: "--color-text-secondary", label: "Text Secondary" },
  { name: "--color-text-muted", label: "Text Muted" },
  { name: "--color-accent", label: "Accent" },
  { name: "--color-success", label: "Success" },
  { name: "--color-warning", label: "Warning" },
  { name: "--color-danger", label: "Danger" },
] as const;

function Swatch({ name, label }: { name: string; label: string }) {
  const isBg = name.startsWith("--color-bg") || name === "--color-border";
  return (
    <div className="flex items-center gap-3 py-2">
      <div
        className={`h-12 w-12 shrink-0 rounded-lg border border-border bg-(${name})`}
      />
      <div>
        <div className="text-sm font-semibold text-text-primary">
          {label}
        </div>
        <code
          className={`text-xs ${
            isBg ? "text-text-secondary" : "text-text-muted"
          }`}
        >
          {name}
        </code>
      </div>
    </div>
  );
}

function TokenGrid() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-y-2 gap-x-8 rounded-xl bg-bg-primary px-6 py-6 text-text-primary">
      {tokens.map((t) => (
        <Swatch key={t.name} name={t.name} label={t.label} />
      ))}
    </div>
  );
}

const meta = {
  title: "Theme/Token Palette",
  component: TokenGrid,
} satisfies Meta<typeof TokenGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllTokens: Story = {};
