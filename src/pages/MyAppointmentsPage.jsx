import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Card, CardBody } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Loading } from '../components/common/Loading';
import { EmptyState } from '../components/common/EmptyState';
import { useBookings } from '../context/BookingsContext';
import { useAuth } from '../context/AuthContext';
import './MyAppointmentsPage.css';

/**
 * My Appointments page
 */
export function MyAppointmentsPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { bookings, fetchBookings, loading } = useBookings();

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchBookings(user.id);
    }
  }, [isAuthenticated, user?.id, fetchBookings]);

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="appointments-page">
          <div className="appointments-page__container">
            <EmptyState
              title="Sign in to view appointments"
              description="Please sign in to view and manage your appointments."
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              }
              action={
                <Button onClick={() => navigate('/signin', { state: { from: '/my-appointments' } })}>
                  Sign In
                </Button>
              }
            />
          </div>
        </div>
      </Layout>
    );
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getPaymentVariant = (status) => {
    return status === 'paid' ? 'success' : 'warning';
  };

  return (
    <Layout>
      <div className="appointments-page">
        <div className="appointments-page__container">
          <div className="appointments-page__header">
            <h1 className="appointments-page__title">My Appointments</h1>
            <p className="appointments-page__subtitle">
              View and manage your upcoming and past appointments
            </p>
          </div>

          {loading && (
            <div className="appointments-page__loading">
              <Loading text="Loading appointments..." />
            </div>
          )}

          {!loading && bookings.length === 0 && (
            <EmptyState
              title="No appointments yet"
              description="You haven't booked any appointments. Find a healthcare provider to get started."
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              }
              action={
                <Link to="/">
                  <Button>Find Providers</Button>
                </Link>
              }
            />
          )}

          {!loading && bookings.length > 0 && (
            <div className="appointments-page__list">
              {bookings.map(booking => (
                <Card key={booking.bookingId} className="appointments-page__card">
                  <CardBody>
                    <div className="appointments-page__card-header">
                      <div className="appointments-page__booking-id">
                        <span className="appointments-page__label">Booking ID</span>
                        <code>{booking.bookingId}</code>
                      </div>
                      <div className="appointments-page__badges">
                        <Badge variant={getStatusVariant(booking.status)}>
                          {booking.status}
                        </Badge>
                        <Badge variant={getPaymentVariant(booking.paymentStatus)}>
                          {booking.paymentStatus}
                        </Badge>
                      </div>
                    </div>

                    <div className="appointments-page__card-body">
                      <div className="appointments-page__detail">
                        <span className="appointments-page__label">Provider</span>
                        <span>{booking.providerId}</span>
                      </div>
                      <div className="appointments-page__detail">
                        <span className="appointments-page__label">Booked On</span>
                        <span>{new Date(booking.timestamp).toLocaleString()}</span>
                      </div>
                      {booking.paymentToken && (
                        <div className="appointments-page__detail">
                          <span className="appointments-page__label">Payment Token</span>
                          <code>{booking.paymentToken}</code>
                        </div>
                      )}
                    </div>

                    <div className="appointments-page__card-actions">
                      <Link to={`/provider/${booking.providerId}`}>
                        <Button variant="outline" size="small">
                          View Provider
                        </Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
