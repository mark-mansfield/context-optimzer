import { vi } from "vitest";

// jsdom does not provide window.matchMedia; themeStore and App use it at module load.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn(() => ({
    matches: false,
    media: "",
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
});
