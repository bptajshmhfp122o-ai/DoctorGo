import './EmptyState.css';

/**
 * Empty state component
 * @param {Object} props - Component props
 * @param {string} props.title - Empty state title
 * @param {string} [props.description] - Description text
 * @param {React.ReactNode} [props.icon] - Icon element
 * @param {React.ReactNode} [props.action] - Action button/link
 */
export function EmptyState({ title, description, icon, action }) {
  return (
    <div className="empty-state" role="status">
      {icon && <div className="empty-state__icon">{icon}</div>}
      <h3 className="empty-state__title">{title}</h3>
      {description && <p className="empty-state__description">{description}</p>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}

/**
 * Error state component
 * @param {Object} props - Component props
 * @param {string} [props.title='Something went wrong'] - Error title
 * @param {string} [props.message] - Error message
 * @param {Function} [props.onRetry] - Retry handler
 */
export function ErrorState({ 
  title = 'Something went wrong', 
  message,
  onRetry 
}) {
  return (
    <div className="error-state" role="alert">
      <div className="error-state__icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3 className="error-state__title">{title}</h3>
      {message && <p className="error-state__message">{message}</p>}
      {onRetry && (
        <button className="error-state__retry" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
