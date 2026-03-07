import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface QueryRunRowProps {
  value: string;
  onValueChange: (value: string) => void;
  onRun: () => void;
  loading: boolean;
  showHistoryButton: boolean;
  onOpenHistory: () => void;
  onPrefetchHistory: () => void;
}

export function QueryRunRow({
  value,
  onValueChange,
  onRun,
  loading,
  showHistoryButton,
  onOpenHistory,
  onPrefetchHistory,
}: QueryRunRowProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold">Run a new query</h2>
        <p className="text-sm text-text-muted">
          Enter a query to run the pipeline and inspect retrieval, reranking,
          and response.
        </p>
      </div>
      <label htmlFor="dashboard-query-input" className="sr-only">
        Query input
      </label>
      <div className="flex gap-2 items-center">
        <Input
          id="dashboard-query-input"
          type="text"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onRun()}
          placeholder="Enter a query..."
          className="min-w-0 flex-1 w-full  p-2"
          aria-label="Query input"
        />

        <Button
          type="button"
          onClick={onRun}
          disabled={loading || !value.trim()}
          variant="outline"
          className="sm:shrink-0"
        >
          {loading ? "…" : "Run"}
        </Button>
        {showHistoryButton && (
          <button
            type="button"
            onClick={onOpenHistory}
            onMouseEnter={onPrefetchHistory}
            onFocus={onPrefetchHistory}
            aria-label="Show trace history"
            className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md bg-bg-muted p-2 text-text-primary transition-colors hover:opacity-80"
          >
            <History className="size-5" aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}
