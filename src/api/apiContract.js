/**
 * API Contract for DoctorGo
 * This file documents all endpoints that the backend team needs to implement in Phase 2.
 * The frontend uses mockService.js in Phase 1; swap to real HTTP client in Phase 2.
 */

/**
 * Base URL configuration
 * Set VITE_API_BASE_URL in .env for production
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Feature flags
 * Set VITE_USE_MOCKS=false to use real API
 */
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

/**
 * API Endpoints Contract
 * 
 * All endpoints return JSON responses.
 * Error responses follow format: { error: string, code: string, details?: object }
 */
export const ENDPOINTS = {
  /**
   * GET /api/providers
   * Search and filter healthcare providers
   * 
   * Query Parameters:
   * - location: string (lat,lng or address string)
   * - specialty: string (e.g., "Cardiology", "General Practice")
   * - q: string (search query for name/tags)
   * - sort: string (rating|cost|queue|name)
   * - page: number (default: 1)
   * - limit: number (default: 20)
   * 
   * Response 200:
   * {
   *   providers: [
   *     {
   *       id: string,
   *       name: string,
   *       specialty: string,
   *       rating: number,
   *       reviewCount: number,
   *       estimatedCost: number,
   *       queueLength: number,
   *       coordinates: { lat: number, lng: number },
   *       address: string,
   *       availabilitySlots: [{ id: string, date: string, time: string, available: boolean }],
   *       tags: string[]
   *     }
   *   ],
   *   total: number,
   *   page: number,
   *   totalPages: number
   * }
   */
  PROVIDERS: '/providers',

  /**
   * GET /api/providers/:id
   * Get detailed provider information
   * 
   * Response 200:
   * {
   *   id: string,
   *   name: string,
   *   specialty: string,
   *   rating: number,
   *   reviewCount: number,
   *   estimatedCost: number,
   *   queueLength: number,
   *   coordinates: { lat: number, lng: number },
   *   address: string,
   *   phone: string,
   *   availabilitySlots: [{ id: string, date: string, time: string, available: boolean }],
   *   tags: string[],
   *   services: string[],
   *   bio: string,
   *   education: string,
   *   languages: string[],
   *   insurance: string[],
   *   policies: { cancellation: string, lateArrival?: string, ... },
   *   reviews: [{ id: string, author: string, rating: number, text: string, date: string }]
   * }
   * 
   * Response 404:
   * { error: "Provider not found", code: "PROVIDER_NOT_FOUND" }
   */
  PROVIDER_DETAIL: '/providers/:id',

  /**
   * POST /api/bookings
   * Create a new appointment booking
   * 
   * Request Body:
   * {
   *   providerId: string,
   *   slotId: string,
   *   userId: string,
   *   paymentToken?: string (optional, if pre-paid)
   * }
   * 
   * Response 201:
   * {
   *   bookingId: string,
   *   providerId: string,
   *   slotId: string,
   *   timestamp: string (ISO 8601),
   *   status: "pending" | "confirmed",
   *   paymentStatus: "unpaid" | "paid"
   * }
   * 
   * Response 400:
   * { error: "Slot not available", code: "SLOT_UNAVAILABLE" }
   */
  BOOKINGS: '/bookings',

  /**
   * GET /api/bookings/user/:userId
   * Get user's bookings
   * 
   * Response 200:
   * {
   *   bookings: [{ bookingId, providerId, slotId, timestamp, status, paymentStatus }]
   * }
   */
  USER_BOOKINGS: '/bookings/user/:userId',

  /**
   * POST /api/queue/join
   * Join a provider's virtual queue
   * 
   * Request Body:
   * {
   *   providerId: string,
   *   userId: string
   * }
   * 
   * Response 201:
   * {
   *   token: string,
   *   position: number,
   *   estimatedWait: number (minutes)
   * }
   */
  QUEUE_JOIN: '/queue/join',

  /**
   * GET /api/queue/:token/status
   * Get current queue position
   * 
   * Response 200:
   * {
   *   token: string,
   *   position: number,
   *   eta: number (minutes),
   *   status: "waiting" | "invited" | "completed" | "cancelled",
   *   updatedAt: string (ISO 8601)
   * }
   * 
   * Response 404:
   * { error: "Queue entry not found", code: "QUEUE_NOT_FOUND" }
   */
  QUEUE_STATUS: '/queue/:token/status',

  /**
   * POST /api/payments/sandbox
   * Process sandbox payment
   * 
   * Request Body:
   * {
   *   bookingId: string,
   *   amount: number
   * }
   * 
   * Response 200:
   * {
   *   paymentToken: string,
   *   paidAt: string (ISO 8601),
   *   eReceiptUrl: string,
   *   status: "completed"
   * }
   */
  PAYMENTS_SANDBOX: '/payments/sandbox',

  /**
   * POST /api/recommend
   * Get provider recommendations based on symptoms
   * 
   * Request Body:
   * {
   *   symptomsText: string
   * }
   * 
   * Response 200:
   * {
   *   recommendations: [
   *     {
   *       providerId: string,
   *       providerName: string,
   *       specialty: string,
   *       rating: number,
   *       confidence: number (0-1),
   *       rationale: string
   *     }
   *   ]
   * }
   */
  RECOMMEND: '/recommend',

  /**
   * POST /api/auth/login
   * Authenticate user
   * 
   * Request Body:
   * { email: string, password: string }
   * 
   * Response 200:
   * { user: { id, email, firstName, lastName, ... }, token: string }
   * 
   * Response 401:
   * { error: "Invalid credentials", code: "AUTH_FAILED" }
   */
  AUTH_LOGIN: '/auth/login',

  /**
   * POST /api/auth/register
   * Register new user
   * 
   * Request Body:
   * { email: string, password: string, firstName: string, lastName: string, phone?: string }
   * 
   * Response 201:
   * { user: { id, email, firstName, lastName, ... }, token: string }
   */
  AUTH_REGISTER: '/auth/register',

  /**
   * PUT /api/users/:userId
   * Update user profile
   * 
   * Request Body:
   * { firstName?, lastName?, phone?, address?, insuranceProvider?, insuranceId? }
   * 
   * Response 200:
   * { user: { id, email, firstName, lastName, ... } }
   */
  USER_UPDATE: '/users/:userId',

  // Provider Management Endpoints

  /**
   * POST /api/provider/queue/invite-next
   * Invite next patient in queue
   * 
   * Request Body:
   * { providerId: string }
   * 
   * Response 200:
   * { message: string, invited: { token: string, userId: string } | null }
   */
  PROVIDER_INVITE_NEXT: '/provider/queue/invite-next',

  /**
   * POST /api/provider/queue/postpone
   * Postpone a patient
   * 
   * Request Body:
   * { token: string }
   * 
   * Response 200:
   * { message: string, newPosition: number }
   */
  PROVIDER_POSTPONE: '/provider/queue/postpone',

  /**
   * DELETE /api/provider/queue/:token
   * Cancel a queue entry
   * 
   * Response 200:
   * { message: string }
   */
  PROVIDER_CANCEL_QUEUE: '/provider/queue/:token',

  /**
   * PUT /api/provider/:providerId/availability
   * Update provider availability
   * 
   * Request Body:
   * { slots: [{ id?: string, date: string, time: string, available: boolean }] }
   * 
   * Response 200:
   * { message: string, slots: [...] }
   */
  PROVIDER_AVAILABILITY: '/provider/:providerId/availability',

  /**
   * GET /api/provider/:providerId/queue
   * Get provider's queue
   * 
   * Response 200:
   * { queue: [{ token, userId, position, estimatedWait, status, joinedAt }] }
   */
  PROVIDER_QUEUE: '/provider/:providerId/queue'
};

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500
};

/**
 * Error Codes
 */
export const ERROR_CODES = {
  PROVIDER_NOT_FOUND: 'PROVIDER_NOT_FOUND',
  SLOT_UNAVAILABLE: 'SLOT_UNAVAILABLE',
  QUEUE_NOT_FOUND: 'QUEUE_NOT_FOUND',
  AUTH_FAILED: 'AUTH_FAILED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  PAYMENT_FAILED: 'PAYMENT_FAILED'
};
