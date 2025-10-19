'use client';

import { useState } from 'react';
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
import { CalendarClock, Save, Clock } from 'lucide-react';

interface DaySchedule {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
}

const initialSchedule: DaySchedule[] = [
  { day: 'Monday', enabled: true, startTime: '09:00', endTime: '18:00' },
  { day: 'Tuesday', enabled: true, startTime: '09:00', endTime: '18:00' },
  { day: 'Wednesday', enabled: true, startTime: '09:00', endTime: '18:00' },
  { day: 'Thursday', enabled: true, startTime: '09:00', endTime: '18:00' },
  { day: 'Friday', enabled: true, startTime: '09:00', endTime: '20:00' },
  { day: 'Saturday', enabled: true, startTime: '10:00', endTime: '18:00' },
  { day: 'Sunday', enabled: false, startTime: '10:00', endTime: '16:00' },
];

const timeOptions = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30', '22:00',
];

export default function CalendarManagement() {
  const [schedule, setSchedule] = useState<DaySchedule[]>(initialSchedule);

  const toggleDay = (index: number) => {
    const newSchedule = [...schedule];
    newSchedule[index].enabled = !newSchedule[index].enabled;
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

  const handleSave = () => {
    console.log('Saving schedule:', schedule);
  };

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
            {schedule.map((daySchedule, index) => (
              <div
                key={daySchedule.day}
                className={`p-4 rounded-lg border ${
                  daySchedule.enabled
                    ? 'bg-gray-750 border-gray-600'
                    : 'bg-gray-800 border-gray-700 opacity-60'
                }`}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor={`toggle-${daySchedule.day}`}
                      className="text-white text-base md:text-lg font-semibold cursor-pointer"
                    >
                      {daySchedule.day}
                    </Label>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-400">
                        {daySchedule.enabled ? 'Available' : 'Closed'}
                      </span>
                      <Switch
                        id={`toggle-${daySchedule.day}`}
                        checked={daySchedule.enabled}
                        onCheckedChange={() => toggleDay(index)}
                      />
                    </div>
                  </div>

                  {daySchedule.enabled && (
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
                              <SelectItem key={time} value={time} className="text-white">
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
                              <SelectItem key={time} value={time} className="text-white">
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
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
                key={daySchedule.day}
                className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0"
              >
                <span className="text-white font-medium">{daySchedule.day}</span>
                <span className="text-gray-300">
                  {daySchedule.enabled
                    ? `${daySchedule.startTime} - ${daySchedule.endTime}`
                    : 'Closed'}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}