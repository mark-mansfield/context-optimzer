# TODO_11: Feedback UI (Thumbs Up/Down)

Status: DONE

Completed: Added `FeedbackButtons` presentational component with Thumbs Up/Down (lucide-react), optional `currentVote`/`loading`/`error`, semantic theme tokens, aria-pressed for selected state, plus unit tests and Storybook stories (Default, VotedUp, VotedDown, Loading, Error). Persistence left for TODO_12.

## Context

- Links: [PHASE_4.md](../PHASE_4.md), [TODO_10.md](TODO_10.md)
- W4.3 (PHASE_4.md): "Implement 'Thumbs Up/Down' and 'Edit Correction' features."
- Phase 4 DoD: "Feedback Functional: User feedback (up/down votes) is successfully persisted to the database and linked to the specific trace_id."
- This TODO covers the **presentational UI only**; persistence is TODO_12.

## Description

Implement a **FeedbackButtons** (or **TraceFeedback**) React component that shows Thumbs Up and Thumbs Down controls for a trace. The component is presentational: it receives `traceId`, callbacks (`onUp`, `onDown`), and optional `currentVote` ('up' | 'down' | null), `loading`, and `error` via props. Use semantic theme tokens. Include Storybook stories for Default (no vote), Voted Up, Voted Down, Loading, and Error. Unit tests for click handlers and displayed state.

## Expected Inputs

- Props: `traceId` (string), `onUp` (() => void), `onDown` (() => void); optional `currentVote` ('up' | 'down' | null), `loading` (boolean), `error` (string | null).
- Theme tokens from existing dashboard.

## Expected Outputs

- A `<FeedbackButtons />` component that renders Thumbs Up and Thumbs Down controls.
- Visual state for selected vote (e.g. highlighted when `currentVote` is set).
- Loading and error states when provided.
- Storybook: **Default** (no vote), **Voted Up**, **Voted Down**, **Loading**, **Error**.
- Unit tests: assert buttons render; assert onUp/onDown called when clicked; assert currentVote styling; loading/error rendering.
- `yarn test`, `yarn typecheck`, `yarn build-storybook` pass.

## Acceptance Criteria

- [x] Component exists and accepts `traceId`, `onUp`, `onDown`, and optional `currentVote`, `loading`, `error`.
- [x] Thumbs Up and Thumbs Down are clearly visible and clickable.
- [x] When `currentVote` is 'up' or 'down', the corresponding button shows selected state (semantic tokens).
- [x] Storybook: Default, Voted Up, Voted Down, Loading, Error.
- [x] Unit tests verify click handlers and state display.
- [x] `yarn test`, `yarn typecheck`, `yarn build-storybook` pass.

## Test Plan

- **Unit (Vitest + RTL):** Render with mock onUp/onDown; click each button and assert callbacks invoked. Render with currentVote and assert selected styling. Loading and error states.
- **Storybook:** Open FeedbackButtons stories; verify interaction and states.
- **Gates:** `yarn test`, `yarn typecheck`, `yarn build-storybook`.

## Files (expected)

- `src/dashboard/components/FeedbackButtons.tsx` (or `TraceFeedback.tsx`)
- `src/dashboard/components/FeedbackButtons.stories.tsx`
- `src/dashboard/components/FeedbackButtons.test.tsx`

## Notes / Non-goals

- No API or persistence in this TODO; component only invokes callbacks. Persistence is TODO_12.
- Edit Correction UI is TODO_13.
