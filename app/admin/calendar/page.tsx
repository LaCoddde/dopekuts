// app/admin/calendar/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save, AlertCircle, CheckCircle2, XCircle, X } from 'lucide-react';
import moment from 'moment';
import {
  getWeeklyCalendar,
  updateWeeklyCalendar,
  IWeeklyCalendar,
} from '@/lib/api/calendar';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  isError?: boolean;
}

const ConfirmationModal = ({ isOpen, onClose, title, message, isError = false }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-6 mx-4 bg-gray-800 border border-gray-600 rounded-lg shadow-xl">
        <div className="flex flex-col items-center text-center">
          {isError ? (
            <XCircle className="w-12 h-12 mb-4 text-red-500" />
          ) : (
            <CheckCircle2 className="w-12 h-12 mb-4 text-green-500" />
          )}
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="mt-2 text-sm text-gray-300">{message}</p>
          <Button
            onClick={onClose}
            className="w-full mt-6 bg-white text-black hover:bg-gray-200"
          >
            OK
          </Button>
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 text-gray-400 rounded-full hover:bg-gray-700 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const timeOptions = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30', '22:00',
];

const DEFAULT_SLOT_DURATION = 30;

export default function CalendarManagement() {
  const [weeks, setWeeks] = useState<IWeeklyCalendar[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    isError: false,
  });
  const [weeksToShow, setWeeksToShow] = useState(4);
  const [startDate, setStartDate] = useState(moment().startOf('isoWeek').format('YYYY-MM-DD'));
  const [isSaving, setIsSaving] = useState(false);

  const fetchWeeks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWeeklyCalendar(weeksToShow, startDate);
      setWeeks(data);
    } catch (err) {
      console.error('Failed to fetch weekly schedule:', err);
      setError('Failed to load schedule. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeks();
  }, [weeksToShow, startDate]);

  const updateWeek = (index: number, updatedWeek: IWeeklyCalendar) => {
    setWeeks((prev) => prev.map((week, idx) => (idx === index ? updatedWeek : week)));
  };

  const updateDay = (weekIndex: number, dayIndex: number, dayChanges: Partial<IWeeklyCalendar['days'][0]>) => {
    const updated = [...weeks];
    const targetWeek = updated[weekIndex];
    if (!targetWeek) return;
    const days = [...targetWeek.days];
    days[dayIndex] = { ...days[dayIndex], ...dayChanges };
    updated[weekIndex] = { ...targetWeek, days };
    setWeeks(updated);
  };

  const addBlockedTime = (weekIndex: number, dayIndex: number) => {
    const updated = [...weeks];
    const targetWeek = updated[weekIndex];
    if (!targetWeek) return;
    const days = [...targetWeek.days];
    const day = days[dayIndex];
    const blockedTimes = [...day.blockedTimes, { startTime: day.startTime, endTime: day.startTime }];
    days[dayIndex] = { ...day, blockedTimes };
    updated[weekIndex] = { ...targetWeek, days };
    setWeeks(updated);
  };

  const updateBlockedTime = (
    weekIndex: number,
    dayIndex: number,
    blockedIndex: number,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    const updated = [...weeks];
    const targetWeek = updated[weekIndex];
    if (!targetWeek) return;
    const days = [...targetWeek.days];
    const blockedTimes = [...days[dayIndex].blockedTimes];
    blockedTimes[blockedIndex] = { ...blockedTimes[blockedIndex], [field]: value };
    days[dayIndex] = { ...days[dayIndex], blockedTimes };
    updated[weekIndex] = { ...targetWeek, days };
    setWeeks(updated);
  };

  const removeBlockedTime = (weekIndex: number, dayIndex: number, blockedIndex: number) => {
    const updated = [...weeks];
    const targetWeek = updated[weekIndex];
    if (!targetWeek) return;
    const days = [...targetWeek.days];
    const blockedTimes = [...days[dayIndex].blockedTimes];
    blockedTimes.splice(blockedIndex, 1);
    days[dayIndex] = { ...days[dayIndex], blockedTimes };
    updated[weekIndex] = { ...targetWeek, days };
    setWeeks(updated);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateWeeklyCalendar(weeks);
      setModalState({
        isOpen: true,
        title: 'Schedule Updated',
        message: 'Your new availability has been saved successfully.',
        isError: false,
      });
    } catch (err) {
      console.error('Failed to save schedule:', err);
      setModalState({
        isOpen: true,
        title: 'Update Failed',
        message: 'We could not save your schedule. Please check your connection and try again.',
        isError: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const closeModal = () => setModalState({ isOpen: false, title: '', message: '', isError: false });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-white text-lg">Loading your schedule...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center p-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-400 text-lg font-semibold">An Error Occurred</p>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <>
      <ConfirmationModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        isError={modalState.isError}
        onClose={closeModal}
      />
      <div className="space-y-4 md:space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Calendar Management</h1>
          <p className="text-sm md:text-base text-gray-400">
            Configure availability per week and block any specific slots.
          </p>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <CardTitle className="text-white">Weekly Availability</CardTitle>
                <CardDescription className="text-gray-300">
                  Edit start/end times per day, and add as many blocked periods as needed.
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                <div>
                  <Label className="text-xs text-gray-400 uppercase tracking-wide">Week start</Label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-400 uppercase tracking-wide">Weeks shown</Label>
                  <select
                    value={weeksToShow}
                    onChange={(e) => setWeeksToShow(Number(e.target.value))}
                    className="mt-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                  >
                    {[1, 2, 3, 4].map((count) => (
                      <option key={count} value={count}>
                        {count}
                      </option>
                    ))}
                  </select>
                </div>
                <Button variant="outline" onClick={fetchWeeks} className="bg-white text-black hover:bg-gray-200">
                  Refresh
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-white text-black hover:bg-gray-200"
                  disabled={isSaving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {weeks.map((week, weekIndex) => (
              <div key={week.weekStart} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Week starting</p>
                    <input
                      type="date"
                      value={week.weekStart}
                      onChange={(e) => updateWeek(weekIndex, { ...week, weekStart: e.target.value })}
                      className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                    />
                  </div>
                  <p className="text-sm text-white font-semibold">{moment(week.weekStart).format('MMMM D, YYYY')}</p>
                </div>
                <div className="grid gap-3">
                  {week.days.map((day, dayIndex) => (
                    <div
                      key={`${week.weekStart}-${day.dayOfWeek}`}
                      className={`rounded-xl p-3 space-y-3 border transition ${
                        day.isEnabled
                          ? 'bg-gray-800 border-gray-700'
                          : 'bg-red-950 border-red-600/60 opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-white">{day.dayOfWeek}</p>
                        <div className="flex items-center gap-2">
                          {!day.isEnabled && (
                            <span className="text-xs text-amber-200 uppercase tracking-wide">hidden</span>
                          )}
                          <Switch
                            checked={day.isEnabled}
                            onCheckedChange={(checked) => updateDay(weekIndex, dayIndex, { isEnabled: checked })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                        <div>
                          <Label className="text-xs text-gray-400 uppercase tracking-wide">Start Time</Label>
                          <select
                            value={day.startTime}
                            onChange={(e) => updateDay(weekIndex, dayIndex, { startTime: e.target.value })}
                            className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-sm text-white"
                          >
                            {timeOptions.map((option) => (
                              <option key={`start-${week.weekStart}-${day.dayOfWeek}-${option}`} value={option}>
                                {moment(option, 'HH:mm').format('hh:mm A')}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-400 uppercase tracking-wide">End Time</Label>
                          <select
                            value={day.endTime}
                            onChange={(e) => updateDay(weekIndex, dayIndex, { endTime: e.target.value })}
                            className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-sm text-white"
                          >
                            {timeOptions.map((option) => (
                              <option key={`end-${week.weekStart}-${day.dayOfWeek}-${option}`} value={option}>
                                {moment(option, 'HH:mm').format('hh:mm A')}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-400 uppercase tracking-wide">Slot Duration</Label>
                          <input
                            type="number"
                            min={10}
                            max={180}
                            value={day.slotDuration}
                            onChange={(e) =>
                              updateDay(weekIndex, dayIndex, {
                                slotDuration: Number(e.target.value) || DEFAULT_SLOT_DURATION,
                              })
                            }
                            className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-sm text-white"
                          />
                        </div>
                        <div className="flex items-end">
                          <Label className="text-xs text-gray-400 uppercase tracking-wide">Enabled</Label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-400 uppercase tracking-wide">Blocked Times</p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addBlockedTime(weekIndex, dayIndex)}
                            disabled={!day.isEnabled}
                          >
                            Add block
                          </Button>
                        </div>
                        {day.blockedTimes.map((block, blockedIndex) => (
                          <div
                            key={`${week.weekStart}-${day.dayOfWeek}-blocked-${blockedIndex}`}
                            className="flex flex-wrap gap-2 items-center"
                          >
                            <select
                              value={block.startTime}
                              onChange={(e) =>
                                updateBlockedTime(weekIndex, dayIndex, blockedIndex, 'startTime', e.target.value)
                              }
                              className="bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-sm text-white"
                            >
                              {timeOptions.map((option) => (
                                <option key={`block-start-${blockedIndex}-${option}`} value={option}>
                                  {moment(option, 'HH:mm').format('hh:mm A')}
                                </option>
                              ))}
                            </select>
                            <select
                              value={block.endTime}
                              onChange={(e) =>
                                updateBlockedTime(weekIndex, dayIndex, blockedIndex, 'endTime', e.target.value)
                              }
                              className="bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-sm text-white"
                            >
                              {timeOptions.map((option) => (
                                <option key={`block-end-${blockedIndex}-${option}`} value={option}>
                                  {moment(option, 'HH:mm').format('hh:mm A')}
                                </option>
                              ))}
                            </select>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeBlockedTime(weekIndex, dayIndex, blockedIndex)}
                              className="text-gray-400"
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Remove blocked time</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
