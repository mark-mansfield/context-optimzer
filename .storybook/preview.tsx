import type { Decorator, Preview } from "@storybook/react";
import React, { useEffect } from "react";
import "../src/dashboard/index.css";
import { useThemeStore } from "../src/dashboard/stores/themeStore";

function resolveTheme(value: string): "light" | "dark" {
  if (value === "dark") return "dark";
  if (value === "light") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals.theme as string) ?? "system";
  const resolved = resolveTheme(theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolved === "dark");
    document.documentElement.style.colorScheme = resolved;
    // Sync Zustand store so ThemeToggle (and any theme-aware component) sees correct resolved/preference
    useThemeStore.setState({
      preference: theme as "system" | "light" | "dark",
      resolved,
    });
  }, [resolved, theme]);

  return (
    <div className="min-h-full bg-bg-primary p-4 text-text-primary">
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
