'use client';

import { useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { Scissors, Calendar, Clock, User, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
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

const services = [
  { id: 'classic', name: 'Classic Cut', price: 35, duration: 45 },
  { id: 'beard', name: 'Beard Grooming', price: 25, duration: 30 },
  { id: 'premium', name: 'Premium Package', price: 65, duration: 90 },
  { id: 'express', name: 'Express Service', price: 25, duration: 20 },
];

// Generate time slots with 30-minute intervals
const generateTimeSlots = () => {
  const slots = [];
  const startTime = moment().hour(9).minute(0); // 9:00 AM
  const endTime = moment().hour(18).minute(0); // 6:00 PM
  
  let current = startTime.clone();
  while (current.isBefore(endTime)) {
    slots.push(current.format('h:mm A'));
    current.add(30, 'minutes');
  }
  return slots;
};

// Generate available dates (2 weeks in advance)
const generateAvailableDates = () => {
  const dates = [];
  const today = moment();
  
  for (let i = 0; i < 14; i++) {
    const date = today.clone().add(i, 'days');
    // Skip Sundays (assuming closed on Sundays)
    if (date.day() !== 0) {
      dates.push({
        date: date.format('YYYY-MM-DD'),
        display: date.format('MMM DD'),
        dayName: date.format('ddd'),
        isToday: i === 0,
        isTomorrow: i === 1
      });
    }
  }
  return dates;
};

export default function BookAppointment() {
  const [step, setStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [timeSlots] = useState(generateTimeSlots());
  const [availableDates] = useState(generateAvailableDates());
  const [showInteracDetails, setShowInteracDetails] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentData, setPaymentData] = useState({
    email: '',
    amount: '',
    name: ''
  });
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    time: '',
    phone: '',
    firstName: '',
    lastName: '',
    email: '',
    notes: '',
    paymentMethod: 'later',
  });
  const [showRestOfForm, setShowRestOfForm] = useState(false);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    console.log('Booking submitted:', formData);
    setShowConfirmation(true);
  };

  const handlePhoneSubmit = () => {
    if (formData.phone && isValidPhoneNumber(formData.phone)) {
      setShowRestOfForm(true);
    }
  };

  const handleInteracPayment = () => {
    setShowInteracDetails(true);
  };

  const handleConfirmPayment = () => {
    setShowPaymentForm(true);
    setShowInteracDetails(false);
  };

  const handleFinalConfirm = () => {
    console.log('Payment confirmed:', paymentData);
    // Process payment here
    setShowPaymentForm(false);
    setShowConfirmation(true);
  };

  const handleBookingComplete = () => {
    console.log('Booking completed:', formData);
    // Here you would typically redirect to a success page or reset the form
    setShowConfirmation(false);
    // Reset form or redirect as needed
  };

  const selectedService = services.find((s) => s.id === formData.service);

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="container-max section-padding py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 lg:p-12">
              <div className="mb-8">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  Booking Confirmed!
                </h1>
                <p className="text-lg text-gray-300 mb-8">
                  Your appointment has been successfully booked. We'll send you a confirmation SMS shortly.
                </p>
              </div>

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
                      {formData.date && moment(formData.date).format('MMMM DD, YYYY')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Time:</span>
                    <span className="text-white font-medium">{formData.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Customer:</span>
                    <span className="text-white font-medium">{formData.firstName} {formData.lastName}</span>
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
                  Done
                </Button>
                <p className="text-sm text-gray-400">
                  You will receive an SMS confirmation within the next few minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                    {step === 1 && (
                      <>
                        <Scissors className="h-6 w-6" /> Select Service
                      </>
                    )}
                    {step === 2 && (
                      <>
                        <Calendar className="h-6 w-6" /> Choose Date & Time
                      </>
                    )}
                    {step === 3 && (
                      <>
                        <User className="h-6 w-6" /> Your Information
                      </>
                    )}
                    {step === 4 && (
                      <>
                        <CreditCard className="h-6 w-6" /> Confirmation
                      </>
                    )}
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
                    <div className="space-y-4">
                      <RadioGroup
                        value={formData.service}
                        onValueChange={(value) =>
                          setFormData({ ...formData, service: value })
                        }
                      >
                        {services.map((service) => (
                          <div
                            key={service.id}
                            className={`relative p-4 lg:p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:bg-gray-700 ${
                              formData.service === service.id
                                ? 'border-white bg-gray-700'
                                : 'border-gray-600 bg-gray-800'
                            }`}
                          >
                            <RadioGroupItem 
                              value={service.id} 
                              id={service.id}
                              className="absolute top-4 right-4 lg:top-6 lg:right-6"
                            />
                            <Label htmlFor={service.id} className="cursor-pointer block">
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
                  )}

                  {/* Step 2: Date & Time Selection */}
                  {step === 2 && (
                    <div className="space-y-6 lg:space-y-8">
                      {/* Date Selection */}
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
                              {dateObj.isToday && (
                                <div className="text-xs text-gray-400 mt-1">Today</div>
                              )}
                              {dateObj.isTomorrow && (
                                <div className="text-xs text-gray-400 mt-1">Tomorrow</div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Time Selection */}
                      {formData.date && (
                        <div>
                          <Label className="text-white text-base lg:text-lg font-semibold mb-4 block">Select Time</Label>
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
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 3: Customer Information */}
                  {step === 3 && (
                    <div className="space-y-8">
                      {/* Phone Number Field First */}
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
                            style={{
                              '--PhoneInputCountryFlag-height': '1em',
                              '--PhoneInputCountrySelectArrow-color': '#9CA3AF',
                              '--PhoneInput-color--focus': '#FFFFFF',
                            }}
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

                      {/* Rest of the form - only show after phone validation */}
                      {showRestOfForm && (
                        <div className="space-y-6 border-t border-gray-700 pt-8">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                              <Label htmlFor="firstName" className="text-white font-medium">First Name</Label>
                              <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) =>
                                  setFormData({ ...formData, firstName: e.target.value })
                                }
                                className="mt-2 bg-gray-700 border-gray-600 text-white"
                                placeholder="Enter your first name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="lastName" className="text-white font-medium">Last Name</Label>
                              <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) =>
                                  setFormData({ ...formData, lastName: e.target.value })
                                }
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
                              onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                              }
                              className="mt-2 bg-gray-700 border-gray-600 text-white"
                              placeholder="Enter your email address"
                            />
                          </div>

                          <div>
                            <Label htmlFor="notes" className="text-white font-medium">Special Requests (Optional)</Label>
                            <Textarea
                              id="notes"
                              value={formData.notes}
                              onChange={(e) =>
                                setFormData({ ...formData, notes: e.target.value })
                              }
                              placeholder="Any special requests or notes for your barber..."
                              className="mt-2 bg-gray-700 border-gray-600 text-white min-h-[100px]"
                            />
                          </div>

                          <div>
                            <Label className="text-white font-medium mb-4 block">Payment Option</Label>
                            <RadioGroup
                              value={formData.paymentMethod}
                              onValueChange={(value) =>
                                setFormData({ ...formData, paymentMethod: value })
                              }
                              className="space-y-3"
                            >
                              <div className="flex items-center space-x-3 p-4 border border-gray-600 rounded-lg">
                                <RadioGroupItem value="later" id="later" />
                                <Label htmlFor="later" className="text-white cursor-pointer">
                                  Pay at Appointment
                                </Label>
                              </div>
                              <div className="flex items-center space-x-3 p-4 border border-gray-600 rounded-lg">
                                <RadioGroupItem value="now" id="now" />
                                <Label htmlFor="now" className="text-white cursor-pointer">
                                  Pay Now Online
                                </Label>
                              </div>
                              {formData.paymentMethod === 'now' && (
                                <div className="ml-6 mt-4 space-y-3">
                                  <Button 
                                    onClick={handleInteracPayment}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    Pay with Interac
                                  </Button>
                                </div>
                              )}
                            </RadioGroup>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 4: Confirmation */}
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
                          <li>Please arrive 10-15 minutes before your appointment</li>
                          <li>Typical wait time is 5-7 minutes</li>
                          <li>Cancellations must be made 24 hours in advance</li>
                          <li>You will receive SMS confirmation shortly</li>
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
                  <CardTitle className="text-white">Booking Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedService && (
                    <div className="p-4 bg-gray-700 rounded-lg">
                      <h4 className="font-semibold text-white mb-2">{selectedService.name}</h4>
                      <p className="text-gray-300 text-sm mb-2">{selectedService.duration} minutes</p>
                      <p className="text-xl font-bold text-white">${selectedService.price}</p>
                    </div>
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
                    <p className="text-gray-300 text-sm">📍 123 Main Street, Downtown</p>
                    <p className="text-gray-300 text-sm">📞 (555) 123-4567</p>
                  </div>
                </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4 z-40">
        <div className="container-max section-padding">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className={`${step === 1 ? 'invisible' : ''} border-gray-600 text-white hover:bg-gray-700`}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {step < 4 ? (
              <Button
                onClick={handleNext}
                disabled={
                  (step === 1 && !formData.service) ||
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
                onClick={formData.paymentMethod === 'now' ? handleInteracPayment : handleSubmit}
                className="bg-white text-black hover:bg-gray-200"
              >
                {formData.paymentMethod === 'now' ? 'Pay Now' : 'Confirm Booking'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Interac Payment Modal */}
      {showInteracDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-gray-800 border-gray-700 w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-white">Interac e-Transfer Payment</CardTitle>
              <CardDescription className="text-gray-300">
                Send your payment via Interac e-Transfer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2">Payment Details</h4>
                <p className="text-gray-300 text-sm mb-1">
                  <strong>Email:</strong> payments@dopecuts.com
                </p>
                <p className="text-gray-300 text-sm mb-1">
                  <strong>Amount:</strong> ${selectedService?.price}
                </p>
                <p className="text-gray-300 text-sm">
                  <strong>Message:</strong> Booking for {formData.firstName} {formData.lastName}
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={handleConfirmPayment}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Confirm Payment
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowInteracDetails(false)}
                  className="flex-1 border-gray-600 text-white hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Payment Confirmation Form */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-gray-800 border-gray-700 w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-white">Confirm Payment Details</CardTitle>
              <CardDescription className="text-gray-300">
                Please enter the details used for your Interac e-Transfer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="paymentEmail" className="text-white font-medium">Email Used for Transfer</Label>
                <Input
                  id="paymentEmail"
                  type="email"
                  value={paymentData.email}
                  onChange={(e) => setPaymentData({ ...paymentData, email: e.target.value })}
                  className="mt-2 bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter email used for transfer"
                />
              </div>
              <div>
                <Label htmlFor="paymentAmount" className="text-white font-medium">Amount Sent</Label>
                <Input
                  id="paymentAmount"
                  type="number"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                  className="mt-2 bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter amount sent"
                />
              </div>
              <div>
                <Label htmlFor="paymentName" className="text-white font-medium">Name on Transfer</Label>
                <Input
                  id="paymentName"
                  value={paymentData.name}
                  onChange={(e) => setPaymentData({ ...paymentData, name: e.target.value })}
                  className="mt-2 bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter name used for transfer"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleFinalConfirm}
                  disabled={!paymentData.email || !paymentData.amount || !paymentData.name}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Confirm
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowPaymentForm(false)}
                  className="flex-1 border-gray-600 text-white hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}