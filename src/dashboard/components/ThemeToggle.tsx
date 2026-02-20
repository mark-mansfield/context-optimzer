import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "../stores/themeStore";

export function ThemeToggle() {
  const resolved = useThemeStore((s) => s.resolved);
  const setPreference = useThemeStore((s) => s.setPreference);

  const isDark = resolved === "dark";
  const nextMode = isDark ? "light" : "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={() => setPreference(nextMode)}
      aria-label={label}
      className="inline-flex cursor-pointer items-center justify-center rounded-lg p-2 transition-colors hover:opacity-80"
      style={{
        background: "var(--color-bg-muted)",
        color: "var(--color-text-primary)",
      }}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
