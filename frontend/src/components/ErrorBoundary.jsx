import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full my-6 p-6 sm:p-8 rounded-3xl bg-white border border-rose-200 shadow-xl text-slate-800 animate-in fade-in duration-200">
          <div className="flex items-center gap-3 pb-4 border-b border-rose-100">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                View Encountered a Temporary Error
              </h3>
              <p className="text-xs text-slate-500">
                The session has been preserved safely.
              </p>
            </div>
          </div>

          <div className="my-4 p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-rose-700 overflow-x-auto">
            {this.state.error?.message || 'Unknown render exception occurred.'}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={this.handleReset}
              className="px-5 py-2 rounded-full bg-[#0052ff] hover:bg-[#003ecc] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset & Reload View</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
