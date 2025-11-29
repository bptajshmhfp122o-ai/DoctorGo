import './Card.css';

/**
 * Card component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.variant='default'] - Card variant (default, elevated, outlined)
 * @param {boolean} [props.clickable=false] - Clickable card
 * @param {string} [props.className] - Additional CSS classes
 * @param {Function} [props.onClick] - Click handler
 */
export function Card({
  children,
  variant = 'default',
  clickable = false,
  className = '',
  onClick,
  ...props
}) {
  const Component = clickable ? 'button' : 'div';
  const classNames = [
    'card',
    `card--${variant}`,
    clickable && 'card--clickable',
    className
  ].filter(Boolean).join(' ');

  return (
    <Component
      className={classNames}
      onClick={clickable ? onClick : undefined}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Card Header component
 */
export function CardHeader({ children, className = '' }) {
  return (
    <div className={`card__header ${className}`}>
      {children}
    </div>
  );
}

/**
 * Card Body component
 */
export function CardBody({ children, className = '' }) {
  return (
    <div className={`card__body ${className}`}>
      {children}
    </div>
  );
}

/**
 * Card Footer component
 */
export function CardFooter({ children, className = '' }) {
  return (
    <div className={`card__footer ${className}`}>
      {children}
    </div>
  );
}
