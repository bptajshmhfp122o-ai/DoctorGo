import './Badge.css';

/**
 * Badge component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Badge content
 * @param {string} [props.variant='default'] - Badge variant
 * @param {string} [props.size='medium'] - Badge size
 * @param {string} [props.className] - Additional CSS classes
 */
export function Badge({
  children,
  variant = 'default',
  size = 'medium',
  className = ''
}) {
  const classNames = [
    'badge',
    `badge--${variant}`,
    `badge--${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classNames}>
      {children}
    </span>
  );
}
