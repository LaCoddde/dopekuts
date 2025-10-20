// app/admin/calendar/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarClock, Save, Clock, AlertCircle } from 'lucide-react';
import {
  getCalendarSettings,
  updateCalendarSettings,
  ICalendarSettings,
} from '@/lib/api/calendar';

const timeOptions = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30', '22:00',
];

const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function CalendarManagement() {
  const [schedule, setSchedule] = useState<ICalendarSettings[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        setError(null);
        const settings = await getCalendarSettings();
        
        // Sort the settings to ensure a consistent order
        const sortedSettings = settings.sort((a, b) => {
          return dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek);
        });

        setSchedule(sortedSettings);
      } catch (err) {
        console.error('Failed to fetch calendar settings:', err);
        setError('Failed to load schedule. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []); // Empty dependency array ensures this runs only once on mount

  const toggleDay = (index: number) => {
    const newSchedule = [...schedule];
    newSchedule[index].isEnabled = !newSchedule[index].isEnabled;
    setSchedule(newSchedule);
  };

  const updateStartTime = (index: number, time: string) => {
    const newSchedule = [...schedule];
    newSchedule[index].startTime = time;
    setSchedule(newSchedule);
  };

  const updateEndTime = (index: number, time: string) => {
    const newSchedule = [...schedule];
    newSchedule[index].endTime = time;
    setSchedule(newSchedule);
  };
  
  const updateBreakStartTime = (index: number, time: string) => {
    const newSchedule = [...schedule];
    // If no breaks exist, create one. Otherwise, update the existing one.
    if (newSchedule[index].breaks.length === 0) {
        const nextTimeSlot = timeOptions.find(option => option > time);
        const breakEndTime = nextTimeSlot && nextTimeSlot < newSchedule[index].endTime ? nextTimeSlot : '';
        newSchedule[index].breaks.push({ startTime: time, endTime: breakEndTime });
    } else {
      newSchedule[index].breaks[0].startTime = time;
      // Ensure break end time is after break start time
      if (time >= newSchedule[index].breaks[0].endTime) {
        const nextTimeSlot = timeOptions.find(option => option > time);
        if (nextTimeSlot && nextTimeSlot < newSchedule[index].endTime) {
          newSchedule[index].breaks[0].endTime = nextTimeSlot;
        } else {
          // If no valid next slot, clear the end time or set a default
          newSchedule[index].breaks[0].endTime = ''; 
        }
      }
    }
    setSchedule(newSchedule);
  };

  const updateBreakEndTime = (index: number, time: string) => {
    const newSchedule = [...schedule];
    if (newSchedule[index].breaks.length > 0) {
      newSchedule[index].breaks[0].endTime = time;
    }
    setSchedule(newSchedule);
  };

  const handleSave = async () => {
    try {
      console.log('Saving schedule:', schedule);
      await updateCalendarSettings(schedule);
      alert('Schedule saved successfully!');
    } catch (err) {
      console.error('Failed to save schedule:', err);
      alert('Failed to save schedule. Please try again.');
    }
  };

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
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Calendar Management
        </h1>
        <p className="text-sm md:text-base text-gray-400">
          Set your weekly availability schedule
        </p>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CalendarClock className="h-5 w-5" />
            Weekly Availability
          </CardTitle>
          <CardDescription className="text-gray-300">
            Configure the days and hours you are available for appointments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {schedule.map((daySchedule, index) => {
              const breakStartTimeOptions = timeOptions.filter(
                (time) => time > daySchedule.startTime && time < daySchedule.endTime
              );
              const breakEndTimeOptions = timeOptions.filter(
                (time) => time > (daySchedule.breaks[0]?.startTime || '') && time <= daySchedule.endTime
              );
              
              return (
                <div
                  key={daySchedule.dayOfWeek}
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    daySchedule.isEnabled
                      ? 'bg-gray-750 border-gray-600'
                      : 'bg-gray-800 border-gray-700 opacity-60'
                  }`}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor={`toggle-${daySchedule.dayOfWeek}`}
                        className="text-white text-base md:text-lg font-semibold cursor-pointer"
                      >
                        {daySchedule.dayOfWeek}
                      </Label>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">
                          {daySchedule.isEnabled ? 'Available' : 'Closed'}
                        </span>
                        <Switch
                          id={`toggle-${daySchedule.dayOfWeek}`}
                          checked={daySchedule.isEnabled}
                          onCheckedChange={() => toggleDay(index)}
                        />
                      </div>
                    </div>

                    {daySchedule.isEnabled && (
                      <div className="space-y-4">
                        {/* Working Hours */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-gray-300 text-sm flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Start Time
                            </Label>
                            <Select
                              value={daySchedule.startTime}
                              onValueChange={(value) => updateStartTime(index, value)}
                            >
                              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-700 border-gray-600 max-h-[200px]">
                                {timeOptions.map((time) => (
                                  <SelectItem key={`start-${time}`} value={time} className="text-white">
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-300 text-sm flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              End Time
                            </Label>
                            <Select
                              value={daySchedule.endTime}
                              onValueChange={(value) => updateEndTime(index, value)}
                            >
                              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-700 border-gray-600 max-h-[200px]">
                                {timeOptions.map((time) => (
                                  <SelectItem key={`end-${time}`} value={time} className="text-white">
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Break Times */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-600/50">
                            <div className="space-y-2">
                            <Label className="text-gray-300 text-sm flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Break Start
                            </Label>
                            <Select
                              value={daySchedule.breaks[0]?.startTime}
                              onValueChange={(value) => updateBreakStartTime(index, value)}
                            >
                              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                <SelectValue placeholder="No break" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-700 border-gray-600 max-h-[200px]">
                                {breakStartTimeOptions.map((time) => (
                                  <SelectItem key={`break-start-${time}`} value={time} className="text-white">
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-300 text-sm flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Break End
                            </Label>
                            <Select
                              value={daySchedule.breaks[0]?.endTime}
                              onValueChange={(value) => updateBreakEndTime(index, value)}
                              disabled={!daySchedule.breaks[0]?.startTime}
                            >
                              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                <SelectValue placeholder="No break" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-700 border-gray-600 max-h-[200px]">
                                {breakEndTimeOptions.map((time) => (
                                  <SelectItem key={`break-end-${time}`} value={time} className="text-white">
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="pt-4">
            <Button
              onClick={handleSave}
              className="w-full bg-white text-black hover:bg-gray-200"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Availability Schedule
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Schedule Summary</CardTitle>
          <CardDescription className="text-gray-300">
            Your current weekly schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {schedule.map((daySchedule) => (
              <div
                key={daySchedule.dayOfWeek}
                className="flex items-start justify-between py-3 border-b border-gray-700 last:border-0"
              >
                <span className="text-white font-medium">{daySchedule.dayOfWeek}</span>
                <div className="text-right">
                    {daySchedule.isEnabled ? (
                        <>
                            <span className="text-gray-300 block">
                                {`${daySchedule.startTime} - ${daySchedule.endTime}`}
                            </span>
                            {daySchedule.breaks.length > 0 && daySchedule.breaks[0].startTime && (
                                <span className="text-xs text-gray-400 block">
                                    {`Break: ${daySchedule.breaks[0].startTime} - ${daySchedule.breaks[0].endTime}`}
                                </span>
                            )}
                        </>
                    ) : (
                        <span className="text-gray-400">Closed</span>
                    )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}