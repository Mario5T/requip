import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorDisplay({ message = 'Something went wrong', onRetry }: ErrorDisplayProps) {
  return (
    <div className="empty-state">
      <AlertTriangle className="empty-state__icon" />
      <h3 className="empty-state__title">Error</h3>
      <p className="empty-state__text">{message}</p>
      {onRetry && (
        <button className="btn btn--secondary" onClick={onRetry} style={{ marginTop: '16px' }}>
          <RefreshCw size={16} />
          Try Again
        </button>
      )}
    </div>
  );
}
