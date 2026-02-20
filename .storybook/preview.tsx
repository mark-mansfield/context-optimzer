import type { Decorator, Preview } from "@storybook/react";
import React, { useEffect } from "react";
import "../src/dashboard/index.css";

function resolveTheme(
  value: string,
): "light" | "dark" {
  if (value === "dark") return "dark";
  if (value === "light") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme ?? "system";
  const resolved = resolveTheme(theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolved === "dark");
    document.documentElement.style.colorScheme = resolved;
  }, [resolved]);

  return (
    <div
      style={{
        background: "var(--color-bg-primary)",
        color: "var(--color-text-primary)",
        minHeight: "100%",
        padding: 16,
      }}
    >
      <Story />
    </div>
  );
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Theme for components",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "system", title: "System", icon: "browser" },
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "system",
  },
  decorators: [withTheme],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
