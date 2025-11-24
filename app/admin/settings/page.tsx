// dopecut/dopekuts-main/app/admin/settings/page.tsx
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Bell, Calendar as CalendarIcon } from 'lucide-react';
import moment from 'moment';
import { toast } from 'sonner';
import {
  getNotificationSettings,
  updateNotificationSettings,
  type NotificationSettings,
} from '@/lib/api/notifications';

type SavingKey =
  | 'emailEnabled'
  | 'smsEnabled'
  | 'autoSendBookingConfirmations'
  | 'timezone'
  | 'siteNoticeEnabled';

const fallbackTimezones = [
  'America/Toronto',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Vancouver',
  'Europe/London',
  'UTC',
];

const STORAGE_START = 'admin-calendar-start';
const STORAGE_WEEKS = 'admin-calendar-weeks';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [bookingConfirmations, setBookingConfirmations] = useState(true);
  const [timezone, setTimezone] = useState('America/Toronto');
  const [siteNoticeEnabled, setSiteNoticeEnabled] = useState(false);
  const [siteNoticeMessage, setSiteNoticeMessage] = useState('');
  const [calendarStart, setCalendarStart] = useState(moment().startOf('isoWeek').format('YYYY-MM-DD'));
  const [calendarWeeks, setCalendarWeeks] = useState(4);

  const [saving, setSaving] = useState<Record<SavingKey, boolean>>({
    emailEnabled: false,
    smsEnabled: false,
    autoSendBookingConfirmations: false,
    timezone: false,
    siteNoticeEnabled: false,
  });
  const [saveError, setSaveError] = useState<Record<SavingKey, string | null>>({
    emailEnabled: null,
    smsEnabled: null,
    autoSendBookingConfirmations: null,
    timezone: null,
    siteNoticeEnabled: null,
  });

  const load = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const s: NotificationSettings = await getNotificationSettings();
      setEmailNotifications(!!s.emailEnabled);
      setSmsNotifications(!!s.smsEnabled);
      setBookingConfirmations(!!s.autoSendBookingConfirmations);
      setTimezone(s.timezone || 'America/Toronto');
      setSiteNoticeEnabled(!!s.siteNoticeEnabled);
      setSiteNoticeMessage(s.siteNoticeMessage || '');
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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedStart = window.localStorage.getItem(STORAGE_START);
    const storedWeeks = window.localStorage.getItem(STORAGE_WEEKS);
    if (storedStart) setCalendarStart(storedStart);
    const parsedWeeks = storedWeeks ? parseInt(storedWeeks, 10) : NaN;
    if (!Number.isNaN(parsedWeeks) && parsedWeeks > 0) {
      setCalendarWeeks(parsedWeeks);
    }
  }, []);

  const timezoneOptions = useMemo(() => {
    const supported = (Intl as any).supportedValuesOf?.('timeZone') as string[] | undefined;
    return (supported?.length ? supported : fallbackTimezones).slice(0);
  }, []);

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

  const handleTimezoneChange = useCallback(
    async (nextTz: string) => {
      const prev = timezone;
      setSaveError((cur) => ({ ...cur, timezone: null }));
      setSaving((cur) => ({ ...cur, timezone: true }));
      setTimezone(nextTz);
      try {
        await updateNotificationSettings({ timezone: nextTz });
      } catch (err: any) {
        setSaveError((cur) => ({
          ...cur,
          timezone: err?.message || 'Failed to save timezone. Please try again.',
        }));
        setTimezone(prev);
      } finally {
        setSaving((cur) => ({ ...cur, timezone: false }));
      }
    },
    [timezone]
  );

  const persistCalendarSettings = useCallback(
    (nextStart: string, nextWeeks: number) => {
      if (typeof window === 'undefined') return;
      window.localStorage.setItem(STORAGE_START, nextStart);
      window.localStorage.setItem(STORAGE_WEEKS, String(nextWeeks));
      window.dispatchEvent(
        new CustomEvent('calendar-settings-changed', {
          detail: { startDate: nextStart, weeksToShow: nextWeeks },
        })
      );
      toast.success('Calendar settings updated');
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

  const timezoneHelp = useMemo(
    () =>
      saveError.timezone
        ? saveError.timezone
        : 'All booking times will be aligned to this timezone.',
    [saveError.timezone]
  );

  const noticeHelp = 'Show a dismissible modal to visitors on page load.';

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

              <Separator className="bg-gray-700" />

              {/* Timezone */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="timezone" className="text-white text-sm md:text-base">
                    Business Timezone
                  </Label>
                  <p
                    className={`text-xs sm:text-sm ${
                      saveError.timezone ? 'text-red-400' : 'text-gray-400'
                    }`}
                  >
                    {timezoneHelp}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {saving.timezone && <span className="text-xs text-gray-400">Saving…</span>}
                  <select
                    id="timezone"
                    value={timezone}
                    onChange={(e) => void handleTimezoneChange(e.target.value)}
                    className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                  >
                    {timezoneOptions.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Separator className="bg-gray-700" />

              {/* Site Notice */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5 flex-1">
                    <Label htmlFor="siteNotice" className="text-white text-sm md:text-base">
                      Site Notice Modal
                    </Label>
                    <p className="text-xs sm:text-sm text-gray-400">{noticeHelp}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {saving.siteNoticeEnabled && <span className="text-xs text-gray-400">Saving…</span>}
                    <Switch
                      id="siteNotice"
                      checked={siteNoticeEnabled}
                      disabled={saving.siteNoticeEnabled}
                      onCheckedChange={(checked) => {
                        const prev = siteNoticeEnabled;
                        setSiteNoticeEnabled(checked);
                        void handleToggle('siteNoticeEnabled', checked, () => setSiteNoticeEnabled(prev));
                      }}
                    />
                  </div>
                </div>
                {siteNoticeEnabled && (
                  <div className="space-y-2">
                    <Label htmlFor="siteNoticeMessage" className="text-xs text-gray-400 uppercase tracking-wide">
                      Notice message
                    </Label>
                    <textarea
                      id="siteNoticeMessage"
                      value={siteNoticeMessage}
                      onChange={(e) => setSiteNoticeMessage(e.target.value)}
                      onBlur={async () => {
                        try {
                          await updateNotificationSettings({ siteNoticeMessage });
                          toast.success('Notice message saved');
                        } catch (err: any) {
                          toast.error(err?.message || 'Failed to save notice message.');
                        }
                      }}
                      rows={3}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                      placeholder="Enter the message shown to visitors..."
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Calendar Settings
          </CardTitle>
          <CardDescription className="text-gray-300">
            Control the week range shown on the Calendar page. Changes apply instantly.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs text-gray-400 uppercase tracking-wide">Week start</Label>
            <input
              type="date"
              value={calendarStart}
              onChange={(e) => {
                const val = e.target.value || moment().startOf('isoWeek').format('YYYY-MM-DD');
                setCalendarStart(val);
                persistCalendarSettings(val, calendarWeeks);
              }}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-gray-400 uppercase tracking-wide">Weeks shown</Label>
            <select
              value={calendarWeeks}
              onChange={(e) => {
                const n = Number(e.target.value) || 4;
                setCalendarWeeks(n);
                persistCalendarSettings(calendarStart, n);
              }}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
            >
              {[1, 2, 3, 4].map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
