/**
 * Mock Service Layer for DoctorGo
 * Simulates API responses with configurable latency
 * Replace with real API calls in Phase 2 by swapping this with apiClient.js
 */

import providersData from '../mocks/providers.json';
import bookingsData from '../mocks/bookings.json';
import paymentsData from '../mocks/payments.json';
import usersData from '../mocks/users.json';
import symptomProfiles from '../mocks/symptomProfiles.json';

/** Minimum simulated network latency in ms */
const MIN_LATENCY = 200;
/** Maximum simulated network latency in ms */
const MAX_LATENCY = 800;

/** In-memory state for mutable operations */
let providers = [...providersData];
let bookings = [...bookingsData];
let payments = [...paymentsData];
let users = [...usersData];
let queueTokens = new Map();

/**
 * Simulates network latency
 * @returns {Promise<void>}
 */
const simulateLatency = () => {
  const delay = Math.random() * (MAX_LATENCY - MIN_LATENCY) + MIN_LATENCY;
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Generates a unique ID with prefix
 * @param {string} prefix - ID prefix
 * @returns {string}
 */
const generateId = (prefix) => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Search and filter providers
 * @param {Object} params - Search parameters
 * @param {string} [params.location] - Location string or coordinates
 * @param {string} [params.specialty] - Specialty filter
 * @param {string} [params.q] - Search query
 * @param {string} [params.sort] - Sort field (rating, cost, queue)
 * @returns {Promise<Array>}
 */
export const getProviders = async ({ location, specialty, q, sort } = {}) => {
  await simulateLatency();
  
  let results = [...providers];
  
  if (specialty && specialty !== 'all') {
    results = results.filter(p => 
      p.specialty.toLowerCase() === specialty.toLowerCase()
    );
  }
  
  if (q) {
    const query = q.toLowerCase();
    results = results.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.specialty.toLowerCase().includes(query) ||
      p.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }
  
  if (sort) {
    switch (sort) {
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'cost':
        results.sort((a, b) => a.estimatedCost - b.estimatedCost);
        break;
      case 'queue':
        results.sort((a, b) => a.queueLength - b.queueLength);
        break;
      case 'name':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
  }
  
  return results;
};

/**
 * Get provider by ID
 * @param {string} id - Provider ID
 * @returns {Promise<Object|null>}
 */
export const getProviderById = async (id) => {
  await simulateLatency();
  return providers.find(p => p.id === id) || null;
};

/**
 * Create a booking
 * @param {Object} data - Booking data
 * @param {string} data.providerId - Provider ID
 * @param {string} data.slotId - Slot ID
 * @param {string} data.userId - User ID
 * @param {string} [data.paymentToken] - Payment token if pre-paid
 * @returns {Promise<Object>}
 */
export const createBooking = async ({ providerId, slotId, userId, paymentToken }) => {
  await simulateLatency();
  
  const booking = {
    bookingId: generateId('BK'),
    providerId,
    slotId,
    userId,
    timestamp: new Date().toISOString(),
    status: paymentToken ? 'confirmed' : 'pending',
    paymentStatus: paymentToken ? 'paid' : 'unpaid',
    paymentToken: paymentToken || null
  };
  
  bookings.push(booking);
  
  // Update slot availability
  const provider = providers.find(p => p.id === providerId);
  if (provider) {
    const slot = provider.availabilitySlots.find(s => s.id === slotId);
    if (slot) {
      slot.available = false;
    }
  }
  
  return booking;
};

/**
 * Get user bookings
 * @param {string} userId - User ID
 * @returns {Promise<Array>}
 */
export const getUserBookings = async (userId) => {
  await simulateLatency();
  return bookings.filter(b => b.userId === userId);
};

/**
 * Join virtual queue
 * @param {Object} data - Queue join data
 * @param {string} data.providerId - Provider ID
 * @param {string} data.userId - User ID
 * @returns {Promise<Object>}
 */
export const joinQueue = async ({ providerId, userId }) => {
  await simulateLatency();
  
  const provider = providers.find(p => p.id === providerId);
  const position = provider ? provider.queueLength + 1 : 1;
  const estimatedWait = position * 15; // 15 minutes per patient
  
  const token = generateId('QT');
  const queueEntry = {
    token,
    providerId,
    userId,
    position,
    estimatedWait,
    joinedAt: new Date().toISOString(),
    status: 'waiting'
  };
  
  queueTokens.set(token, queueEntry);
  
  // Increment queue length
  if (provider) {
    provider.queueLength += 1;
  }
  
  return {
    token,
    position,
    estimatedWait
  };
};

/**
 * Get queue status by token
 * @param {string} token - Queue token
 * @returns {Promise<Object|null>}
 */
export const getQueueStatus = async (token) => {
  await simulateLatency();
  
  const entry = queueTokens.get(token);
  if (!entry) return null;
  
  // Simulate position updates (randomly decrease position)
  if (entry.position > 1 && Math.random() > 0.7) {
    entry.position -= 1;
    entry.estimatedWait = entry.position * 15;
  }
  
  return {
    token: entry.token,
    position: entry.position,
    eta: entry.estimatedWait,
    status: entry.status,
    updatedAt: new Date().toISOString()
  };
};

/**
 * Process sandbox payment
 * @param {Object} data - Payment data
 * @param {string} data.bookingId - Booking ID
 * @param {number} data.amount - Payment amount
 * @returns {Promise<Object>}
 */
export const processSandboxPayment = async ({ bookingId, amount }) => {
  await simulateLatency();
  
  const paymentToken = generateId('PAY-SANDBOX');
  const payment = {
    paymentToken,
    bookingId,
    amount,
    currency: 'USD',
    paidAt: new Date().toISOString(),
    status: 'completed',
    eReceiptUrl: `/receipts/${paymentToken}.json`,
    cardLast4: '4242',
    cardBrand: 'Visa'
  };
  
  payments.push(payment);
  
  // Update booking status
  const booking = bookings.find(b => b.bookingId === bookingId);
  if (booking) {
    booking.paymentStatus = 'paid';
    booking.paymentToken = paymentToken;
    booking.status = 'confirmed';
  }
  
  return payment;
};

/**
 * Get symptom-based provider recommendations
 * @param {Object} data - Symptom data
 * @param {string} data.symptomsText - Free-text symptom description
 * @returns {Promise<Array>}
 */
export const getRecommendations = async ({ symptomsText }) => {
  await simulateLatency();
  
  const text = symptomsText.toLowerCase();
  const specialtyScores = {};
  
  // Simple keyword matching for symptom analysis
  Object.entries(symptomProfiles.symptomKeywords).forEach(([keyword, specialties]) => {
    if (text.includes(keyword)) {
      specialties.forEach((specialty, index) => {
        const score = (specialties.length - index) / specialties.length;
        specialtyScores[specialty] = (specialtyScores[specialty] || 0) + score;
      });
    }
  });
  
  // Sort specialties by score
  const rankedSpecialties = Object.entries(specialtyScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([specialty]) => specialty);
  
  // If no matches, default to General Practice
  if (rankedSpecialties.length === 0) {
    rankedSpecialties.push('General Practice');
  }
  
  // Find providers matching top specialties
  const recommendations = rankedSpecialties.map((specialty, index) => {
    const matchingProviders = providers.filter(p => p.specialty === specialty);
    const provider = matchingProviders[0];
    
    if (!provider) return null;
    
    return {
      providerId: provider.id,
      providerName: provider.name,
      specialty: provider.specialty,
      rating: provider.rating,
      confidence: Math.max(0.95 - (index * 0.15), 0.5),
      rationale: symptomProfiles.explanations[specialty] || 
        `${specialty} specialists can help with your described symptoms`
    };
  }).filter(Boolean);
  
  return recommendations;
};

/**
 * Authenticate user (mock)
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object|null>}
 */
export const authenticateUser = async (email, password) => {
  await simulateLatency();
  
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return null;
  
  const { password: _, ...safeUser } = user;
  return {
    user: safeUser,
    token: generateId('AUTH')
  };
};

/**
 * Register new user (mock)
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>}
 */
export const registerUser = async (userData) => {
  await simulateLatency();
  
  const newUser = {
    id: generateId('user'),
    ...userData,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  
  const { password: _, ...safeUser } = newUser;
  return {
    user: safeUser,
    token: generateId('AUTH')
  };
};

/**
 * Update user profile (mock)
 * @param {string} userId - User ID
 * @param {Object} updates - Profile updates
 * @returns {Promise<Object>}
 */
export const updateUserProfile = async (userId, updates) => {
  await simulateLatency();
  
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) throw new Error('User not found');
  
  users[userIndex] = { ...users[userIndex], ...updates };
  
  const { password: _, ...safeUser } = users[userIndex];
  return safeUser;
};

// Provider Management Functions

/**
 * Invite next patient in queue
 * @param {string} providerId - Provider ID
 * @returns {Promise<Object>}
 */
export const inviteNextPatient = async (providerId) => {
  await simulateLatency();
  
  const provider = providers.find(p => p.id === providerId);
  if (!provider) throw new Error('Provider not found');
  
  // Find the first waiting patient in queue
  const waitingTokens = Array.from(queueTokens.values())
    .filter(q => q.providerId === providerId && q.status === 'waiting')
    .sort((a, b) => a.position - b.position);
  
  if (waitingTokens.length === 0) {
    return { message: 'No patients in queue', invited: null };
  }
  
  const nextPatient = waitingTokens[0];
  nextPatient.status = 'invited';
  
  // Update positions for remaining patients
  waitingTokens.slice(1).forEach(q => {
    q.position -= 1;
    q.estimatedWait = q.position * 15;
  });
  
  provider.queueLength = Math.max(0, provider.queueLength - 1);
  
  return {
    message: 'Patient invited',
    invited: {
      token: nextPatient.token,
      userId: nextPatient.userId
    }
  };
};

/**
 * Postpone patient in queue
 * @param {string} token - Queue token
 * @returns {Promise<Object>}
 */
export const postponePatient = async (token) => {
  await simulateLatency();
  
  const entry = queueTokens.get(token);
  if (!entry) throw new Error('Queue entry not found');
  
  // Move to end of queue
  const queueForProvider = Array.from(queueTokens.values())
    .filter(q => q.providerId === entry.providerId && q.status === 'waiting');
  
  entry.position = queueForProvider.length;
  entry.estimatedWait = entry.position * 15;
  
  return {
    message: 'Patient postponed',
    newPosition: entry.position
  };
};

/**
 * Cancel queue entry
 * @param {string} token - Queue token
 * @returns {Promise<Object>}
 */
export const cancelQueueEntry = async (token) => {
  await simulateLatency();
  
  const entry = queueTokens.get(token);
  if (!entry) throw new Error('Queue entry not found');
  
  const provider = providers.find(p => p.id === entry.providerId);
  if (provider) {
    provider.queueLength = Math.max(0, provider.queueLength - 1);
  }
  
  queueTokens.delete(token);
  
  return { message: 'Queue entry cancelled' };
};

/**
 * Update provider availability
 * @param {string} providerId - Provider ID
 * @param {Array} slots - New availability slots
 * @returns {Promise<Object>}
 */
export const updateProviderAvailability = async (providerId, slots) => {
  await simulateLatency();
  
  const provider = providers.find(p => p.id === providerId);
  if (!provider) throw new Error('Provider not found');
  
  provider.availabilitySlots = slots.map(slot => ({
    id: slot.id || generateId('slot'),
    date: slot.date,
    time: slot.time,
    available: slot.available !== false
  }));
  
  return {
    message: 'Availability updated',
    slots: provider.availabilitySlots
  };
};

/**
 * Get provider queue
 * @param {string} providerId - Provider ID
 * @returns {Promise<Array>}
 */
export const getProviderQueue = async (providerId) => {
  await simulateLatency();
  
  return Array.from(queueTokens.values())
    .filter(q => q.providerId === providerId)
    .sort((a, b) => a.position - b.position);
};

/**
 * Reset mock data (for testing)
 */
export const resetMockData = () => {
  providers = [...providersData];
  bookings = [...bookingsData];
  payments = [...paymentsData];
  users = [...usersData];
  queueTokens = new Map();
};
