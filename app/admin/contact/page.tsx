'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserPlus, Trash2, Search, ArrowUpDown } from 'lucide-react';

interface Customer {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  dateAdded: string;
}

const mockCustomers: Customer[] = [
  {
    id: 1,
    fullName: 'Marcus Williams',
    email: 'marcus.w@email.com',
    phone: '(555) 123-4567',
    dateAdded: '2025-01-15',
  },
  {
    id: 2,
    fullName: 'DeAndre Johnson',
    email: 'deandre.j@email.com',
    phone: '(555) 234-5678',
    dateAdded: '2025-01-14',
  },
  {
    id: 3,
    fullName: 'Jamal Thompson',
    email: 'jamal.t@email.com',
    phone: '(555) 345-6789',
    dateAdded: '2025-01-13',
  },
  {
    id: 4,
    fullName: 'Tyler Rodriguez',
    email: 'tyler.r@email.com',
    phone: '(555) 456-7890',
    dateAdded: '2025-01-12',
  },
  {
    id: 5,
    fullName: 'Andre Davis',
    email: 'andre.d@email.com',
    phone: '(555) 567-8901',
    dateAdded: '2025-01-11',
  },
  {
    id: 6,
    fullName: 'Isaiah Martinez',
    email: 'isaiah.m@email.com',
    phone: '(555) 678-9012',
    dateAdded: '2025-01-10',
  },
  {
    id: 7,
    fullName: 'Brandon Lee',
    email: 'brandon.l@email.com',
    phone: '(555) 789-0123',
    dateAdded: '2025-01-09',
  },
  {
    id: 8,
    fullName: 'Jordan Smith',
    email: 'jordan.s@email.com',
    phone: '(555) 890-1234',
    dateAdded: '2025-01-08',
  },
];

export default function ContactManagement() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'fullName' | 'dateAdded'>('dateAdded');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  const handleSort = (field: 'fullName' | 'dateAdded') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedCustomers = customers
    .filter(
      (customer) =>
        customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery)
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleAddCustomer = () => {
    if (newCustomer.fullName && newCustomer.email && newCustomer.phone) {
      const customer: Customer = {
        id: customers.length + 1,
        fullName: newCustomer.fullName,
        email: newCustomer.email,
        phone: newCustomer.phone,
        dateAdded: new Date().toISOString().split('T')[0],
      };
      setCustomers([customer, ...customers]);
      setNewCustomer({ fullName: '', email: '', phone: '' });
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteCustomer = (id: number) => {
    setCustomers(customers.filter((customer) => customer.id !== id));
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Customer Database</h1>
          <p className="text-sm md:text-base text-gray-400">Manage DopeCuts customers</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-white text-black hover:bg-gray-200 w-full sm:w-auto">
              <UserPlus className="h-4 w-4 mr-2" />
              Add New Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Customer</DialogTitle>
              <DialogDescription className="text-gray-400">
                Enter customer information to add them to the database
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-300">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  placeholder="Enter full name"
                  value={newCustomer.fullName}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, fullName: e.target.value })
                  }
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="customer@email.com"
                  value={newCustomer.email}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, email: e.target.value })
                  }
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-300">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={newCustomer.phone}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, phone: e.target.value })
                  }
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddCustomer}
                  className="flex-1 bg-white text-black hover:bg-gray-200"
                >
                  Add Customer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Customers</CardTitle>
          <CardDescription className="text-gray-300">
            Total customers: {customers.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <Select
                value={`${sortField}-${sortOrder}`}
                onValueChange={(value) => {
                  const [field, order] = value.split('-') as [
                    'fullName' | 'dateAdded',
                    'asc' | 'desc'
                  ];
                  setSortField(field);
                  setSortOrder(order);
                }}
              >
                <SelectTrigger className="w-full sm:w-[200px] bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="dateAdded-desc" className="text-white">
                    Date Added (Newest)
                  </SelectItem>
                  <SelectItem value="dateAdded-asc" className="text-white">
                    Date Added (Oldest)
                  </SelectItem>
                  <SelectItem value="fullName-asc" className="text-white">
                    Name (A-Z)
                  </SelectItem>
                  <SelectItem value="fullName-desc" className="text-white">
                    Name (Z-A)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="hidden md:block rounded-md border border-gray-700 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-750 border-gray-700 hover:bg-gray-750">
                    <TableHead
                      className="text-gray-300 cursor-pointer"
                      onClick={() => handleSort('fullName')}
                    >
                      <div className="flex items-center">
                        Full Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-gray-300">Email</TableHead>
                    <TableHead className="text-gray-300">Phone</TableHead>
                    <TableHead
                      className="text-gray-300 cursor-pointer"
                      onClick={() => handleSort('dateAdded')}
                    >
                      <div className="flex items-center">
                        Date Added
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-gray-300 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedCustomers.map((customer) => (
                    <TableRow key={customer.id} className="border-gray-700 hover:bg-gray-750">
                      <TableCell className="font-medium text-white">
                        {customer.fullName}
                      </TableCell>
                      <TableCell className="text-gray-300">{customer.email}</TableCell>
                      <TableCell className="text-gray-300">{customer.phone}</TableCell>
                      <TableCell className="text-gray-300">
                        {new Date(customer.dateAdded).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCustomer(customer.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-600/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="md:hidden space-y-3">
              {filteredAndSortedCustomers.map((customer) => (
                <Card key={customer.id} className="bg-gray-700 border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-white text-lg">
                          {customer.fullName}
                        </h3>
                        <p className="text-sm text-gray-400">
                          Added{' '}
                          {new Date(customer.dateAdded).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCustomer(customer.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-600/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-300">
                        <span className="text-gray-400">Email:</span> {customer.email}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-gray-400">Phone:</span> {customer.phone}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredAndSortedCustomers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">No customers found matching your search.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
