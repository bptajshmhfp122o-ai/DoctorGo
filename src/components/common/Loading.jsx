import './Loading.css';

/**
 * Loading spinner component
 * @param {Object} props - Component props
 * @param {string} [props.size='medium'] - Spinner size
 * @param {string} [props.text] - Loading text
 * @param {boolean} [props.fullScreen=false] - Full screen loading
 */
export function Loading({ size = 'medium', text, fullScreen = false }) {
  const classNames = [
    'loading',
    `loading--${size}`,
    fullScreen && 'loading--fullscreen'
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames} role="status" aria-live="polite">
      <div className="loading__spinner" />
      {text && <p className="loading__text">{text}</p>}
      <span className="sr-only">{text || 'Loading...'}</span>
    </div>
  );
}

/**
 * Skeleton loader component
 * @param {Object} props - Component props
 * @param {string} [props.variant='text'] - Skeleton variant (text, circle, rectangle)
 * @param {string} [props.width] - Custom width
 * @param {string} [props.height] - Custom height
 */
export function Skeleton({ variant = 'text', width, height, className = '' }) {
  const classNames = [
    'skeleton',
    `skeleton--${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classNames}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}
