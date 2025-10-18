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
    phone: string;
    firstName: string;
    lastName: string;
    email: string;
    notes?: string;
    paymentMethod: 'now' | 'in-person';
}

export interface UpdateBookingData {
    serviceId?: string;
    date?: string;
    time?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    email?: string; // Required for public (non-admin) updates
    notes?: string;
}

export interface CancelBookingData {
    email: string; // Required for public (non-admin) cancellations
}

// --- API Functions ---

/**
 * Create a new booking.
 * @access Public
 */
export async function createBooking(data: CreateBookingData): Promise<{ message: string; booking: IBooking }> {
    const response = await apiClient.post<{ message: string; booking: IBooking }>('/bookings', data);
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
 * Update a booking. Can be used by a customer (public) or an admin.
 * If used by a customer, the `email` field must be included in the data for verification.
 * @access Public / Private
 */
export async function updateBooking(id: string, data: UpdateBookingData): Promise<{ message: string; booking: IBooking }> {
    // The backend uses two different endpoints for public vs admin, but they do the same thing.
    // We can just use one function and let the backend differentiate based on admin auth cookie.
    const response = await apiClient.put<{ message: string; booking: IBooking }>(`/bookings/${id}`, data);
    return response.data;
}

/**
 * Cancel a booking. Can be used by a customer (public) or an admin.
 * If used by a customer, the `email` field must be included in the data for verification.
 * @access Public / Private
 */
export async function cancelBooking(id: string, data?: CancelBookingData): Promise<{ message: string }> {
    // The backend uses separate PATCH routes, but we can simplify the client-side call.
    // The admin route doesn't require a body, but the public one does.
    const response = await apiClient.patch<{ message: string }>(`/bookings/${id}/cancel`, data);
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
export async function confirmPayment(id: string): Promise<{ message: string; booking: IBooking }> {
    const response = await apiClient.patch<{ message: string; booking: IBooking }>(`/bookings/${id}/confirm-payment`);
    return response.data;
}