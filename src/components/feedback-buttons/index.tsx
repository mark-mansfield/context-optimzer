import { ThumbsDown, ThumbsUp } from "lucide-react";

export type FeedbackVote = "up" | "down" | null;

export interface FeedbackButtonsProps {
  traceId: string;
  onUp: () => void;
  onDown: () => void;
  currentVote?: FeedbackVote;
  loading?: boolean;
  error?: string | null;
}

export function FeedbackButtons({
  traceId,
  onUp,
  onDown,
  currentVote = null,
  loading = false,
  error = null,
}: FeedbackButtonsProps) {
  if (error) {
    return (
      <div
        role="alert"
        className="rounded-md border border-danger bg-bg-surface px-3 py-2 text-sm text-danger"
      >
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div
        role="status"
        aria-label="Loading feedback"
        className="flex items-center gap-2 rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-muted"
      >
        Loading…
      </div>
    );
  }

  const isUp = currentVote === "up";
  const isDown = currentVote === "down";

  return (
    <div
      className="flex items-center gap-1 rounded-md border border-border bg-bg-surface px-2 py-1"
      aria-label={`Feedback for trace ${traceId}`}
    >
      <button
        type="button"
        aria-label="Thumbs up"
        aria-pressed={isUp}
        onClick={onUp}
        className={`rounded p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-accent ${
          isUp ? "bg-bg-muted text-success" : "text-text-secondary hover:text-text-primary hover:bg-bg-muted"
        }`}
      >
        <ThumbsUp className="h-5 w-5" aria-hidden />
      </button>
      <button
        type="button"
        aria-label="Thumbs down"
        aria-pressed={isDown}
        onClick={onDown}
        className={`rounded p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-accent ${
          isDown ? "bg-bg-muted text-danger" : "text-text-secondary hover:text-text-primary hover:bg-bg-muted"
        }`}
      >
        <ThumbsDown className="h-5 w-5" aria-hidden />
      </button>
    </div>
  );
}
