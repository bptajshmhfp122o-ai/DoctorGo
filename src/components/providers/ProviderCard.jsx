import { Link } from 'react-router-dom';
import { Card, CardBody } from '../common/Card';
import { Badge } from '../common/Badge';
import { Rating } from '../common/Rating';
import './ProviderCard.css';

/**
 * Provider card component for list display
 * @param {Object} props - Component props
 * @param {Object} props.provider - Provider data
 * @param {boolean} [props.selected=false] - Selected state
 * @param {Function} [props.onSelect] - Selection handler
 */
export function ProviderCard({ provider, selected = false, onSelect }) {
  const {
    id,
    name,
    specialty,
    rating,
    reviewCount,
    estimatedCost,
    queueLength,
    address,
    tags,
    availabilitySlots
  } = provider;

  const availableSlots = availabilitySlots?.filter(s => s.available) || [];
  const nextAvailable = availableSlots[0];

  return (
    <Card
      className={`provider-card ${selected ? 'provider-card--selected' : ''}`}
      variant="default"
    >
      <CardBody className="provider-card__body">
        <div className="provider-card__header">
          <div className="provider-card__avatar">
            {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="provider-card__info">
            <Link to={`/provider/${id}`} className="provider-card__name">
              {name}
            </Link>
            <p className="provider-card__specialty">{specialty}</p>
          </div>
        </div>

        <div className="provider-card__rating">
          <Rating value={rating} count={reviewCount} size="small" />
        </div>

        <div className="provider-card__details">
          <div className="provider-card__detail">
            <svg className="provider-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
            <span>${estimatedCost} est. cost</span>
          </div>
          <div className="provider-card__detail">
            <svg className="provider-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
            <span>{queueLength} in queue</span>
          </div>
          <div className="provider-card__detail provider-card__detail--address">
            <svg className="provider-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{address}</span>
          </div>
        </div>

        {tags && tags.length > 0 && (
          <div className="provider-card__tags">
            {tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="default" size="small">
                {tag.replace(/-/g, ' ')}
              </Badge>
            ))}
          </div>
        )}

        <div className="provider-card__footer">
          {nextAvailable ? (
            <p className="provider-card__availability">
              <span className="provider-card__availability-label">Next available:</span>
              <span className="provider-card__availability-value">
                {nextAvailable.date} at {nextAvailable.time}
              </span>
            </p>
          ) : (
            <p className="provider-card__availability provider-card__availability--none">
              No slots available
            </p>
          )}
          <div className="provider-card__actions">
            {onSelect && (
              <button
                className="provider-card__select-btn"
                onClick={() => onSelect(provider)}
                aria-label={`View ${name} on map`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </button>
            )}
            <Link to={`/provider/${id}`} className="provider-card__view-btn">
              View Profile
            </Link>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
