import './Rating.css';

/**
 * Rating display component
 * @param {Object} props - Component props
 * @param {number} props.value - Rating value (0-5)
 * @param {number} [props.count] - Review count
 * @param {string} [props.size='medium'] - Rating size
 * @param {boolean} [props.showValue=true] - Show numeric value
 */
export function Rating({ value, count, size = 'medium', showValue = true }) {
  const stars = [];
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push('full');
    } else if (i === fullStars && hasHalfStar) {
      stars.push('half');
    } else {
      stars.push('empty');
    }
  }

  return (
    <div className={`rating rating--${size}`} aria-label={`Rating: ${value} out of 5 stars`}>
      <div className="rating__stars" aria-hidden="true">
        {stars.map((type, index) => (
          <span key={index} className={`rating__star rating__star--${type}`}>
            {type === 'half' ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <defs>
                  <linearGradient id={`half-${index}`}>
                    <stop offset="50%" stopColor="currentColor" />
                    <stop offset="50%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                <path
                  fill={`url(#half-${index})`}
                  stroke="currentColor"
                  strokeWidth="1"
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill={type === 'full' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            )}
          </span>
        ))}
      </div>
      {showValue && <span className="rating__value">{value.toFixed(1)}</span>}
      {count !== undefined && (
        <span className="rating__count">({count} reviews)</span>
      )}
    </div>
  );
}
