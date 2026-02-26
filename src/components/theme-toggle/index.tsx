import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/dashboard/stores/themeStore";

export function ThemeToggle() {
  const resolved = useThemeStore((s) => s.resolved);
  const setPreference = useThemeStore((s) => s.setPreference);

  const isDark = resolved === "dark";
  const nextMode = isDark ? "light" : "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";
  const icon = nextMode === "dark" ? <Moon size={20} /> : <Sun size={20} />;

  return (
    <button
      type="button"
      onClick={() => setPreference(nextMode)}
      aria-label={label}
      className="inline-flex cursor-pointer items-center justify-center rounded-md bg-bg-muted p-2 text-text-primary transition-colors hover:opacity-80"
    >
      {icon}
    </button>
  );
}
