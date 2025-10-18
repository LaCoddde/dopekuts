'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Save, Store, Clock, Mail, Bell, Lock } from 'lucide-react';

export default function Settings() {
  const [businessName, setBusinessName] = useState('DopeCuts');
  const [email, setEmail] = useState('admin@dopecuts.com');
  const [phone, setPhone] = useState('(555) 123-4567');
  const [address, setAddress] = useState('123 Main Street, City, State 12345');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [bookingConfirmations, setBookingConfirmations] = useState(true);

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-sm md:text-base text-gray-400">Manage your barbershop settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Store className="h-5 w-5" />
              Business Information
            </CardTitle>
            <CardDescription className="text-gray-300">
              Update your barbershop details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="businessName" className="text-white text-sm md:text-base">Business Name</Label>
              <Input
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="mt-2 bg-gray-700 border-gray-600 text-white text-sm md:text-base"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-white text-sm md:text-base">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 bg-gray-700 border-gray-600 text-white text-sm md:text-base"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-white text-sm md:text-base">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 bg-gray-700 border-gray-600 text-white text-sm md:text-base"
              />
            </div>

            <div>
              <Label htmlFor="address" className="text-white text-sm md:text-base">Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-2 bg-gray-700 border-gray-600 text-white text-sm md:text-base"
              />
            </div>

            <Button className="w-full bg-white text-black hover:bg-gray-200 text-sm md:text-base">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4 md:space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Business Hours
              </CardTitle>
              <CardDescription className="text-gray-300">
                Set your operating hours
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { day: 'Monday', hours: '9:00 AM - 7:00 PM' },
                { day: 'Tuesday', hours: '9:00 AM - 7:00 PM' },
                { day: 'Wednesday', hours: '9:00 AM - 7:00 PM' },
                { day: 'Thursday', hours: '9:00 AM - 7:00 PM' },
                { day: 'Friday', hours: '9:00 AM - 8:00 PM' },
                { day: 'Saturday', hours: '10:00 AM - 6:00 PM' },
                { day: 'Sunday', hours: 'Closed' },
              ].map((item) => (
                <div key={item.day} className="flex items-center justify-between py-2">
                  <span className="text-sm md:text-base text-white font-medium">{item.day}</span>
                  <span className="text-xs sm:text-sm text-gray-400">{item.hours}</span>
                </div>
              ))}
              <Separator className="bg-gray-700" />
              <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-700 text-sm md:text-base">
                Edit Hours
              </Button>
            </CardContent>
          </Card>

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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="emailNotif" className="text-white text-sm md:text-base">Email Notifications</Label>
                  <p className="text-xs sm:text-sm text-gray-400">Receive booking updates via email</p>
                </div>
                <Switch
                  id="emailNotif"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <Separator className="bg-gray-700" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="smsNotif" className="text-white text-sm md:text-base">SMS Notifications</Label>
                  <p className="text-xs sm:text-sm text-gray-400">Get text messages for new bookings</p>
                </div>
                <Switch
                  id="smsNotif"
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                />
              </div>

              <Separator className="bg-gray-700" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="bookingConfirm" className="text-white text-sm md:text-base">Booking Confirmations</Label>
                  <p className="text-xs sm:text-sm text-gray-400">Auto-send confirmation emails</p>
                </div>
                <Switch
                  id="bookingConfirm"
                  checked={bookingConfirmations}
                  onCheckedChange={setBookingConfirmations}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription className="text-gray-300">
            Manage your account security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div>
              <Label htmlFor="currentPassword" className="text-white text-sm md:text-base">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Enter current password"
                className="mt-2 bg-gray-700 border-gray-600 text-white text-sm md:text-base"
              />
            </div>

            <div>
              <Label htmlFor="newPassword" className="text-white text-sm md:text-base">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                className="mt-2 bg-gray-700 border-gray-600 text-white text-sm md:text-base"
              />
            </div>
          </div>

          <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700 text-sm md:text-base">
            Update Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
