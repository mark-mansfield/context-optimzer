# TODO_04: Dark / Light Theme with System Detection and Manual Toggle

Status: DONE

**What changed:** Added 12 semantic CSS custom-property tokens (light + dark) to `index.css` with Tailwind v4 `@custom-variant dark`. Created `themeStore.ts` (Zustand) with system/light/dark preference persisted to localStorage, live `matchMedia` listener, and DOM class toggling. Built `<ThemeToggle />` component using lucide-react icons. Wired `initTheme()` in `main.tsx`. Added Storybook toolbar theme switcher via `globalTypes` + global decorator in `.storybook/preview.tsx`. Added `ThemeTokens.stories.tsx` swatch grid for visual palette verification. All gates pass: `yarn test` (13 passed), `yarn typecheck` (0 errors), `yarn build-storybook` (exit 0).

## Context

- Links: [PHASE_4.md](../PHASE_4.md), [TODO_03.md](TODO_03.md)
- Tailwind CSS v4 + Zustand are already installed (TODO_02 / TODO_03).
- The dashboard has many surfaces (timeline, node inspector, score bars, status badges) that need legible colors in both modes. Defining semantic CSS custom-property tokens now means every future component just references token names — no `dark:` clutter in JSX and a single-file change to adjust the palette.

## Description

Implement a theme system that:

1. **Detects the OS-level preference** via `prefers-color-scheme: dark`.
2. **Allows manual override** (`"system" | "light" | "dark"`) persisted to `localStorage`.
3. **Applies via a CSS class** (`dark`) on `<html>`, using Tailwind v4's `@custom-variant dark` strategy.
4. **Exposes semantic CSS custom-property tokens** that flip automatically when the class toggles.
5. **Provides a `<ThemeToggle />` component** for the user to cycle / select the preference.
6. **Listens to the `change` event** on `matchMedia("(prefers-color-scheme: dark)")` so the theme updates live if the user toggles OS dark mode while the dashboard is open (only relevant when preference is `"system"`).

### Token set

| Token                    | Purpose                                        |
| ------------------------ | ---------------------------------------------- |
| `--color-bg-primary`     | Page background                                |
| `--color-bg-surface`     | Cards, panels (Timeline, Node Inspector)       |
| `--color-bg-muted`       | Subtle backgrounds (code blocks, pruned nodes) |
| `--color-bg-elevated`    | Header, floating elements                      |
| `--color-border`         | Panel / card borders                           |
| `--color-text-primary`   | Headings, body text                            |
| `--color-text-secondary` | Labels, metadata, timestamps                   |
| `--color-text-muted`     | Disabled, placeholder text                     |
| `--color-accent`         | Primary action buttons, active timeline step   |
| `--color-success`        | High relevance scores, "kept" nodes            |
| `--color-warning`        | Mid-range scores, cost alerts                  |
| `--color-danger`         | Error states, pruned nodes, low scores         |

### Zustand store shape

```ts
type ThemePreference = "system" | "light" | "dark";

interface ThemeStore {
  preference: ThemePreference;
  resolved: "light" | "dark"; // the actually-applied mode
  setPreference: (pref: ThemePreference) => void;
}
```

- On store creation, read `localStorage.getItem("dco-theme")` (fallback `"system"`).
- `resolved` is derived: when `"system"`, check `window.matchMedia("(prefers-color-scheme: dark)").matches`.
- A `matchMedia` `change` listener updates `resolved` live.
- Whenever `resolved` changes, toggle `document.documentElement.classList` (`"dark"` class) and set `<meta name="color-scheme">`.

## Expected Inputs

- Existing `src/dashboard/index.css` (currently just `@import "tailwindcss";`).
- Existing Zustand dependency.
- Existing Storybook preview (imports `index.css`).

## Storybook Integration

Add a **toolbar theme switcher** to Storybook so every story can be previewed in light, dark, and system modes without leaving the Storybook UI.

### Implementation

1. **`globalTypes` in `.storybook/preview.ts`** — register a `theme` toolbar item with three options (`light`, `dark`, `system`), defaulting to `system`.
2. **Global decorator in `.storybook/preview.ts`** — a `withTheme` decorator that:
   - Reads the selected toolbar value from `context.globals.theme`.
   - Resolves `"system"` via `matchMedia`.
   - Toggles the `dark` class on `document.documentElement` (so tokens + Tailwind `dark:` both flip).
   - Sets `document.documentElement.style.colorScheme` to the resolved value for native form-control theming.
   - Wraps the story in a container styled with `background: var(--color-bg-primary); color: var(--color-text-primary)` so the token-based palette is visible immediately.
