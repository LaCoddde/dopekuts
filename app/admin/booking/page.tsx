'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, User, Phone, Search, CreditCard as Edit, X, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Filter, ArrowUpDown } from 'lucide-react';
import moment from 'moment';

// Mock booking data
const mockBookings = [
  {
    id: 1,
    customerName: 'John Doe',
    phone: '(555) 123-4567',
    email: 'john@email.com',
    service: 'Classic Cut',
    date: '2025-01-20',
    time: '10:00 AM',
    duration: 45,
    price: 35,
    status: 'confirmed',
    notes: 'Regular customer, prefers shorter on sides'
  },
  {
    id: 2,
    customerName: 'Mike Smith',
    phone: '(555) 234-5678',
    email: 'mike@email.com',
    service: 'Beard Grooming',
    date: '2025-01-20',
    time: '11:30 AM',
    duration: 30,
    price: 25,
    status: 'pending',
    notes: 'First time customer'
  },
  {
    id: 3,
    customerName: 'David Wilson',
    phone: '(555) 345-6789',
    email: 'david@email.com',
    service: 'Premium Package',
    date: '2025-01-20',
    time: '2:00 PM',
    duration: 90,
    price: 65,
    status: 'confirmed',
    notes: 'Wedding next week, wants premium styling'
  },
  {
    id: 4,
    customerName: 'Chris Brown',
    phone: '(555) 456-7890',
    email: 'chris@email.com',
    service: 'Express Service',
    date: '2025-01-21',
    time: '9:00 AM',
    duration: 20,
    price: 25,
    status: 'confirmed',
    notes: ''
  },
  {
    id: 5,
    customerName: 'Alex Johnson',
    phone: '(555) 567-8901',
    email: 'alex@email.com',
    service: 'Classic Cut',
    date: '2025-01-21',
    time: '3:30 PM',
    duration: 45,
    price: 35,
    status: 'pending',
    notes: 'Requested specific barber - Marcus'
  },
  {
    id: 6,
    customerName: 'Sarah Williams',
    phone: '(555) 678-9012',
    email: 'sarah@email.com',
    service: 'Premium Package',
    date: '2025-01-22',
    time: '1:00 PM',
    duration: 90,
    price: 65,
    status: 'confirmed',
    notes: 'Anniversary dinner tonight'
  },
  {
    id: 7,
    customerName: 'Tom Anderson',
    phone: '(555) 789-0123',
    email: 'tom@email.com',
    service: 'Classic Cut',
    date: '2025-01-22',
    time: '4:30 PM',
    duration: 45,
    price: 35,
    status: 'cancelled',
    notes: 'Customer called to cancel - family emergency'
  },
  {
    id: 8,
    customerName: 'Emily Davis',
    phone: '(555) 890-1234',
    email: 'emily@email.com',
    service: 'Beard Grooming',
    date: '2025-01-23',
    time: '10:30 AM',
    duration: 30,
    price: 25,
    status: 'pending',
    notes: ''
  },
  {
    id: 9,
    customerName: 'Robert Martinez',
    phone: '(555) 901-2345',
    email: 'robert@email.com',
    service: 'Express Service',
    date: '2025-01-23',
    time: '2:15 PM',
    duration: 20,
    price: 25,
    status: 'confirmed',
    notes: 'Lunch break appointment'
  },
  {
    id: 10,
    customerName: 'Jennifer Taylor',
    phone: '(555) 012-3456',
    email: 'jennifer@email.com',
    service: 'Premium Package',
    date: '2025-01-24',
    time: '11:00 AM',
    duration: 90,
    price: 65,
    status: 'pending',
    notes: 'Job interview preparation'
  }
];

