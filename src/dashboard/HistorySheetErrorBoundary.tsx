import { Component, type ReactNode } from "react";

interface HistorySheetErrorBoundaryProps {
  children: ReactNode;
  onRetry: () => void;
}

interface HistorySheetErrorBoundaryState {
  hasError: boolean;
}

export class HistorySheetErrorBoundary extends Component<
  HistorySheetErrorBoundaryProps,
  HistorySheetErrorBoundaryState
> {
  state: HistorySheetErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): HistorySheetErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex flex-col gap-3 p-4 text-sm text-text-primary"
          role="alert"
        >
          <p>Couldn&apos;t load history.</p>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false });
              this.props.onRetry();
            }}
            className="self-start rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground hover:opacity-90"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
