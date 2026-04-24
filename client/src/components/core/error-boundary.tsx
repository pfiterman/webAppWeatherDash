import { Component, type ReactNode } from "react";
import { CloudOff, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error);
    console.error("[ErrorBoundary] Component stack:", info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <div className="text-center space-y-6 max-w-md">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10">
              <CloudOff className="h-10 w-10 text-destructive" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                Something went wrong
              </h1>
              <p className="text-muted-foreground text-sm">
                An unexpected error occurred. Try refreshing the page or
                clicking below to recover.
              </p>
              {this.state.error && (
                <p className="text-xs text-destructive/70 bg-destructive/10 rounded-lg px-4 py-2 font-mono break-all">
                  {this.state.error.message}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Try again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground text-sm font-semibold hover:bg-muted transition-colors"
              >
                Reload page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