3. **Token demo story** — add `src/dashboard/components/ThemeTokens.stories.tsx`, a story that renders swatches for all 12 tokens so you can visually verify the palette in both modes from the toolbar.

### Why a decorator instead of an addon

A decorator keeps everything in the preview config (no separate addon package). It uses the built-in Storybook toolbar API (`globalTypes`) which gives you the dropdown in the toolbar for free.

## Expected Outputs

- Theme tokens defined once in CSS; all future components reference them.
- A working `<ThemeToggle />` component (with Storybook story).
- A **Storybook toolbar dropdown** that toggles light / dark / system across all stories.
- A **token swatch story** (`ThemeTokens.stories.tsx`) for visually verifying the palette.
- OS dark-mode preference respected by default; manual override available and persisted.

## Acceptance Criteria

- [x] `src/dashboard/index.css` contains `@custom-variant dark (&:where(.dark, .dark *));` and defines all 12 semantic tokens for both light and dark modes.
- [x] `src/dashboard/stores/themeStore.ts` exists, exports `useThemeStore` with `preference`, `resolved`, and `setPreference`.
- [x] Store reads initial preference from `localStorage` and writes on change.
- [x] Store subscribes to `matchMedia("(prefers-color-scheme: dark)")` `change` event and updates `resolved` when preference is `"system"`.
- [x] `document.documentElement.classList` gets `"dark"` toggled based on `resolved`.
- [x] `src/dashboard/components/ThemeToggle.tsx` renders a control that lets the user pick system / light / dark.
- [x] `src/dashboard/components/ThemeToggle.stories.tsx` exists with stories for each preference state.
- [x] `.storybook/preview.tsx` registers a `theme` `globalType` toolbar item with `light`, `dark`, `system` options.
- [x] `.storybook/preview.tsx` exports a global decorator that toggles the `dark` class on `document.documentElement` and applies `colorScheme` based on the toolbar selection.
- [x] `src/dashboard/components/ThemeTokens.stories.tsx` exists and renders a swatch grid of all 12 semantic tokens for visual verification.
- [x] Switching the Storybook toolbar dropdown between light / dark / system visibly changes every story's appearance.
- [x] `yarn test` exits 0 (unit tests for the store's resolve logic).
- [x] `yarn typecheck` exits 0.
- [x] `yarn build-storybook` exits 0.

## Test Plan

- **Unit (vitest + jsdom)**:
  - `themeStore.test.ts` — mock `matchMedia`, verify `resolved` output for each `preference` value, verify `localStorage` read/write, verify class toggle on `document.documentElement`.
- **Story**: `ThemeToggle.stories.tsx` — visual verification of the toggle in each state.
- **Story**: `ThemeTokens.stories.tsx` — swatch grid for all 12 tokens; use the Storybook toolbar dropdown to flip between light and dark and visually confirm contrast / legibility.
- **Manual (Storybook)**: open any story, use the theme toolbar dropdown — verify the background, text, borders, and status colors all change.
- **Gate commands**: `yarn test`, `yarn typecheck`, `yarn build-storybook` all exit 0.

## Files (expected)

- `src/dashboard/index.css` (modified — tokens + `@custom-variant`)
- `src/dashboard/stores/themeStore.ts` (new)
- `src/dashboard/stores/themeStore.test.ts` (new)
- `src/dashboard/components/ThemeToggle.tsx` (new)
- `src/dashboard/components/ThemeToggle.stories.tsx` (new)
- `src/dashboard/main.tsx` (modified — initialize theme on mount)
- `.storybook/preview.ts` (modified — `globalTypes` toolbar item + `withTheme` global decorator)
- `src/dashboard/components/ThemeTokens.stories.tsx` (new — token swatch demo story)

## Notes / Non-goals

- Do **not** build the full DashboardLayout in this TODO — that's a separate TODO.
- The specific hex values for the tokens are a starting point; they can be refined when real components land.
- High-contrast mode is out of scope but the token architecture makes it trivial to add later.
- Tailwind utility classes (`dark:bg-...`) can still be used alongside tokens; the `@custom-variant` makes both approaches work.
