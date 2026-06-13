import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props { children: ReactNode }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State { return { error }; }

  componentDidCatch(_error: Error, _info: ErrorInfo) {}

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-canvas p-8 text-center font-body">
          <div>
            <p className="text-[1.1rem] font-semibold text-error">Something went wrong</p>
            <p className="mt-2 text-[0.875rem] text-soft">Refresh the page to try again.</p>
            <button
              type="button"
              aria-label="Reload page"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-[5px] bg-accent px-6 py-3 text-[0.875rem] font-semibold text-black transition hover:bg-accent-hover"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
