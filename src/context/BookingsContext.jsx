import { createContext, useContext, useState, useCallback } from 'react';
import { 
  createBooking, 
  getUserBookings, 
  processSandboxPayment,
  joinQueue,
  getQueueStatus 
} from '../api/mockService';

/**
 * Bookings Context
 * Manages bookings, payments, and queue state
 */
const BookingsContext = createContext(null);

/**
 * BookingsProvider component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function BookingsProvider({ children }) {
  const [bookings, setBookings] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [queueEntry, setQueueEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Create a new booking
   * @param {Object} data - Booking data
   */
  const book = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      const booking = await createBooking(data);
      setCurrentBooking(booking);
      setBookings(prev => [...prev, booking]);
      return booking;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch user's bookings
   * @param {string} userId - User ID
   */
  const fetchBookings = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    
    try {
      const userBookings = await getUserBookings(userId);
      setBookings(userBookings);
      return userBookings;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Process payment for a booking
   * @param {string} bookingId - Booking ID
   * @param {number} amount - Payment amount
   */
  const pay = useCallback(async (bookingId, amount) => {
    setLoading(true);
    setError(null);
    
    try {
      const payment = await processSandboxPayment({ bookingId, amount });
      setCurrentPayment(payment);
      
      // Update booking status
      setBookings(prev => prev.map(b => 
        b.bookingId === bookingId 
          ? { ...b, paymentStatus: 'paid', status: 'confirmed', paymentToken: payment.paymentToken }
          : b
      ));
      
      if (currentBooking?.bookingId === bookingId) {
        setCurrentBooking(prev => ({
          ...prev,
          paymentStatus: 'paid',
          status: 'confirmed',
          paymentToken: payment.paymentToken
        }));
      }
      
      return payment;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentBooking]);

  /**
   * Join a provider's queue
   * @param {string} providerId - Provider ID
   * @param {string} userId - User ID
   */
  const joinProviderQueue = useCallback(async (providerId, userId) => {
    setLoading(true);
    setError(null);
    
    try {
      const entry = await joinQueue({ providerId, userId });
      setQueueEntry({
        ...entry,
        providerId,
        userId,
        status: 'waiting'
      });
      return entry;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh queue status
   */
  const refreshQueueStatus = useCallback(async () => {
    if (!queueEntry?.token) return null;
    
    try {
      const status = await getQueueStatus(queueEntry.token);
      if (status) {
        setQueueEntry(prev => ({
          ...prev,
          ...status
        }));
      }
      return status;
    } catch (err) {
      console.error('Failed to refresh queue status:', err);
      return null;
    }
  }, [queueEntry?.token]);

  /**
   * Leave the current queue
   */
  const leaveQueue = useCallback(() => {
    setQueueEntry(null);
  }, []);

  /**
   * Clear current booking
   */
  const clearCurrentBooking = useCallback(() => {
    setCurrentBooking(null);
    setCurrentPayment(null);
  }, []);

  const value = {
    bookings,
    currentBooking,
    currentPayment,
    queueEntry,
    loading,
    error,
    book,
    fetchBookings,
    pay,
    joinProviderQueue,
    refreshQueueStatus,
    leaveQueue,
    clearCurrentBooking
  };

  return (
    <BookingsContext.Provider value={value}>
      {children}
    </BookingsContext.Provider>
  );
}

/**
 * Hook to access bookings context
 * @returns {Object} Bookings context value
 */
export function useBookings() {
  const context = useContext(BookingsContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingsProvider');
  }
  return context;
}
