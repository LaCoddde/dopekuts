// dopekuts/app/book/page.tsx
'use client';

import { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-number-input'; // E164Number is not exported from here
import 'react-phone-number-input/style.css';
// FIX 1: Import E164Number from its correct source package
import { isValidPhoneNumber, E164Number } from 'libphonenumber-js';
import { Scissors, Calendar, Clock, User, CreditCard, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import moment from 'moment';
// FIX 2 will be to install this package. The import itself is correct.
import toast from 'react-hot-toast';

// --- API Imports ---
import { getAllServices, IService } from '@/lib/api/service';
import { getCalendarSettings, getAvailability, ICalendarSettings } from '@/lib/api/calendar';
// FIX 3: Import the 'CreateBookingData' type to ensure our payload is correct
import { createBooking, IBooking, CreateBookingData } from '@/lib/api/booking';


// --- Helper Types ---
interface AvailableDate {
  date: string;       // "YYYY-MM-DD"
  display: string;    // "MMM DD"
  dayName: string;    // "ddd"
  isToday: boolean;
  isTomorrow: boolean;
}

export default function BookAppointment() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // --- Data from API ---
  const [services, setServices] = useState<IService[]>([]);
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  
  // --- Form & UI State ---
  const [formData, setFormData] = useState({
    serviceId: '',
    date: '',
    time: '',
    phone: '',
    firstName: '',
    lastName: '',
    email: '',
    notes: '',
    // FIX 3: Changed 'later' to 'in-person' to match the API client's type definition.
    paymentMethod: 'in-person' as 'in-person' | 'now',
  });
  const [showRestOfForm, setShowRestOfForm] = useState(false);

  // --- Confirmation State ---
  const [confirmedBooking, setConfirmedBooking] = useState<IBooking | null>(null);

  // --- Initial Data Fetching ---
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoadingServices(true);
        // Fetch services and calendar settings in parallel
        const [servicesResponse, settingsResponse] = await Promise.all([
          getAllServices(),
          getCalendarSettings(),
        ]);
        setServices(servicesResponse);
        generateAvailableDates(settingsResponse);
      } catch (error) {
        toast.error('Failed to load initial booking data. Please try again.');
        console.error('Error fetching initial data:', error);
      } finally {
        setIsLoadingServices(false);
      }
    };
    fetchInitialData();
  }, []);

  // --- Fetch Availability on Date Change ---
  useEffect(() => {
    if (formData.date) {
      const fetchAvailability = async () => {
        try {
          setIsLoadingAvailability(true);
          setFormData(prev => ({ ...prev, time: '' })); // Reset time selection
          const slots = await getAvailability(formData.date);
          setTimeSlots(slots);
        } catch (error) {
          toast.error(`Failed to get available times for ${formData.date}.`);
          console.error('Error fetching availability:', error);
        } finally {
          setIsLoadingAvailability(false);
        }
      };
      fetchAvailability();
    }
  }, [formData.date]);


  // --- Helper Functions ---
  const generateAvailableDates = (settings: ICalendarSettings[]) => {
    const enabledDays = settings
      .filter(day => day.isEnabled)
      .map(day => day.dayOfWeek);

    const dayNameToIndex: { [key: string]: number } = {
      'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
      'Thursday': 4, 'Friday': 5, 'Saturday': 6
    };

    const enabledDayIndexes = enabledDays.map(dayName => dayNameToIndex[dayName]);

    const dates: AvailableDate[] = [];
    const today = moment();
    let count = 0;

    // Generate dates for the next 30 days, but only keep the first 14 available ones
    for (let i = 0; count < 14 && i < 30; i++) {
      const date = today.clone().add(i, 'days');
      if (enabledDayIndexes.includes(date.day())) {
        dates.push({
          date: date.format('YYYY-MM-DD'),
          display: date.format('MMM DD'),
          dayName: date.format('ddd'),
          isToday: date.isSame(moment(), 'day'),
          isTomorrow: date.isSame(moment().add(1, 'day'), 'day'),
        });
        count++;
      }
    }
    setAvailableDates(dates);
  };


  // --- Event Handlers ---
  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };
  
  const handlePhoneSubmit = () => {
    if (formData.phone && isValidPhoneNumber(formData.phone)) {
      setShowRestOfForm(true);
    }
  };
  
  const handleSubmit = async () => {
    setIsLoading(true);
    toast.loading('Submitting your booking...');

    try {
        // FIX 3: Construct a payload that explicitly matches the 'CreateBookingData' type.
        const payload: CreateBookingData = {
            serviceId: formData.serviceId,
            date: formData.date,
            time: formData.time,
            phone: formData.phone as E164Number, // Assert type for phone
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            notes: formData.notes,
            paymentMethod: formData.paymentMethod,
        };
        const result = await createBooking(payload);
        setConfirmedBooking(result.booking);
        toast.dismiss();
        toast.success(result.message);
    } catch (error: any) {
        toast.dismiss();
        const errorMessage = error.response?.data?.message || 'Failed to create booking.';
        toast.error(errorMessage);
        console.error('Booking submission error:', error);
    } finally {
        setIsLoading(false);
    }
  };

  const handleBookingComplete = () => {
    // Reset state to allow for a new booking
    setStep(1);
    setConfirmedBooking(null);
    setFormData({
        serviceId: '',
        date: '',
        time: '',
        phone: '',
        firstName: '',
        lastName: '',
        email: '',
        notes: '',
        paymentMethod: 'in-person', // FIX 3: Reset to the correct default value
    });
    setShowRestOfForm(false);
  };

  const selectedService = services.find((s) => s._id === formData.serviceId);

  // --- Confirmation Screen (No changes needed here) ---
  if (confirmedBooking) {
    const isPending = confirmedBooking.status === 'pending';
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="container-max section-padding py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 lg:p-12">
              <div className="mb-8">
                <div className={`w-20 h-20 ${isPending ? 'bg-yellow-500' : 'bg-green-500'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    {isPending ? (
                        <Clock className="w-10 h-10 text-white" />
                    ) : (
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                    {isPending ? 'Booking Pending' : 'Booking Confirmed!'}
                </h1>
                <p className="text-lg text-gray-300 mb-8">
                    {isPending 
                        ? "Your appointment is reserved! Please complete the payment to confirm."
                        : "Your appointment has been successfully booked. We'll send a confirmation email shortly."
                    }
                </p>
              </div>

              {isPending && (
                <div className="bg-gray-700 p-6 rounded-lg border border-gray-600 mb-8 text-left">
                    <h3 className="text-lg font-bold text-white mb-4">Complete Your Payment</h3>
                    <p className="text-gray-300 mb-4">To confirm your booking, please send an Interac e-Transfer with the following details:</p>
                    <div className="space-y-2 text-sm">
                        <p><strong className="text-gray-200">Recipient Email:</strong> roy@dopecuts.ca</p>
                        <p><strong className="text-gray-200">Amount:</strong> ${selectedService?.price}</p>
                        <p><strong className="text-gray-200">Message/Note:</strong> Booking for {confirmedBooking.firstName}</p>
                    </div>
                     <p className="text-xs text-gray-400 mt-4">Your booking will be automatically confirmed once payment is received.</p>
                </div>
              )}

              <div className="bg-gray-700 p-6 rounded-lg border border-gray-600 mb-8">
                <h3 className="text-lg font-bold text-white mb-4">Appointment Details</h3>
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Service:</span>
                    <span className="text-white font-medium">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Date:</span>
                    <span className="text-white font-medium">
                      {confirmedBooking.date && moment(confirmedBooking.date).format('MMMM DD, YYYY')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Time:</span>
                    <span className="text-white font-medium">{confirmedBooking.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Customer:</span>
                    <span className="text-white font-medium">{confirmedBooking.firstName} {confirmedBooking.lastName}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-600 pt-3">
                    <span className="text-gray-300">Total:</span>
                    <span className="text-white font-bold text-lg">${selectedService?.price}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handleBookingComplete}
                  className="w-full bg-white text-black hover:bg-gray-200 py-3"
                >
                  Book Another Appointment
                </Button>
                <p className="text-sm text-gray-400">
                  You will receive an email confirmation within the next few minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Main Booking Form ---
  return (
    <div className="min-h-screen bg-gray-900 pb-24">
      {/* Header Section */}
      <div className="bg-black border-b border-gray-800">
        <div className="container-max section-padding py-12 lg:py-16">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Book Your Appointment
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Schedule your visit with our master barbers in just a few simple steps
            </p>
          </div>
        </div>
      </div>

      <div className="container-max section-padding py-8 lg:py-12">
        <div className="w-full">
          {/* Progress Indicator */}
          <div className="flex justify-center mb-8 lg:mb-12">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`w-8 h-8 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-xs lg:text-sm font-bold transition-all duration-300 ${
                      step >= stepNumber
                        ? 'bg-white text-black shadow-lg'
                        : 'bg-gray-700 text-gray-400 border-2 border-gray-600'
                    }`}
                  >
                    {stepNumber}
                  </div>
                  {stepNumber < 4 && (
                    <div
                      className={`w-8 lg:w-16 h-1 transition-all duration-300 ${
                        step > stepNumber ? 'bg-white' : 'bg-gray-700'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="xl:col-span-2 order-2 xl:order-1">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white text-xl lg:text-2xl">
                    {step === 1 && <><Scissors className="h-6 w-6" /> Select Service</>}
                    {step === 2 && <><Calendar className="h-6 w-6" /> Choose Date & Time</>}
                    {step === 3 && <><User className="h-6 w-6" /> Your Information</>}
                    {step === 4 && <><CreditCard className="h-6 w-6" /> Confirmation</>}
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-base lg:text-lg">
                    {step === 1 && 'Choose the service you would like to book'}
                    {step === 2 && 'Select your preferred date and time'}
                    {step === 3 && 'Please provide your contact information'}
                    {step === 4 && 'Review and confirm your booking'}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 lg:space-y-8">
                  {/* Step 1: Service Selection */}
                  {step === 1 && (
                    isLoadingServices ? (
                        <div className="flex justify-center items-center h-48">
                            <Loader2 className="h-8 w-8 text-white animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <RadioGroup
                                value={formData.serviceId}
                                onValueChange={(value) => setFormData({ ...formData, serviceId: value })}
                            >
                                {services.map((service) => (
                                <div
                                    key={service._id}
                                    className={`relative p-4 lg:p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:bg-gray-700 ${
                                    formData.serviceId === service._id
                                        ? 'border-white bg-gray-700'
                                        : 'border-gray-600 bg-gray-800'
                                    }`}
                                >
                                    <RadioGroupItem
                                    value={service._id}
                                    id={service._id}
                                    className="absolute top-4 right-4 lg:top-6 lg:right-6"
                                    />
                                    <Label htmlFor={service._id} className="cursor-pointer block">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                        <h3 className="text-lg lg:text-xl font-bold text-white mb-2">{service.name}</h3>
                                        <p className="text-sm lg:text-base text-gray-300 mb-2">Duration: {service.duration} minutes</p>
                                        </div>
                                        <div className="text-right">
                                        <div className="text-xl lg:text-2xl font-bold text-white">${service.price}</div>
                                        </div>
                                    </div>
                                    </Label>
                                </div>
                                ))}
                            </RadioGroup>
                        </div>
                    )
                  )}

                  {/* Step 2: Date & Time Selection */}
                  {step === 2 && (
                    <div className="space-y-6 lg:space-y-8">
                        <div>
                            <Label className="text-white text-base lg:text-lg font-semibold mb-4 block">Select Date</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                            {availableDates.map((dateObj) => (
                                <button
                                key={dateObj.date}
                                onClick={() => setFormData({ ...formData, date: dateObj.date })}
                                className={`p-3 lg:p-4 rounded-lg border-2 transition-all duration-300 text-center ${
                                    formData.date === dateObj.date
                                    ? 'border-white bg-white text-black'
                                    : 'border-gray-600 bg-gray-700 text-white hover:border-gray-400'
                                }`}
                                >
                                <div className="text-xs lg:text-sm font-medium">{dateObj.dayName}</div>
                                <div className="text-sm lg:text-lg font-bold">{dateObj.display}</div>
                                {dateObj.isToday && <div className="text-xs text-gray-400 mt-1">Today</div>}
                                {dateObj.isTomorrow && <div className="text-xs text-gray-400 mt-1">Tomorrow</div>}
                                </button>
                            ))}
                            </div>
                        </div>

                        {formData.date && (
                            isLoadingAvailability ? (
                                <div className="flex justify-center items-center h-32">
                                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                                </div>
                            ) : (
                                <div>
                                    <Label className="text-white text-base lg:text-lg font-semibold mb-4 block">Select Time</Label>
                                    {timeSlots.length > 0 ? (
                                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                                            {timeSlots.map((time) => (
                                            <button
                                                key={time}
                                                onClick={() => setFormData({ ...formData, time })}
                                                className={`p-2 lg:p-3 rounded-lg border-2 transition-all duration-300 text-center font-medium text-sm lg:text-base ${
                                                formData.time === time
                                                    ? 'border-white bg-white text-black'
                                                    : 'border-gray-600 bg-gray-700 text-white hover:border-gray-400'
                                                }`}
                                            >
                                                {time}
                                            </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-400 bg-gray-700 p-4 rounded-lg">
                                            No available slots for this day. Please select another date.
                                        </div>
                                    )}
                                </div>
                            )
                        )}
                    </div>
                  )}

                  {/* Step 3: Customer Information */}
                  {step === 3 && (
                    <div className="space-y-8">
                      <div>
                        <Label htmlFor="phone" className="text-white font-medium text-lg">Phone Number</Label>
                        <p className="text-gray-400 text-sm mt-1 mb-4">Please enter your phone number to continue</p>
                        <div className="space-y-4">
                          <PhoneInput
                            international
                            defaultCountry="CA"
                            value={formData.phone}
                            onChange={(value) => setFormData({ ...formData, phone: value || '' })}
                            className="phone-input"
                          />
                          {formData.phone && !isValidPhoneNumber(formData.phone) && (
                            <p className="text-red-400 text-sm">Please enter a valid phone number</p>
                          )}
                          {formData.phone && isValidPhoneNumber(formData.phone) && !showRestOfForm && (
                            <Button
                              onClick={handlePhoneSubmit}
                              className="bg-white text-black hover:bg-gray-200"
                            >
                              Continue
                            </Button>
                          )}
                        </div>
                      </div>

                      {showRestOfForm && (
                        <div className="space-y-6 border-t border-gray-700 pt-8">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                              <Label htmlFor="firstName" className="text-white font-medium">First Name</Label>
                              <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className="mt-2 bg-gray-700 border-gray-600 text-white"
                                placeholder="Enter your first name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="lastName" className="text-white font-medium">Last Name</Label>
                              <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                className="mt-2 bg-gray-700 border-gray-600 text-white"
                                placeholder="Enter your last name"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="email" className="text-white font-medium">Email Address</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="mt-2 bg-gray-700 border-gray-600 text-white"
                              placeholder="Enter your email address"
                            />
                          </div>
                          <div>
                            <Label htmlFor="notes" className="text-white font-medium">Special Requests (Optional)</Label>
                            <Textarea
                              id="notes"
                              value={formData.notes}
                              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                              placeholder="Any special requests or notes for your barber..."
                              className="mt-2 bg-gray-700 border-gray-600 text-white min-h-[100px]"
                            />
                          </div>
                          <div>
                            <Label className="text-white font-medium mb-4 block">Payment Option</Label>
                            <RadioGroup
                              value={formData.paymentMethod}
                              onValueChange={(value) => setFormData({ ...formData, paymentMethod: value as 'in-person' | 'now' })}
                              className="space-y-3"
                            >
                              <div className="flex items-center space-x-3 p-4 border border-gray-600 rounded-lg">
                                {/* FIX 3: Changed value to 'in-person' */}
                                <RadioGroupItem value="in-person" id="in-person" />
                                <Label htmlFor="in-person" className="text-white cursor-pointer">
                                  Pay at Appointment
                                </Label>
                              </div>
                              <div className="flex items-center space-x-3 p-4 border border-gray-600 rounded-lg">
                                <RadioGroupItem value="now" id="now" />
                                <Label htmlFor="now" className="text-white cursor-pointer">
                                  Pay Now (Interac e-Transfer)
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 4: Confirmation (No changes needed here) */}
                  {step === 4 && (
                    <div className="space-y-6">
                      <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                        <h3 className="text-lg lg:text-xl font-bold text-white mb-6">Booking Summary</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center py-2 border-b border-gray-600">
                            <span className="text-gray-300">Service:</span>
                            <span className="font-semibold text-white">{selectedService?.name}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-600">
                            <span className="text-gray-300">Date:</span>
                            <span className="font-semibold text-white">
                              {formData.date && moment(formData.date).format('MMMM DD, YYYY')}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-600">
                            <span className="text-gray-300">Time:</span>
                            <span className="font-semibold text-white">{formData.time}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-600">
                            <span className="text-gray-300">Duration:</span>
                            <span className="font-semibold text-white">
                              {selectedService?.duration} minutes
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-3 border-t border-gray-500">
                            <span className="text-base lg:text-lg font-semibold text-white">Total:</span>
                            <span className="text-xl lg:text-2xl font-bold text-white">
                              ${selectedService?.price}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-blue-900/30 border border-blue-700 p-6 rounded-lg">
                        <h4 className="font-semibold text-white mb-3">Important Information:</h4>
                        <ul className="list-disc list-inside space-y-2 text-gray-300">
                            <li>Please arrive 5-10 minutes before your appointment</li>
                            <li>Cancellations must be made 24 hours in advance</li>
                            <li>You will receive an email confirmation shortly</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar (No changes needed here) */}
            <div className="xl:col-span-1 order-1 xl:order-2">
              <div className="xl:sticky xl:top-8">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Booking Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedService ? (
                      <div className="p-4 bg-gray-700 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">{selectedService.name}</h4>
                        <p className="text-gray-300 text-sm mb-2">{selectedService.duration} minutes</p>
                        <p className="text-xl font-bold text-white">${selectedService.price}</p>
                      </div>
                    ) : (
                         <div className="p-4 bg-gray-700 rounded-lg text-gray-400">Select a service to begin.</div>
                    )}
                    
                    {formData.date && (
                      <div className="p-4 bg-gray-700 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">Date</h4>
                        <p className="text-gray-300">{moment(formData.date).format('MMMM DD, YYYY')}</p>
                      </div>
                    )}
                    
                    {formData.time && (
                      <div className="p-4 bg-gray-700 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">Time</h4>
                        <p className="text-gray-300">{formData.time}</p>
                      </div>
                    )}

                    <div className="p-4 bg-gray-700 rounded-lg">
                      <h4 className="font-semibold text-white mb-2">Contact Info</h4>
                      <p className="text-gray-300 text-sm">📍 646 Upper James Street, Hamilton ON, L9C 2Z2</p>
                      <p className="text-gray-300 text-sm">📞 (365) 323-3680</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Navigation Buttons (No changes needed here) */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4 z-40">
        <div className="container-max section-padding">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1 || isLoading}
              className={`${step === 1 ? 'invisible' : ''} border-gray-600 text-white hover:bg-gray-700`}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {step < 4 ? (
              <Button
                onClick={handleNext}
                disabled={
                  (step === 1 && !formData.serviceId) ||
                  (step === 2 && (!formData.date || !formData.time)) ||
                  (step === 3 &&
                    (!formData.phone ||
                      !isValidPhoneNumber(formData.phone) ||
                      !showRestOfForm ||
                      !formData.firstName ||
                      !formData.lastName ||
                      !formData.email))
                }
                className="bg-white text-black hover:bg-gray-200"
              >
                Continue
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-white text-black hover:bg-gray-200 w-48"
              >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    'Confirm Booking'
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}