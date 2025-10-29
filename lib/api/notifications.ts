// dopecut/dopekuts-main/lib/api/notifications.ts
import apiClient from './apiClient';

export interface NotificationSettings {
  _id: string;
  key: 'global';
  emailEnabled: boolean;
  smsEnabled: boolean;
  autoSendBookingConfirmations: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
  const { data } = await apiClient.get<NotificationSettings>('/notifications/settings');
  return data;
}

export async function updateNotificationSettings(
  payload: Partial<Pick<NotificationSettings, 'emailEnabled' | 'smsEnabled' | 'autoSendBookingConfirmations'>>
): Promise<{ message: string; settings: NotificationSettings }> {
  const { data } = await apiClient.put<{ message: string; settings: NotificationSettings }>(
    '/notifications/settings',
    payload
  );
  return data;
}