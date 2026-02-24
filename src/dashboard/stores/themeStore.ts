import { create } from "zustand";

export type ThemePreference = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export interface ThemeState {
  preference: ThemePreference;
  resolved: ResolvedTheme;
}

interface ThemeStore extends ThemeState {
  getPreference: () => ThemeState;
  setPreference: (pref: ThemePreference) => void;
}

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolve(preference: ThemePreference): ResolvedTheme {
  return preference === "system" ? getSystemTheme() : preference;
}

function applyToDOM(resolved: ResolvedTheme) {
  const el = document.documentElement;
  el.classList.toggle("dark", resolved === "dark");
  el.style.colorScheme = resolved;
}

const storedPref =
  (localStorage.getItem("dco-theme") as ThemePreference) ?? "system";

export const useThemeStore = create<ThemeStore>((set, get) => ({
  preference: storedPref,
  resolved: resolve(storedPref),

  getPreference: () => ({ preference: get().preference, resolved: get().resolved }),

  setPreference(pref) {
    localStorage.setItem("dco-theme", pref);
    const resolved = resolve(pref);
    applyToDOM(resolved);
    set({ preference: pref, resolved });
  },
}));

/**
 * Call once at app startup to sync the initial DOM state and
 * subscribe to OS-level theme changes.
 */
export function initTheme() {
  const { preference } = useThemeStore.getState();
  const resolved = resolve(preference);
  applyToDOM(resolved);
  useThemeStore.setState({ resolved });

  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  mql.addEventListener("change", (e) => {
    const { preference } = useThemeStore.getState();
    if (preference !== "system") return;
    const resolved: ResolvedTheme = e.matches ? "dark" : "light";
    applyToDOM(resolved);
    useThemeStore.setState({ resolved });
  });
}
