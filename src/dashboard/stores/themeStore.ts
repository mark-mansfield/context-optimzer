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

let _themeUnsubscribe: (() => void) | null = null;

/**
 * Call once at app startup to sync the initial DOM state and
 * subscribe to OS-level theme changes.
 *
 * Idempotent: repeated calls do not register additional listeners.
 * Returns an unsubscribe function that removes the listener and
 * allows re-initialization (useful for HMR and test teardown).
 */
export function initTheme(): () => void {
  if (_themeUnsubscribe) return _themeUnsubscribe;

  const { preference } = useThemeStore.getState();
  const resolved = resolve(preference);
  applyToDOM(resolved);
  useThemeStore.setState({ resolved });

  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  const listener = (e: MediaQueryListEvent) => {
    const { preference } = useThemeStore.getState();
    if (preference !== "system") return;
    const resolved: ResolvedTheme = e.matches ? "dark" : "light";
    applyToDOM(resolved);
    useThemeStore.setState({ resolved });
  };
  mql.addEventListener("change", listener);

  _themeUnsubscribe = () => {
    mql.removeEventListener("change", listener);
    _themeUnsubscribe = null;
  };

  return _themeUnsubscribe;
}
