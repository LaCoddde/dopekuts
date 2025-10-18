// dopekuts/lib/api/calendar.ts
import apiClient from './apiClient';

// --- Interfaces ---

export interface IBreak {
    startTime: string; // e.g., "12:00"
    endTime: string;   // e.g., "13:00"
}

export interface ICalendarSettings {
    _id?: string;
    dayOfWeek: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
    isEnabled: boolean;
    startTime: string;   // e.g., "09:00"
    endTime: string;     // e.g., "17:00"
    slotDuration: number; // in minutes
    breaks: IBreak[];
}

// --- API Functions ---

/**
 * Get the calendar settings for all days of the week.
 * @access Public
 */
export async function getCalendarSettings(): Promise<ICalendarSettings[]> {
    const response = await apiClient.get<ICalendarSettings[]>('/calendar/settings');
    return response.data;
}

/**
 * Get available time slots for a specific date.
 * @param date - The target date in 'YYYY-MM-DD' format.
 * @access Public
 */
export async function getAvailability(date: string): Promise<string[]> {
    const response = await apiClient.get<string[]>(`/calendar/availability/${date}`);
    return response.data;
}

// --- Admin-Only Functions ---

/**
 * Create or update the calendar settings for all days.
 * @param settings - An array of settings objects, one for each day.
 * @access Private (Admin only)
 */
export async function updateCalendarSettings(settings: ICalendarSettings[]): Promise<{ message: string; settings: ICalendarSettings[] }> {
    const response = await apiClient.put<{ message: string; settings: ICalendarSettings[] }>('/calendar/settings', settings);
    return response.data;
}