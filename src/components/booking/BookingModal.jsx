import { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import './BookingModal.css';

/**
 * Booking modal component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Modal open state
 * @param {Function} props.onClose - Close handler
 * @param {Object} props.provider - Provider data
 * @param {Object} props.slot - Selected slot
 * @param {Function} props.onConfirm - Confirm booking handler
 * @param {boolean} [props.loading=false] - Loading state
 */
export function BookingModal({ isOpen, onClose, provider, slot, onConfirm, loading = false }) {
  const [agreed, setAgreed] = useState(false);

  if (!provider || !slot) return null;

  const handleConfirm = () => {
    if (agreed) {
      onConfirm();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Appointment" size="medium">
      <div className="booking-modal">
        <div className="booking-modal__summary">
          <div className="booking-modal__provider">
            <div className="booking-modal__avatar">
              {provider.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="booking-modal__provider-info">
              <h3 className="booking-modal__provider-name">{provider.name}</h3>
              <p className="booking-modal__provider-specialty">{provider.specialty}</p>
            </div>
          </div>

          <div className="booking-modal__details">
            <div className="booking-modal__detail">
              <span className="booking-modal__detail-label">Date</span>
              <span className="booking-modal__detail-value">{slot.date}</span>
            </div>
            <div className="booking-modal__detail">
              <span className="booking-modal__detail-label">Time</span>
              <span className="booking-modal__detail-value">{slot.time}</span>
            </div>
            <div className="booking-modal__detail">
              <span className="booking-modal__detail-label">Location</span>
              <span className="booking-modal__detail-value">{provider.address}</span>
            </div>
            <div className="booking-modal__detail">
              <span className="booking-modal__detail-label">Estimated Cost</span>
              <span className="booking-modal__detail-value booking-modal__detail-value--cost">
                ${provider.estimatedCost}
              </span>
            </div>
          </div>
        </div>

        {provider.policies?.cancellation && (
          <div className="booking-modal__policy">
            <Badge variant="info" size="small">Policy</Badge>
            <p>{provider.policies.cancellation}</p>
          </div>
        )}

        <div className="booking-modal__agreement">
          <label className="booking-modal__checkbox">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span className="booking-modal__checkbox-mark" />
            <span className="booking-modal__checkbox-text">
              I understand the cancellation policy and agree to the terms of service
            </span>
          </label>
        </div>

        <div className="booking-modal__actions">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!agreed || loading}
            loading={loading}
          >
            Confirm Booking
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/**
 * Booking confirmation component
 * @param {Object} props - Component props
 * @param {Object} props.booking - Booking data
 * @param {Object} props.provider - Provider data
 * @param {Function} props.onPayNow - Pay now handler
 * @param {Function} props.onClose - Close handler
 */
export function BookingConfirmation({ booking, provider, onPayNow, onClose }) {
  return (
    <div className="booking-confirmation">
      <div className="booking-confirmation__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <polyline points="22,4 12,14.01 9,11.01" />
        </svg>
      </div>
      
      <h2 className="booking-confirmation__title">Booking Confirmed!</h2>
      <p className="booking-confirmation__message">
        Your appointment has been successfully scheduled.
      </p>

      <div className="booking-confirmation__details">
        <div className="booking-confirmation__detail">
          <span className="booking-confirmation__label">Booking ID</span>
          <span className="booking-confirmation__value">{booking.bookingId}</span>
        </div>
        <div className="booking-confirmation__detail">
          <span className="booking-confirmation__label">Status</span>
          <Badge variant={booking.status === 'confirmed' ? 'success' : 'warning'}>
            {booking.status}
          </Badge>
        </div>
        <div className="booking-confirmation__detail">
          <span className="booking-confirmation__label">Booked At</span>
          <span className="booking-confirmation__value">
            {new Date(booking.timestamp).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="booking-confirmation__actions">
        {booking.paymentStatus !== 'paid' && (
          <Button onClick={onPayNow}>
            Pay Now (${provider.estimatedCost})
          </Button>
        )}
        <Button variant="outline" onClick={onClose}>
          {booking.paymentStatus === 'paid' ? 'Done' : 'Pay Later'}
        </Button>
      </div>
    </div>
  );
}