export default function BookingManagement() {
  const [bookings, setBookings] = useState(mockBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'time' | 'customer' | 'service'>('date');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'custom'>('all');
  const [customDate, setCustomDate] = useState(moment().format('YYYY-MM-DD'));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Confirmed
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <X className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleStatusChange = (bookingId: number, newStatus: 'confirmed' | 'cancelled') => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: newStatus }
        : booking
    ));
  };

  const handleReschedule = (bookingId: number) => {
    alert(`Reschedule booking #${bookingId} - This would open a date/time picker modal`);
  };

  const filteredAndSortedBookings = (() => {
    let filtered = bookings.filter(booking => {
      const matchesSearch = booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           booking.phone.includes(searchTerm) ||
                           booking.service.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

      let matchesDate = true;
      if (dateFilter === 'today') {
        matchesDate = moment(booking.date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD');
      } else if (dateFilter === 'week') {
        matchesDate = moment(booking.date).isBetween(moment(), moment().add(7, 'days'), 'day', '[]');
      } else if (dateFilter === 'custom') {
        matchesDate = moment(booking.date).format('YYYY-MM-DD') === customDate;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return moment(a.date).valueOf() - moment(b.date).valueOf();
        case 'time':
          const timeA = moment(a.time, 'h:mm A').valueOf();
          const timeB = moment(b.time, 'h:mm A').valueOf();
          return timeA - timeB;
        case 'customer':
          return a.customerName.localeCompare(b.customerName);
        case 'service':
          return a.service.localeCompare(b.service);
        default:
          return 0;
      }
    });

    return filtered;
  })();

  const todayBookings = bookings.filter(booking => 
    moment(booking.date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')
  );

  const upcomingBookings = bookings.filter(booking => 
    moment(booking.date).isAfter(moment(), 'day')
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Booking Management</h1>
        <p className="text-sm md:text-base text-gray-400">View and manage customer appointments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-300">Today's Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{todayBookings.length}</div>
            <p className="text-sm text-gray-400">
              {todayBookings.filter(b => b.status === 'confirmed').length} confirmed
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-300">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{upcomingBookings.length}</div>
            <p className="text-sm text-gray-400">Next 7 days</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-300">Revenue Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              ${todayBookings.reduce((sum, booking) => sum + booking.price, 0)}
            </div>
            <p className="text-sm text-gray-400">Estimated</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Manage Bookings</CardTitle>
          <CardDescription className="text-gray-300">
            View and manage customer appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, phone, or service..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Date Filter</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as 'all' | 'today' | 'week' | 'custom')}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm"
                >
                  <option value="all">All Dates</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="custom">Custom Date</option>
                </select>
              </div>

              {dateFilter === 'custom' && (
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Select Date</label>
                  <Input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              )}

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'confirmed' | 'pending' | 'cancelled')}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'time' | 'customer' | 'service')}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm"
                >
                  <option value="date">Date</option>
                  <option value="time">Time</option>
                  <option value="customer">Customer Name</option>
                  <option value="service">Service Type</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 mb-2">
            <p className="text-sm text-gray-400">
              Showing {filteredAndSortedBookings.length} booking{filteredAndSortedBookings.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {filteredAndSortedBookings.length === 0 ? (
              <div className="text-center py-8 md:py-12 text-gray-400">
                <Calendar className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm md:text-base">No bookings found for the selected criteria</p>
              </div>
            ) : (
              filteredAndSortedBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-gray-700 border border-gray-600 rounded-lg p-3 sm:p-4 lg:p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Booking Info */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 md:mb-3">
                        <h3 className="text-base md:text-lg font-semibold text-white">
                          {booking.customerName}
                        </h3>
                        {getStatusBadge(booking.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 text-xs sm:text-sm">
                        <div className="flex items-center text-gray-300">
                          <User className="h-4 w-4 mr-2" />
                          {booking.service}
                        </div>
                        <div className="flex items-center text-gray-300">
                          <Calendar className="h-4 w-4 mr-2" />
                          {moment(booking.date).format('MMM DD, YYYY')}
                        </div>
                        <div className="flex items-center text-gray-300">
                          <Clock className="h-4 w-4 mr-2" />
                          {booking.time} ({booking.duration}min)
                        </div>
                        <div className="flex items-center text-gray-300">
                          <Phone className="h-4 w-4 mr-2" />
                          {booking.phone}
                        </div>
                      </div>
                      
                      {booking.notes && (
                        <div className="mt-2 md:mt-3 p-2 md:p-3 bg-gray-800 rounded-md">
                          <p className="text-xs sm:text-sm text-gray-300">
                            <strong>Notes:</strong> {booking.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 lg:w-36 pt-3 lg:pt-0 border-t lg:border-t-0 lg:border-l border-gray-600 lg:pl-4">
                      {booking.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(booking.id, 'confirmed')}
                          className="bg-green-600 hover:bg-green-700 text-white w-full"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Confirm
                        </Button>
                      )}

                      {booking.status !== 'cancelled' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReschedule(booking.id)}
                            className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white w-full"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Reschedule
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(booking.id, 'cancelled')}
                            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white w-full"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </>
                      )}

                      {booking.status === 'cancelled' && (
                        <Badge variant="secondary" className="text-center py-2">
                          No Actions
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}