// dopekuts/app/admin/booking/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, User, Phone, Search, CreditCard as Edit, X, CircleCheck as CheckCircle, CircleAlert as AlertCircle, PlusCircle } from 'lucide-react';
import moment from 'moment';
import { getAllBookings, confirmPayment, cancelBooking, IBooking } from '@/lib/api/booking';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import BookAppointmentPage from '@/app/book/page';

export default function BookingManagement() {
  // State for storing bookings, loading status, and errors from the API
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for the create booking modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // State for filtering and sorting UI controls
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'time' | 'customer' | 'service'>('date');
  const [monthFilter, setMonthFilter] = useState(moment().format('YYYY-MM')); // Default to current month

  // Extracted function to fetch bookings
  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const fetchedBookings = await getAllBookings();
      setBookings(fetchedBookings);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setError("Could not load booking data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch all bookings from the API when the component mounts
  useEffect(() => {
    fetchBookings();
  }, []);

  // When the modal's open state changes, if it's closing, we refetch the bookings
  const handleModalOpenChange = (open: boolean) => {
    setIsCreateModalOpen(open);
    if (!open) {
      fetchBookings();
    }
  };

  // Function to generate status badges based on booking status
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

  // API handler to confirm a booking
  const handleConfirmBooking = async (bookingId: string) => {
    try {
      const { booking: updatedBooking } = await confirmPayment(bookingId);
      // Update the local state for immediate UI feedback
      setBookings(bookings.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: updatedBooking.status } 
          : booking
      ));
    } catch (error) {
      console.error("Failed to confirm booking:", error);
      alert("Error: Could not confirm the booking.");
    }
  };

  // API handler to cancel a booking
  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await cancelBooking(bookingId);
      // Update the local state for immediate UI feedback
      setBookings(bookings.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: 'cancelled' } 
          : booking
      ));
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      alert("Error: Could not cancel the booking.");
    }
  };
  
  const handleReschedule = (bookingId: string) => {
    alert(`Reschedule booking #${bookingId} - This would open a date/time picker modal`);
  };

  // Get a list of available months from bookings to populate filter
  const availableMonths = useMemo(() => {
    const monthSet = new Set<string>();
    bookings.forEach(booking => {
      monthSet.add(moment(booking.date).format('YYYY-MM'));
    });
    // Ensure current month is always an option
    monthSet.add(moment().format('YYYY-MM'));
    
    return Array.from(monthSet).sort().reverse(); // Newest first
  }, [bookings]);

  // Memoized calculation for filtered and sorted bookings
  const filteredAndSortedBookings = (() => {
    let filtered = bookings.filter(booking => {
      const customerFullName = `${booking.firstName} ${booking.lastName}`;
      const matchesSearch = customerFullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           booking.phone.includes(searchTerm) ||
                           booking.service.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      
      let matchesDate = true;
      if (monthFilter !== 'all') {
        const isCurrentMonth = moment(monthFilter, 'YYYY-MM').isSame(moment(), 'month');
        
        if (isCurrentMonth) {
          // Filter from today to end of month
          matchesDate = moment(booking.date).isBetween(
            moment().startOf('day'), 
            moment().endOf('month'), 
            'day', 
            '[]' // inclusive
          );
        } else {
          // Filter for the entire selected month
          matchesDate = moment(booking.date).isSame(monthFilter, 'month');
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
            const dateComparison = moment(a.date).valueOf() - moment(b.date).valueOf();
            if (dateComparison !== 0) return dateComparison;
            // If dates are the same, sort by time DESCENDING
            return moment(b.time, 'h:mm A').valueOf() - moment(a.time, 'h:mm A').valueOf();
        case 'time':
          return moment(a.time, 'h:mm A').valueOf() - moment(b.time, 'h:mm A').valueOf();
        case 'customer':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'service':
          return a.service.localeCompare(b.service);
        default:
          return 0;
      }
    });
    return filtered;
  })();

  // Calculations for the dashboard cards
  const todayBookings = bookings.filter(booking => 
    moment(booking.date).isSame(moment(), 'day')
  );

  const upcomingBookings = bookings.filter(booking =>
    moment(booking.date).isBetween(moment(), moment().add(7, 'days'), 'day', '[]')
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
              ${todayBookings.reduce((sum, booking) => booking.status === 'confirmed' ? sum + booking.price : sum, 0)}
            </div>
            <p className="text-sm text-gray-400">From confirmed</p>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isCreateModalOpen} onOpenChange={handleModalOpenChange}>
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <CardTitle className="text-white">Manage Bookings</CardTitle>
                        <CardDescription className="text-gray-300">
                        View and manage customer appointments
                        </CardDescription>
                    </div>
                    <DialogTrigger asChild>
                        <Button className="bg-white text-black hover:bg-gray-200 w-full sm:w-auto">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Booking
                        </Button>
                    </DialogTrigger>
                </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Month Filter</label>
                  <select
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm"
                  >
                    <option value="all">All Months</option>
                    {availableMonths.map(month => (
                      <option key={month} value={month}>
                        {moment(month, 'YYYY-MM').format('MMMM YYYY')}
                      </option>
                    ))}
                  </select>
                </div>
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
            
            <div className="mt-4 mb-2">
              <p className="text-sm text-gray-400">
                Showing {filteredAndSortedBookings.length} booking{filteredAndSortedBookings.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            {/* Bookings List */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-12 text-gray-400">Loading bookings...</div>
              ) : error ? (
                <div className="text-center py-12 text-red-400">{error}</div>
              ) : filteredAndSortedBookings.length === 0 ? (
                <div className="text-center py-8 md:py-12 text-gray-400">
                  <Calendar className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm md:text-base">No bookings found for the selected criteria</p>
                </div>
              ) : (
                filteredAndSortedBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-gray-700 border border-gray-600 rounded-lg p-3 sm:p-4 lg:p-6"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Booking Info */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 md:mb-3">
                          <h3 className="text-base md:text-lg font-semibold text-white">
                            {booking.firstName} {booking.lastName}
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
                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 lg:w-36 pt-3 lg:pt-0 border-t lg:border-t-0 lg:border-l border-gray-600 lg:pl-4">
                        {booking.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleConfirmBooking(booking._id)}
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
                              onClick={() => handleReschedule(booking._id)}
                              className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white w-full"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Reschedule
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancelBooking(booking._id)}
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

        <DialogContent className="p-0 border-none max-w-5xl w-full h-[90vh] bg-transparent">
            <div className="overflow-y-auto w-full h-full rounded-lg">
                <BookAppointmentPage />
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}