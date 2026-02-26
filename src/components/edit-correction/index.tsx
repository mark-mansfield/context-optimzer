import { useState } from "react";

export interface EditCorrectionProps {
  traceId: string;
  initialResponse: string;
  onSubmit: (traceId: string, correctedText: string) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export function EditCorrection({
  traceId,
  initialResponse,
  onSubmit,
  loading: controlledLoading = false,
  error: controlledError = null,
}: EditCorrectionProps) {
  const [text, setText] = useState(initialResponse);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const loading = controlledLoading || localLoading;
  const error = controlledError ?? localError;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);
    setLocalLoading(true);
    try {
      await onSubmit(traceId, text);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Failed to submit correction");
    } finally {
      setLocalLoading(false);
    }
  }

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

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 rounded-md border border-border bg-bg-surface p-3"
      aria-label={`Edit correction for trace ${traceId}`}
    >
      <label htmlFor="edit-correction-textarea" className="text-sm font-medium text-text-primary">
        Edit correction
      </label>
      <textarea
        id="edit-correction-textarea"
        aria-label="Corrected response or note"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
        rows={4}
        placeholder="Provide a corrected response or note..."
        className="w-full rounded border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={loading}
        className="self-end rounded bg-accent px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-60"
      >
        {loading ? "Submitting…" : "Save Correction"}
      </button>
      {loading && (
        <div role="status" aria-label="Submitting correction" className="sr-only">
          Submitting…
        </div>
      )}
    </form>
  );
}
