'use client';

import { useEffect, useMemo, useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { Calendar, CheckCircle2, Clock, ChevronLeft, ChevronRight, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import moment from 'moment';

// --- Mock data & helpers (replace with real data fetches/integrations) ---

type Service = {
  id: string;
  name: string;
  price: number;
  duration: number; // minutes
};

const services: Service[] = [
  { id: 'classic', name: 'Classic Cut', price: 35, duration: 45 },
  { id: 'beard', name: 'Beard Grooming', price: 25, duration: 30 },
  { id: 'premium', name: 'Premium Package', price: 65, duration: 90 },
  { id: 'express', name: 'Express Service', price: 25, duration: 20 },
];

type Appointment = {
  id: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g., '1:30 PM'
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
};

const mockExistingAppointment: Appointment = {
  id: 'apt_12345',
  serviceId: 'classic',
  date: moment().add(2, 'days').format('YYYY-MM-DD'),
  time: '1:30 PM',
  firstName: 'Jordan',
  lastName: 'Smith',
  phone: '+14165551234',
  email: 'jordan@example.com',
};

// Generate time slots with 30-minute intervals
const generateTimeSlots = () => {
  const slots: string[] = [];
  const startTime = moment().hour(9).minute(0); // 9:00 AM
  const endTime = moment().hour(18).minute(0); // 6:00 PM
  let current = startTime.clone();
  while (current.isBefore(endTime)) {
    slots.push(current.format('h:mm A'));
    current.add(30, 'minutes');
  }
  return slots;
};

// Generate available dates (2 weeks in advance, skipping Sundays)
const generateAvailableDates = () => {
  const dates: {
    date: string;
    display: string;
    dayName: string;
    isToday: boolean;
    isTomorrow: boolean;
  }[] = [];
  const today = moment();

  for (let i = 0; i < 14; i++) {
    const date = today.clone().add(i, 'days');
    if (date.day() !== 0) {
      dates.push({
        date: date.format('YYYY-MM-DD'),
        display: date.format('MMM DD'),
        dayName: date.format('ddd'),
        isToday: i === 0,
        isTomorrow: i === 1,
      });
    }
  }
  return dates;
};

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// --- Component ---

export default function RescheduleAppointment() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Identity verification
  const [verifyMethod, setVerifyMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [codeSent, setCodeSent] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [verified, setVerified] = useState(false);

  // Existing appointment (normally fetched after verification)
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  // New schedule selection
  const [availableDates] = useState(generateAvailableDates());
  const [timeSlots] = useState(generateTimeSlots());
  const [newDate, setNewDate] = useState<string>('');
  const [newTime, setNewTime] = useState<string>('');

  // Finalize
  const [showSuccess, setShowSuccess] = useState(false);

  // Lock body scroll on success overlay (if we decide to overlay); here success is a full-screen view, so no lock needed.

  // Simulate sending code
  const handleSendCode = () => {
    if (verifyMethod === 'phone') {
      if (!phone || !isValidPhoneNumber(phone)) return;
    } else {
      if (!email || !validateEmail(email)) return;
    }
    // Send OTP here (real integration). Mock:
    setCodeSent(true);
  };

  const handleVerifyCode = () => {
    // In production, verify server-side. Mock code = 123456
    if (codeInput.trim() === '123456') {
      setVerified(true);
      // Fetch appointment linked to that phone/email. Mock:
      setAppointment(mockExistingAppointment);
      // Preselect current appointment date/time for convenience
      setNewDate(mockExistingAppointment.date);
      setNewTime(mockExistingAppointment.time);
      setStep(2);
    }
  };

  const selectedService: Service | undefined = useMemo(
    () => (appointment ? services.find((s) => s.id === appointment.serviceId) : undefined),
    [appointment]
  );

  const canContinueFromStep2 = Boolean(newDate && newTime);
  const canContinueFromStep1 = verified; // You only move on once verified

  const handleConfirmReschedule = () => {
    if (!appointment || !selectedService || !newDate || !newTime) return;
    // Call API to reschedule here.
    // Mock:
    setShowSuccess(true);
    setStep(4);
  };

  const handleDone = () => {
    // Close or route away
    setShowSuccess(false);
  };

  // UI helpers
  const StepPill = ({ index, current }: { index: number; current: number }) => {
    const isCompletedOrActive = current >= index;
    const isActive = current === index;
    return (
      <div className="flex items-center">
        <div
          className={[
            'w-8 h-8 lg:w-12 lg:h-12 rounded-full flex items-center justify-center',
            'text-xs lg:text-sm font-bold leading-none tracking-tight',
            'transition-all duration-300 select-none',
            isCompletedOrActive ? 'bg-white shadow-lg' : 'bg-gray-700 border-2 border-gray-600',
          ].join(' ')}
          aria-current={isActive ? 'step' : undefined}
        >
          <span className="pointer-events-none" style={{ color: isCompletedOrActive ? '#000000' : '#D1D5DB' }}>
            {index}
          </span>
        </div>
        {index < 4 && (
          <div className={`w-8 lg:w-16 h-1 transition-all duration-300 ${current > index ? 'bg-white' : 'bg-gray-700'}`} />
        )}
      </div>
    );
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-xl w-full">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-white text-2xl">Appointment Rescheduled</CardTitle>
              <CardDescription className="text-gray-300">
                You’ll receive a confirmation message shortly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <h4 className="text-white font-semibold mb-3">New Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Service:</span>
                    <span className="text-white font-medium">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Date:</span>
                    <span className="text-white font-medium">{moment(newDate).format('MMMM DD, YYYY')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Time:</span>
                    <span className="text-white font-medium">{newTime}</span>
                  </div>
                </div>
              </div>

              <Button onClick={handleDone} className="w-full bg-white hover:bg-gray-200">
                <span className="text-black font-medium">Done</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pb-24">
      {/* Header */}
      <div className="bg-black border-b border-gray-800">
        <div className="container-max section-padding py-10 lg:py-14">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">Reschedule Appointment</h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Verify your identity, then pick a new date and time
            </p>
          </div>
        </div>
      </div>

      <div className="container-max section-padding py-8 lg:py-12">
        {/* Progress */}
        <div className="flex justify-center mb-8 lg:mb-12">
          <div className="flex items-center space-x-4">
            <StepPill index={1} current={step} />
            <StepPill index={2} current={step} />
            <StepPill index={3} current={step} />
            <StepPill index={4} current={step} />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Main */}
          <div className="xl:col-span-2 order-2 xl:order-1">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl lg:text-2xl flex items-center gap-3">
                  {step === 1 && (
                    <>
                      <Phone className="w-6 h-6" /> <span>Verify Identity</span>
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <Calendar className="w-6 h-6" /> <span>Select New Date &amp; Time</span>
                    </>
                  )}
                  {step === 3 && (
                    <>
                      <Clock className="w-6 h-6" /> <span>Review Changes</span>
                    </>
                  )}
                  {step === 4 && (
                    <>
                      <CheckCircle2 className="w-6 h-6" /> <span>Done</span>
                    </>
                  )}
                </CardTitle>
                <CardDescription className="text-gray-300 text-base lg:text-lg">
                  {step === 1 && 'Use your phone or email to verify your appointment'}
                  {step === 2 && 'Choose a new date and time that works for you'}
                  {step === 3 && 'Confirm the details before finalizing the change'}
                  {step === 4 && 'Your appointment has been rescheduled'}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-8">
                {/* Step 1: Verify */}
                {step === 1 && (
                  <div className="space-y-8">
                    <div className="flex gap-3">
                      <Button
                        variant={verifyMethod === 'phone' ? undefined : 'outline'}
                        onClick={() => {
                          setVerifyMethod('phone');
                          setEmail('');
                          setCodeSent(false);
                          setCodeInput('');
                          setVerified(false);
                        }}
                        className={verifyMethod === 'phone' ? 'bg-white hover:bg-gray-200' : 'border-gray-600'}
                      >
                        <span className={verifyMethod === 'phone' ? 'text-black' : 'text-white'}>Use Phone</span>
                      </Button>
                      <Button
                        variant={verifyMethod === 'email' ? undefined : 'outline'}
                        onClick={() => {
                          setVerifyMethod('email');
                          setPhone('');
                          setCodeSent(false);
                          setCodeInput('');
                          setVerified(false);
                        }}
                        className={verifyMethod === 'email' ? 'bg-white hover:bg-gray-200' : 'border-gray-600'}
                      >
                        <span className={verifyMethod === 'email' ? 'text-black' : 'text-white'}>Use Email</span>
                      </Button>
                    </div>

                    {verifyMethod === 'phone' && (
                      <div className="space-y-4">
                        <Label className="text-white font-medium">Phone Number</Label>
                        <PhoneInput
                          international
                          defaultCountry="CA"
                          value={phone}
                          onChange={(value) => setPhone(value || '')}
                          className="phone-input"
                          style={
                            {
                              '--PhoneInputCountryFlag-height': '1em',
                              '--PhoneInputCountrySelectArrow-color': '#9CA3AF',
                              '--PhoneInput-color--focus': '#FFFFFF',
                            } as React.CSSProperties
                          }
                        />
                        {phone && !isValidPhoneNumber(phone) && (
                          <p className="text-red-400 text-sm">Please enter a valid phone number</p>
                        )}

                        {!codeSent ? (
                          <Button
                            onClick={handleSendCode}
                            disabled={!phone || !isValidPhoneNumber(phone)}
                            className="bg-white hover:bg-gray-200"
                          >
                            <span className="text-black font-medium">Send Code</span>
                          </Button>
                        ) : (
                          <div className="space-y-3">
                            <Label className="text-white font-medium">Enter 6-digit Code</Label>
                            <Input
                              value={codeInput}
                              onChange={(e) => setCodeInput(e.target.value)}
                              maxLength={6}
                              placeholder="123456"
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                            <div className="flex gap-3">
                              <Button
                                onClick={handleVerifyCode}
                                disabled={codeInput.length !== 6}
                                className="bg-white hover:bg-gray-200"
                              >
                                <span className="text-black font-medium">Verify</span>
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setCodeSent(false);
                                  setCodeInput('');
                                }}
                                className="border-gray-600"
                              >
                                <span className="text-white font-medium">Resend</span>
                              </Button>
                            </div>
                            <p className="text-xs text-gray-400">Demo code: 123456</p>
                          </div>
                        )}
                      </div>
                    )}

                    {verifyMethod === 'email' && (
                      <div className="space-y-4">
                        <Label className="text-white font-medium">Email Address</Label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                        {email && !validateEmail(email) && (
                          <p className="text-red-400 text-sm">Please enter a valid email</p>
                        )}

                        {!codeSent ? (
                          <Button
                            onClick={handleSendCode}
                            disabled={!email || !validateEmail(email)}
                            className="bg-white hover:bg-gray-200"
                          >
                            <span className="text-black font-medium">Send Code</span>
                          </Button>
                        ) : (
                          <div className="space-y-3">
                            <Label className="text-white font-medium">Enter 6-digit Code</Label>
                            <Input
                              value={codeInput}
                              onChange={(e) => setCodeInput(e.target.value)}
                              maxLength={6}
                              placeholder="123456"
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                            <div className="flex gap-3">
                              <Button
                                onClick={handleVerifyCode}
                                disabled={codeInput.length !== 6}
                                className="bg-white hover:bg-gray-200"
                              >
                                <span className="text-black font-medium">Verify</span>
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setCodeSent(false);
                                  setCodeInput('');
                                }}
                                className="border-gray-600"
                              >
                                <span className="text-white font-medium">Resend</span>
                              </Button>
                            </div>
                            <p className="text-xs text-gray-400">Demo code: 123456</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Select New Date & Time */}
                {step === 2 && appointment && (
                  <div className="space-y-8">
                    <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                      <h4 className="text-white font-semibold mb-3">Current Appointment</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Service:</span>
                          <span className="text-white font-medium">{selectedService?.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Duration:</span>
                          <span className="text-white font-medium">{selectedService?.duration} min</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Date:</span>
                          <span className="text-white font-medium">{moment(appointment.date).format('MMMM DD, YYYY')}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Time:</span>
                          <span className="text-white font-medium">{appointment.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Date Selection */}
                    <div className="space-y-4">
                      <Label className="text-white text-base lg:text-lg font-semibold">Select New Date</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {availableDates.map((d) => {
                          const active = newDate === d.date;
                          return (
                            <button
                              key={d.date}
                              onClick={() => setNewDate(d.date)}
                              className={`p-3 lg:p-4 rounded-lg border-2 transition-all duration-300 text-center ${
                                active ? 'border-white bg-white' : 'border-gray-600 bg-gray-700 hover:border-gray-400'
                              }`}
                            >
                              <div className={active ? 'text-black' : 'text-white'}>
                                <div className="text-xs lg:text-sm font-medium">{d.dayName}</div>
                                <div className="text-sm lg:text-lg font-bold">{d.display}</div>
                                {d.isToday && <div className="text-xs text-gray-400 mt-1">Today</div>}
                                {d.isTomorrow && <div className="text-xs text-gray-400 mt-1">Tomorrow</div>}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time Selection */}
                    {newDate && (
                      <div className="space-y-4">
                        <Label className="text-white text-base lg:text-lg font-semibold">Select New Time</Label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                          {timeSlots.map((t) => {
                            const active = newTime === t;
                            return (
                              <button
                                key={t}
                                onClick={() => setNewTime(t)}
                                className={`p-2 lg:p-3 rounded-lg border-2 transition-all duration-300 text-center font-medium text-sm lg:text-base ${
                                  active ? 'border-white bg-white' : 'border-gray-600 bg-gray-700 hover:border-gray-400'
                                }`}
                              >
                                <span className={active ? 'text-black' : 'text-white'}>{t}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Review */}
                {step === 3 && appointment && selectedService && (
                  <div className="space-y-6">
                    <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                      <h3 className="text-lg lg:text-xl font-bold text-white mb-6">Reschedule Summary</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-600">
                          <span className="text-gray-300">Service:</span>
                          <span className="font-semibold text-white">{selectedService.name}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-600">
                          <span className="text-gray-300">New Date:</span>
                          <span className="font-semibold text-white">{moment(newDate).format('MMMM DD, YYYY')}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-600">
                          <span className="text-gray-300">New Time:</span>
                          <span className="font-semibold text-white">{newTime}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-600">
                          <span className="text-gray-300">Duration:</span>
                          <span className="font-semibold text-white">{selectedService.duration} minutes</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-t border-gray-500">
                          <span className="text-base lg:text-lg font-semibold text-white">Total:</span>
                          <span className="text-xl lg:text-2xl font-bold text-white">${selectedService.price}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-900/30 border border-blue-700 p-6 rounded-lg">
                      <h4 className="font-semibold text-white mb-3">Heads up</h4>
                      <ul className="list-disc list-inside space-y-2 text-gray-300">
                        <li>Please arrive 10–15 minutes early</li>
                        <li>Typical wait time is 5–7 minutes</li>
                        <li>Cancellations must be made 24 hours in advance</li>
                        <li>You’ll receive a confirmation SMS or email</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 order-1 xl:order-2">
            <div className="xl:sticky xl:top-8">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Appointment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {appointment ? (
                    <>
                      <div className="p-4 bg-gray-700 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">Service</h4>
                        <p className="text-gray-300 text-sm mb-2">{selectedService?.duration} minutes</p>
                        <p className="text-xl font-bold text-white">{selectedService?.name}</p>
                        <p className="text-gray-300 mt-1">${selectedService?.price}</p>
                      </div>

                      <div className="p-4 bg-gray-700 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">Currently Scheduled</h4>
                        <p className="text-gray-300">{moment(appointment.date).format('MMMM DD, YYYY')}</p>
                        <p className="text-gray-300">{appointment.time}</p>
                      </div>

                      {newDate && (
                        <div className="p-4 bg-gray-700 rounded-lg">
                          <h4 className="font-semibold text-white mb-2">New Selection</h4>
                          <p className="text-gray-300">{moment(newDate).format('MMMM DD, YYYY')}</p>
                          <p className="text-gray-300">{newTime || '-'}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="p-4 bg-gray-700 rounded-lg">
                      <h4 className="font-semibold text-white mb-2">Verify to Load Details</h4>
                      <p className="text-gray-300 text-sm">
                        Start by verifying your phone or email to fetch your appointment.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4 z-40">
        <div className="container-max section-padding">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => {
                if (step === 1) return;
                if (step === 2) {
                  // Back to verification
                  setStep(1);
                } else if (step === 3) {
                  setStep(2);
                }
              }}
              disabled={step === 1}
              className={`${step === 1 ? 'invisible' : ''} border-gray-600`}
            >
              <span className="inline-flex items-center text-white">
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span className="font-medium">Back</span>
              </span>
            </Button>

            {step === 1 && (
              <Button
                onClick={() => setStep(2)}
                disabled={!canContinueFromStep1}
                className="bg-white hover:bg-gray-200"
              >
                <span className="inline-flex items-center text-black">
                  <span className="font-medium">Continue</span>
                  <ChevronRight className="h-4 w-4 ml-2" />
                </span>
              </Button>
            )}

            {step === 2 && (
              <Button
                onClick={() => setStep(3)}
                disabled={!canContinueFromStep2}
                className="bg-white hover:bg-gray-200"
              >
                <span className="inline-flex items-center text-black">
                  <span className="font-medium">Continue</span>
                  <ChevronRight className="h-4 w-4 ml-2" />
                </span>
              </Button>
            )}

            {step === 3 && (
              <Button onClick={handleConfirmReschedule} className="bg-white hover:bg-gray-200">
                <span className="text-black font-medium">Confirm Reschedule</span>
              </Button>
            )}

            {step === 4 && (
              <Button onClick={handleDone} className="bg-white hover:bg-gray-200">
                <span className="text-black font-medium">Done</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
