import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Rating } from '../components/common/Rating';
import { Loading } from '../components/common/Loading';
import { ErrorState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import { BookingModal, BookingConfirmation } from '../components/booking/BookingModal';
import { QueueDisplay } from '../components/queue/QueueDisplay';
import { PaymentForm, PaymentReceipt } from '../components/payment/PaymentForm';
import { useProviders } from '../context/ProvidersContext';
import { useBookings } from '../context/BookingsContext';
import { useAuth } from '../context/AuthContext';
import './ProviderPage.css';

/**
 * Provider detail page with booking and queue functionality
 */
export function ProviderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedProvider: provider, loading, error, fetchProvider } = useProviders();
  const { 
    currentBooking, 
    currentPayment,
    queueEntry, 
    book, 
    pay, 
    joinProviderQueue, 
    refreshQueueStatus,
    leaveQueue,
    clearCurrentBooking,
    loading: bookingLoading 
  } = useBookings();
  const { user, isAuthenticated } = useAuth();

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProvider(id);
    }
  }, [id, fetchProvider]);

  // Check for existing queue entry
  useEffect(() => {
    if (queueEntry && queueEntry.providerId === id) {
      setShowQueue(true);
    }
  }, [queueEntry, id]);

  const handleSlotSelect = (slot) => {
    if (!slot.available) return;
    setSelectedSlot(slot);
  };

  const handleBookAppointment = () => {
    if (!isAuthenticated) {
      navigate('/signin', { state: { from: `/provider/${id}` } });
      return;
    }
    if (selectedSlot) {
      setShowBookingModal(true);
    }
  };

  const handleConfirmBooking = async () => {
    try {
      await book({
        providerId: id,
        slotId: selectedSlot.id,
        userId: user?.id || 'guest-user'
      });
      setShowBookingModal(false);
      setShowConfirmation(true);
    } catch (err) {
      console.error('Booking failed:', err);
    }
  };

  const handlePayNow = () => {
    setShowConfirmation(false);
    setShowPayment(true);
  };

  const handleProcessPayment = async () => {
    if (!currentBooking) return;
    try {
      await pay(currentBooking.bookingId, provider.estimatedCost);
      setShowPayment(false);
      setShowReceipt(true);
    } catch (err) {
      console.error('Payment failed:', err);
    }
  };

  const handleJoinQueue = async () => {
    if (!isAuthenticated) {
      navigate('/signin', { state: { from: `/provider/${id}` } });
      return;
    }
    try {
      await joinProviderQueue(id, user?.id || 'guest-user');
      setShowQueue(true);
    } catch (err) {
      console.error('Failed to join queue:', err);
    }
  };

  const handleCloseAll = () => {
    setShowBookingModal(false);
    setShowConfirmation(false);
    setShowPayment(false);
    setShowReceipt(false);
    setSelectedSlot(null);
    clearCurrentBooking();
  };

  if (loading) {
    return (
      <Layout>
        <div className="provider-page__loading">
          <Loading text="Loading provider details..." />
        </div>
      </Layout>
    );
  }

  if (error || !provider) {
    return (
      <Layout>
        <div className="provider-page__error">
          <ErrorState
            title="Provider not found"
            message={error || "The provider you're looking for doesn't exist."}
            onRetry={() => fetchProvider(id)}
          />
        </div>
      </Layout>
    );
  }

  const availableSlots = provider.availabilitySlots?.filter(s => s.available) || [];

  return (
    <Layout>
      <div className="provider-page">
        <div className="provider-page__header">
          <button className="provider-page__back" onClick={() => navigate(-1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to search
          </button>
        </div>

        <div className="provider-page__content">
          <div className="provider-page__main">
            {/* Provider Info */}
            <section className="provider-page__info">
              <div className="provider-page__avatar">
                {provider.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="provider-page__details">
                <h1 className="provider-page__name">{provider.name}</h1>
                <p className="provider-page__specialty">{provider.specialty}</p>
                <div className="provider-page__rating">
                  <Rating value={provider.rating} count={provider.reviewCount} size="medium" />
                </div>
                <div className="provider-page__tags">
                  {provider.tags?.map(tag => (
                    <Badge key={tag} variant="default" size="small">
                      {tag.replace(/-/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </section>

            {/* Bio */}
            <section className="provider-page__section">
              <h2 className="provider-page__section-title">About</h2>
              <p className="provider-page__bio">{provider.bio}</p>
              <div className="provider-page__meta">
                <div className="provider-page__meta-item">
                  <strong>Education:</strong> {provider.education}
                </div>
                <div className="provider-page__meta-item">
                  <strong>Languages:</strong> {provider.languages?.join(', ')}
                </div>
              </div>
            </section>

            {/* Services */}
            <section className="provider-page__section">
              <h2 className="provider-page__section-title">Services</h2>
              <ul className="provider-page__services">
                {provider.services?.map(service => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </section>

            {/* Insurance */}
            <section className="provider-page__section">
              <h2 className="provider-page__section-title">Accepted Insurance</h2>
              <div className="provider-page__insurance">
                {provider.insurance?.map(ins => (
                  <Badge key={ins} variant="primary" size="small">{ins}</Badge>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section className="provider-page__section">
              <h2 className="provider-page__section-title">Reviews</h2>
              <div className="provider-page__reviews">
                {provider.reviews?.map(review => (
                  <div key={review.id} className="provider-page__review">
                    <div className="provider-page__review-header">
                      <span className="provider-page__review-author">{review.author}</span>
                      <Rating value={review.rating} size="small" showValue={false} />
                      <span className="provider-page__review-date">{review.date}</span>
                    </div>
                    <p className="provider-page__review-text">{review.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="provider-page__sidebar">
            {/* Queue Status */}
            {showQueue && queueEntry ? (
              <QueueDisplay
                queueEntry={queueEntry}
                provider={provider}
                onRefresh={refreshQueueStatus}
                onLeave={() => {
                  leaveQueue();
                  setShowQueue(false);
                }}
              />
            ) : (
              <>
                {/* Quick Stats */}
                <div className="provider-page__stats">
                  <div className="provider-page__stat">
                    <span className="provider-page__stat-value">${provider.estimatedCost}</span>
                    <span className="provider-page__stat-label">Est. Cost</span>
                  </div>
                  <div className="provider-page__stat">
                    <span className="provider-page__stat-value">{provider.queueLength}</span>
                    <span className="provider-page__stat-label">In Queue</span>
                  </div>
                </div>

                {/* Contact */}
                <div className="provider-page__contact">
                  <div className="provider-page__contact-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{provider.address}</span>
                  </div>
                  <div className="provider-page__contact-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                    </svg>
                    <span>{provider.phone}</span>
                  </div>
                </div>

                {/* Join Queue */}
                <div className="provider-page__queue-action">
                  <Button 
                    variant="secondary" 
                    fullWidth 
                    onClick={handleJoinQueue}
                    loading={bookingLoading}
                  >
                    Join Virtual Queue
                  </Button>
                  <p className="provider-page__queue-info">
                    Estimated wait: ~{provider.queueLength * 15} minutes
                  </p>
                </div>

                {/* Availability */}
                <div className="provider-page__availability">
                  <h3 className="provider-page__availability-title">Available Appointments</h3>
                  {availableSlots.length === 0 ? (
                    <p className="provider-page__no-slots">No available slots at this time.</p>
                  ) : (
                    <div className="provider-page__slots">
                      {provider.availabilitySlots?.map(slot => (
                        <button
                          key={slot.id}
                          className={`provider-page__slot ${!slot.available ? 'provider-page__slot--unavailable' : ''} ${selectedSlot?.id === slot.id ? 'provider-page__slot--selected' : ''}`}
                          onClick={() => handleSlotSelect(slot)}
                          disabled={!slot.available}
                          aria-label={`${slot.date} at ${slot.time}${!slot.available ? ', unavailable' : ''}`}
                        >
                          <span className="provider-page__slot-date">{slot.date}</span>
                          <span className="provider-page__slot-time">{slot.time}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  <Button
                    fullWidth
                    disabled={!selectedSlot}
                    onClick={handleBookAppointment}
                    loading={bookingLoading}
                  >
                    Book Appointment
                  </Button>
                </div>

                {/* Policies */}
                {provider.policies && (
                  <div className="provider-page__policies">
                    <h3 className="provider-page__policies-title">Policies</h3>
                    {Object.entries(provider.policies).map(([key, value]) => (
                      <div key={key} className="provider-page__policy">
                        <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                        <p>{value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </aside>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        provider={provider}
        slot={selectedSlot}
        onConfirm={handleConfirmBooking}
        loading={bookingLoading}
      />

      {/* Confirmation Modal */}
      <Modal isOpen={showConfirmation} onClose={handleCloseAll} title="Booking Confirmed">
        {currentBooking && (
          <BookingConfirmation
            booking={currentBooking}
            provider={provider}
            onPayNow={handlePayNow}
            onClose={handleCloseAll}
          />
        )}
      </Modal>

      {/* Payment Modal */}
      <Modal isOpen={showPayment} onClose={() => setShowPayment(false)} title="Complete Payment">
        {currentBooking && (
          <PaymentForm
            amount={provider.estimatedCost}
            bookingId={currentBooking.bookingId}
            onPay={handleProcessPayment}
            onCancel={() => setShowPayment(false)}
            loading={bookingLoading}
          />
        )}
      </Modal>

      {/* Receipt Modal */}
      <Modal isOpen={showReceipt} onClose={handleCloseAll} title="Payment Receipt">
        {currentPayment && currentBooking && (
          <PaymentReceipt
            payment={currentPayment}
            booking={currentBooking}
            onDownload={() => {}}
            onClose={handleCloseAll}
          />
        )}
      </Modal>
    </Layout>
  );
}
