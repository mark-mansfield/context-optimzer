# TODO_18: ThemeToggle component (W4.4)

Status: DONE

Completed: ThemeToggle implemented at `src/components/theme-toggle/index.tsx`; uses `@/dashboard/stores/themeStore`; sun/moon icon, rounded button, aria-label; App and Storybook import from `@/components/theme-toggle`; unit tests added; old `dashboard/components/ThemeToggle.tsx` removed.

## Context

- Links: [PHASE_4.md](../PHASE_4.md) (W4.4), [VISUAL_WORK_ITEM.md](../VISUAL_WORK_ITEM.md), reference [ui-refs/dashboard.png](../ui-refs/dashboard.png)
- W4.4 dashboard visual: align UI with design mockup. ThemeToggle is the light/dark theme control in the header.

## Description

Implement or overwrite the **ThemeToggle** component so it matches the reference image: a single control (e.g. rounded button with sun/moon icon) that toggles light/dark theme. Use path `src/components/theme-toggle/index.tsx` for clean imports (`@/components/theme-toggle`).

## Expected Inputs

- Reference image: `docs/ui-refs/dashboard.png`.
- Existing theme store or context if present (e.g. theme state, setTheme).

## Expected Outputs

- Component at `src/components/theme-toggle/index.tsx` exporting ThemeToggle.
- Renders a control that matches reference (icon, styling); toggling updates app theme.
- `yarn test`, `yarn typecheck` pass.

## Acceptance Criteria

- [ ] Component lives at `src/components/theme-toggle/index.tsx`.
- [ ] Renders a single toggle control (e.g. button with sun/moon icon) matching reference styling.
- [ ] Clicking toggles between light and dark theme; state persists (e.g. localStorage or store).
- [ ] No layout or accessibility regressions; existing tests and typecheck pass.

## Test Plan

- Unit test: render ThemeToggle, assert control visible; optional: assert toggle updates theme.
- Gates: `yarn test`, `yarn typecheck`.

## Files (expected)

- `src/components/theme-toggle/index.tsx` (create or overwrite).

## Notes / Non-goals

- Header layout is in App TODO; this is the toggle component only.
