// dopekuts/lib/api/booking.ts
import apiClient from './apiClient';

// --- Interfaces ---

export interface IBooking {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  price: number;
  duration: number;
  date: string; // ISO string format
  time: string;
  notes?: string;
  paymentMethod: 'now' | 'in-person';
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingData {
  serviceId: string;
  date: string; // e.g., "YYYY-MM-DD"
  time: string; // e.g., "10:00 AM"
  phone: string; // E.164 preferred, but backend accepts as provided
  firstName: string;
  lastName: string;
  email: string;
  notes?: string;
  paymentMethod: 'now' | 'in-person';
}

/**
 * For public self-service update:
 * - Provide either `email` (matches booking.email)
 *   OR `phone` + `otp` (from the phone OTP flow).
 * Admins do not need email/phone/otp.
 */
export interface UpdateBookingData {
  serviceId?: string;
  date?: string;
  time?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  email?: string; // public path: ONE of (email) OR (phone + otp)
  notes?: string;
  otp?: string;   // used with phone for OTP verification
}

/**
 * For public self-service cancel:
 * - Provide either `email`
 *   OR `phone` + `otp`.
 * Admins do not need a body.
 */
export interface CancelBookingData {
  email?: string;
  phone?: string;
  otp?: string;
}

export interface PhoneOtpStartPayload {
  phone: string;
}

export interface PhoneOtpVerifyPayload {
  phone: string;
  otp: string;
}

// --- API Functions ---

/**
 * Create a new booking.
 * @access Public
 */
export async function createBooking(
  data: CreateBookingData
): Promise<{ message: string; booking: IBooking }> {
  const response = await apiClient.post<{ message: string; booking: IBooking }>(
    '/bookings',
    data
  );
  return response.data;
}

/**
 * Get an upcoming booking by the user's phone number.
 * @access Public
 */
export async function getBookingByPhone(phone: string): Promise<IBooking> {
  const response = await apiClient.get<IBooking>(`/bookings/phone/${phone}`);
  return response.data;
}

/**
 * Start phone OTP for self-service (reschedule/cancel).
 * Sends a 6-digit code via SMS.
 * @access Public
 */
export async function startPhoneOtp(payload: PhoneOtpStartPayload): Promise<{ message: string }> {
  const response = await apiClient.post<{ message: string }>(`/bookings/phone-otp/start`, payload);
  return response.data;
}

/**
 * Verify phone OTP for self-service (reschedule/cancel).
 * @access Public
 */
export async function verifyPhoneOtp(payload: PhoneOtpVerifyPayload): Promise<{ message: string }> {
  const response = await apiClient.post<{ message: string }>(`/bookings/phone-otp/verify`, payload);
  return response.data;
}

/**
 * Update a booking as a customer (public).
 * Provide either `email` OR `phone` + `otp` in `data`.
 * @access Public
 */
export async function updateBookingPublic(
  id: string,
  data: UpdateBookingData
): Promise<{ message: string; booking: IBooking }> {
  const response = await apiClient.put<{ message: string; booking: IBooking }>(
    `/bookings/manage/${id}`,
    data
  );
  return response.data;
}

/**
 * Update a booking as an admin.
 * @access Private (Admin only)
 */
export async function updateBookingAdmin(
  id: string,
  data: UpdateBookingData
): Promise<{ message: string; booking: IBooking }> {
  const response = await apiClient.put<{ message: string; booking: IBooking }>(
    `/bookings/${id}`,
    data
  );
  return response.data;
}

/**
 * Cancel a booking as a customer (public).
 * Provide either `email` OR `phone` + `otp` in `data`.
 * @access Public
 */
export async function cancelBookingPublic(
  id: string,
  data: CancelBookingData
): Promise<{ message: string }> {
  const response = await apiClient.patch<{ message: string }>(
    `/bookings/manage/${id}/cancel`,
    data
  );
  return response.data;
}

/**
 * Cancel a booking as an admin.
 * @access Private (Admin only)
 */
export async function cancelBookingAdmin(id: string): Promise<{ message: string }> {
  const response = await apiClient.patch<{ message: string }>(`/bookings/${id}/cancel`);
  return response.data;
}

// --- Admin-Only Functions ---

/**
 * Get all bookings, sorted by most recent.
 * @access Private (Admin only)
 */
export async function getAllBookings(): Promise<IBooking[]> {
  const response = await apiClient.get<IBooking[]>('/bookings');
  return response.data;
}

/**
 * Confirm payment for a booking and change its status from 'pending' to 'confirmed'.
 * @access Private (Admin only)
 */
export async function confirmPayment(
  id: string
): Promise<{ message: string; booking: IBooking }> {
  const response = await apiClient.patch<{ message: string; booking: IBooking }>(
    `/bookings/${id}/confirm-payment`
  );
  return response.data;
}