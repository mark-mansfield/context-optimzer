import { beforeEach, describe, expect, it, vi } from "vitest";

type MediaListener = (e: { matches: boolean }) => void;

let mediaMatches = false;
const mediaListeners: MediaListener[] = [];

function mockMatchMedia() {
  const mql = {
    matches: mediaMatches,
    media: "(prefers-color-scheme: dark)",
    addEventListener: (_event: string, fn: MediaListener) => {
      mediaListeners.push(fn);
    },
    removeEventListener: (_event: string, fn: MediaListener) => {
      const idx = mediaListeners.indexOf(fn);
      if (idx >= 0) mediaListeners.splice(idx, 1);
    },
  };
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn(() => mql),
  });
  return mql;
}

function fireMediaChange(matches: boolean) {
  mediaMatches = matches;
  for (const fn of mediaListeners) fn({ matches });
}

describe("themeStore", () => {
  let useThemeStore: typeof import("./themeStore").useThemeStore;
  let initTheme: typeof import("./themeStore").initTheme;

  beforeEach(async () => {
    mediaMatches = false;
    mediaListeners.length = 0;
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = "";

    mockMatchMedia();

    vi.resetModules();
    const mod = await import("./themeStore");
    useThemeStore = mod.useThemeStore;
    initTheme = mod.initTheme;
  });

  it("defaults preference to 'system' when localStorage is empty", () => {
    const { preference } = useThemeStore.getState();
    expect(preference).toBe("system");
  });

  it("reads initial preference from localStorage", async () => {
    localStorage.setItem("dco-theme", "dark");
    vi.resetModules();
    mockMatchMedia();
    const mod = await import("./themeStore");
    expect(mod.useThemeStore.getState().preference).toBe("dark");
  });

  it("resolves to 'light' when preference is 'system' and OS is light", () => {
    initTheme();
    expect(useThemeStore.getState().resolved).toBe("light");
  });

  it("resolves to 'dark' when preference is 'system' and OS is dark", async () => {
    mediaMatches = true;
    vi.resetModules();
    mockMatchMedia();
    const mod = await import("./themeStore");
    mod.initTheme();
    expect(mod.useThemeStore.getState().resolved).toBe("dark");
  });

  it("resolves to 'dark' when preference is explicitly 'dark'", () => {
    initTheme();
    useThemeStore.getState().setPreference("dark");
    expect(useThemeStore.getState().resolved).toBe("dark");
  });

  it("resolves to 'light' when preference is explicitly 'light'", async () => {
    mediaMatches = true;
    vi.resetModules();
    mockMatchMedia();
    const mod = await import("./themeStore");
    mod.initTheme();
    mod.useThemeStore.getState().setPreference("light");
    expect(mod.useThemeStore.getState().resolved).toBe("light");
  });

  it("persists preference to localStorage on change", () => {
    initTheme();
    useThemeStore.getState().setPreference("dark");
    expect(localStorage.getItem("dco-theme")).toBe("dark");
  });

  it("adds 'dark' class to documentElement when resolved is dark", () => {
    initTheme();
    useThemeStore.getState().setPreference("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("removes 'dark' class when resolved switches to light", () => {
    initTheme();
    useThemeStore.getState().setPreference("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    useThemeStore.getState().setPreference("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("sets colorScheme on documentElement", () => {
    initTheme();
    useThemeStore.getState().setPreference("dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");

    useThemeStore.getState().setPreference("light");
    expect(document.documentElement.style.colorScheme).toBe("light");
  });

  it("updates resolved when OS preference changes and mode is 'system'", () => {
    initTheme();
    expect(useThemeStore.getState().resolved).toBe("light");

    fireMediaChange(true);
    expect(useThemeStore.getState().resolved).toBe("dark");

    fireMediaChange(false);
    expect(useThemeStore.getState().resolved).toBe("light");
  });

  it("ignores OS preference changes when mode is explicit", () => {
    initTheme();
    useThemeStore.getState().setPreference("light");

    fireMediaChange(true);
    expect(useThemeStore.getState().resolved).toBe("light");
  });
});
