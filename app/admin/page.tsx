'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  BarChart3, 
  MessageSquare, 
  Settings,
  Clock,
  Check,
  X,
  Edit
} from 'lucide-react';

// Mock data
const todayAppointments = [
  { id: 1, customer: 'John Doe', service: 'Classic Cut', time: '10:00 AM', status: 'confirmed', phone: '(555) 123-4567' },
  { id: 2, customer: 'Mike Smith', service: 'Beard Grooming', time: '11:30 AM', status: 'pending', phone: '(555) 234-5678' },
  { id: 3, customer: 'David Wilson', service: 'Premium Package', time: '2:00 PM', status: 'confirmed', phone: '(555) 345-6789' },
  { id: 4, customer: 'Chris Brown', service: 'Express Service', time: '4:30 PM', status: 'pending', phone: '(555) 456-7890' },
];

const recentCustomers = [
  { id: 1, name: 'John Doe', email: 'john@email.com', visits: 5, lastVisit: '2025-01-15', totalSpent: 175 },
  { id: 2, name: 'Mike Smith', email: 'mike@email.com', visits: 3, lastVisit: '2025-01-10', totalSpent: 95 },
  { id: 3, name: 'David Wilson', email: 'david@email.com', visits: 8, lastVisit: '2025-01-12', totalSpent: 320 },
];

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container-max section-padding">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-300">Manage your barbershop operations</p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-gray-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Today's Appointments</CardTitle>
                  <Calendar className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">12</div>
                  <p className="text-xs text-gray-400">+2 from yesterday</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Total Customers</CardTitle>
                  <Users className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">1,234</div>
                  <p className="text-xs text-gray-400">+15 this week</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Daily Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">$650</div>
                  <p className="text-xs text-gray-400">+12% from yesterday</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Avg. Rating</CardTitle>
                  <BarChart3 className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">4.9</div>
                  <p className="text-xs text-gray-400">Based on 156 reviews</p>
                </CardContent>
              </Card>
            </div>

            {/* Today's Appointments */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Today's Appointments</CardTitle>
                <CardDescription className="text-gray-300">Manage today's scheduled appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-600 rounded-lg bg-gray-700">
                      <div className="flex items-center space-x-4">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="font-semibold text-white">{appointment.customer}</div>
                          <div className="text-sm text-gray-300">{appointment.service} • {appointment.time}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(appointment.status)}
                        <Button size="sm" variant="outline">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Management</CardTitle>
                <CardDescription>View and manage all appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <Input placeholder="Search appointments..." className="max-w-sm" />
                  <Button>Add Appointment</Button>
                </div>
                
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="font-semibold">{appointment.customer}</div>
                          <div className="text-sm text-gray-500">
                            {appointment.service} • {appointment.time} • {appointment.phone}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(appointment.status)}
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Management</CardTitle>
                <CardDescription>View and manage customer information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <Input placeholder="Search customers..." className="max-w-sm" />
                  <Button>Add Customer</Button>
                </div>
                
                <div className="space-y-4">
                  {recentCustomers.map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-semibold">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                        <div className="text-sm text-gray-500">
                          {customer.visits} visits • Last: {customer.lastVisit} • Total: ${customer.totalSpent}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">View</Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Analytics</CardTitle>
                <CardDescription>Track your business performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-black mb-2">$15,420</div>
                    <div className="text-gray-600">Monthly Revenue</div>
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-black mb-2">89%</div>
                    <div className="text-gray-600">Show-up Rate</div>
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-black mb-2">4.9</div>
                    <div className="text-gray-600">Avg Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SMS Management</CardTitle>
                <CardDescription>Send messages to customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button>Send Bulk Message</Button>
                  <Button variant="outline">Message Templates</Button>
                  <div className="mt-6">
                    <h3 className="font-semibold mb-4">Recent Messages</h3>
                    <div className="text-gray-500">No recent messages to display</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Settings</CardTitle>
                <CardDescription>Configure your barbershop settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Business Hours</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Opening Time" defaultValue="9:00 AM" />
                    <Input placeholder="Closing Time" defaultValue="7:00 PM" />
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Booking Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Maximum booking advance (days)</span>
                      <Input type="number" defaultValue="60" className="w-20" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Cancellation deadline (hours)</span>
                      <Input type="number" defaultValue="24" className="w-20" />
                    </div>
                  </div>
                </div>
                
                <Button>Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}