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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "8px 0",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 8,
          background: `var(${name})`,
          border: "1px solid var(--color-border)",
          flexShrink: 0,
        }}
      />
      <div>
        <div
          style={{
            fontWeight: 600,
            fontSize: 14,
            color: "var(--color-text-primary)",
          }}
        >
          {label}
        </div>
        <code
          style={{
            fontSize: 12,
            color: isBg
              ? "var(--color-text-secondary)"
              : "var(--color-text-muted)",
          }}
        >
          {name}
        </code>
      </div>
    </div>
  );
}

function TokenGrid() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "8px 32px",
        padding: 24,
        background: "var(--color-bg-primary)",
        color: "var(--color-text-primary)",
        borderRadius: 12,
      }}
    >
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
