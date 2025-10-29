// dopecut/dopekuts-main/app/admin/settings/page.tsx
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Bell } from 'lucide-react';
import {
  getNotificationSettings,
  updateNotificationSettings,
  type NotificationSettings,
} from '@/lib/api/notifications';

type SavingKey = 'emailEnabled' | 'smsEnabled' | 'autoSendBookingConfirmations';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [bookingConfirmations, setBookingConfirmations] = useState(true);

  const [saving, setSaving] = useState<Record<SavingKey, boolean>>({
    emailEnabled: false,
    smsEnabled: false,
    autoSendBookingConfirmations: false,
  });
  const [saveError, setSaveError] = useState<Record<SavingKey, string | null>>({
    emailEnabled: null,
    smsEnabled: null,
    autoSendBookingConfirmations: null,
  });

  const load = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const s: NotificationSettings = await getNotificationSettings();
      setEmailNotifications(!!s.emailEnabled);
      setSmsNotifications(!!s.smsEnabled);
      setBookingConfirmations(!!s.autoSendBookingConfirmations);
    } catch (err: any) {
      setFetchError(err?.message || 'Failed to load notification settings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fire and forget
    void load();
  }, [load]);

  const handleToggle = useCallback(
    async (key: SavingKey, nextValue: boolean, revert: () => void) => {
      setSaveError(prev => ({ ...prev, [key]: null }));
      setSaving(prev => ({ ...prev, [key]: true }));
      try {
        await updateNotificationSettings({ [key]: nextValue });
      } catch (err: any) {
        setSaveError(prev => ({
          ...prev,
          [key]: err?.message || 'Failed to save. Please try again.',
        }));
        // rollback local state
        revert();
      } finally {
        setSaving(prev => ({ ...prev, [key]: false }));
      }
    },
    []
  );

  const emailHelp = useMemo(
    () =>
      saveError.emailEnabled
        ? saveError.emailEnabled
        : 'Receive booking updates via email',
    [saveError.emailEnabled]
  );

  const smsHelp = useMemo(
    () =>
      saveError.smsEnabled
        ? saveError.smsEnabled
        : 'Get text messages for new bookings',
    [saveError.smsEnabled]
  );

  const confirmationHelp = useMemo(
    () =>
      saveError.autoSendBookingConfirmations
        ? saveError.autoSendBookingConfirmations
        : 'Auto-send confirmation emails',
    [saveError.autoSendBookingConfirmations]
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription className="text-gray-300">
            Configure notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="text-gray-300 text-sm">Loading settings…</div>
          ) : fetchError ? (
            <div className="text-red-400 text-sm">{fetchError}</div>
          ) : (
            <>
              {/* Email */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="emailNotif" className="text-white text-sm md:text-base">
                    Email Notifications
                  </Label>
                  <p
                    className={`text-xs sm:text-sm ${
                      saveError.emailEnabled ? 'text-red-400' : 'text-gray-400'
                    }`}
                  >
                    {emailHelp}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {saving.emailEnabled && (
                    <span className="text-xs text-gray-400">Saving…</span>
                  )}
                  <Switch
                    id="emailNotif"
                    checked={emailNotifications}
                    disabled={saving.emailEnabled}
                    onCheckedChange={(checked) => {
                      const prev = emailNotifications;
                      setEmailNotifications(checked);
                      void handleToggle('emailEnabled', checked, () => setEmailNotifications(prev));
                    }}
                  />
                </div>
              </div>

              <Separator className="bg-gray-700" />

              {/* SMS */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="smsNotif" className="text-white text-sm md:text-base">
                    SMS Notifications
                  </Label>
                  <p
                    className={`text-xs sm:text-sm ${
                      saveError.smsEnabled ? 'text-red-400' : 'text-gray-400'
                    }`}
                  >
                    {smsHelp}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {saving.smsEnabled && (
                    <span className="text-xs text-gray-400">Saving…</span>
                  )}
                  <Switch
                    id="smsNotif"
                    checked={smsNotifications}
                    disabled={saving.smsEnabled}
                    onCheckedChange={(checked) => {
                      const prev = smsNotifications;
                      setSmsNotifications(checked);
                      void handleToggle('smsEnabled', checked, () => setSmsNotifications(prev));
                    }}
                  />
                </div>
              </div>

              <Separator className="bg-gray-700" />

              {/* Booking Confirmations */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="bookingConfirm" className="text-white text-sm md:text-base">
                    Booking Confirmations
                  </Label>
                  <p
                    className={`text-xs sm:text-sm ${
                      saveError.autoSendBookingConfirmations ? 'text-red-400' : 'text-gray-400'
                    }`}
                  >
                    {confirmationHelp}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {saving.autoSendBookingConfirmations && (
                    <span className="text-xs text-gray-400">Saving…</span>
                  )}
                  <Switch
                    id="bookingConfirm"
                    checked={bookingConfirmations}
                    disabled={saving.autoSendBookingConfirmations}
                    onCheckedChange={(checked) => {
                      const prev = bookingConfirmations;
                      setBookingConfirmations(checked);
                      void handleToggle(
                        'autoSendBookingConfirmations',
                        checked,
                        () => setBookingConfirmations(prev)
                      );
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}