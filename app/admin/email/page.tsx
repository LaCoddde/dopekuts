'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
import { Mail, Send, Clock, CheckCircle, Users, History, Search } from 'lucide-react';

interface Customer {
  id: number;
  fullName: string;
  email: string;
}

interface EmailHistory {
  id: number;
  recipient: string;
  subject: string;
  message: string;
  sentDate: string;
  status: 'sent' | 'failed';
}

const mockCustomers: Customer[] = [
  { id: 1, fullName: 'Marcus Williams', email: 'marcus.w@email.com' },
  { id: 2, fullName: 'DeAndre Johnson', email: 'deandre.j@email.com' },
  { id: 3, fullName: 'Jamal Thompson', email: 'jamal.t@email.com' },
  { id: 4, fullName: 'Tyler Rodriguez', email: 'tyler.r@email.com' },
  { id: 5, fullName: 'Andre Davis', email: 'andre.d@email.com' },
  { id: 6, fullName: 'Isaiah Martinez', email: 'isaiah.m@email.com' },
  { id: 7, fullName: 'Brandon Lee', email: 'brandon.l@email.com' },
  { id: 8, fullName: 'Jordan Smith', email: 'jordan.s@email.com' },
];

const mockEmailHistory: EmailHistory[] = [
  {
    id: 1,
    recipient: 'Marcus Williams (marcus.w@email.com)',
    subject: 'Appointment Confirmation',
    message: 'Your appointment is confirmed for January 20th at 2:00 PM.',
    sentDate: '2025-01-18',
    status: 'sent',
  },
  {
    id: 2,
    recipient: 'All Customers (8 recipients)',
    subject: 'New Year Special - 20% Off',
    message: 'Celebrate the new year with us! Get 20% off all services this month.',
    sentDate: '2025-01-15',
    status: 'sent',
  },
  {
    id: 3,
    recipient: 'DeAndre Johnson (deandre.j@email.com)',
    subject: 'Thank You for Your Visit',
    message: 'Thank you for choosing DopeCuts. We hope to see you again soon!',
    sentDate: '2025-01-14',
    status: 'sent',
  },
  {
    id: 4,
    recipient: 'Jamal Thompson (jamal.t@email.com)',
    subject: 'Appointment Reminder',
    message: 'Reminder: Your appointment is tomorrow at 3:00 PM.',
    sentDate: '2025-01-13',
    status: 'failed',
  },
  {
    id: 5,
    recipient: 'All Customers (8 recipients)',
    subject: 'Holiday Hours',
    message: 'Please note our special holiday hours for this weekend.',
    sentDate: '2025-01-10',
    status: 'sent',
  },
];

export default function EmailManagement() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [recipientType, setRecipientType] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'sentDate' | 'recipient'>('sentDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSend = () => {
    console.log('Sending email...');
    setSubject('');
    setMessage('');
    setRecipientType('all');
    setSelectedCustomer('');
  };

  const filteredAndSortedHistory = mockEmailHistory
    .filter(
      (email) =>
        email.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.subject.toLowerCase().includes(searchQuery.toLowerCase())
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

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Email Management</h1>
          <p className="text-sm md:text-base text-gray-400">Send emails to your customers</p>
        </div>
        <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-700 w-full sm:w-auto"
            >
              <History className="h-4 w-4 mr-2" />
              View Email History
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-white">Email History</DialogTitle>
              <DialogDescription className="text-gray-400">
                View all sent emails and their status
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 flex-1 overflow-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by recipient or subject..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <Select
                  value={`${sortField}-${sortOrder}`}
                  onValueChange={(value) => {
                    const [field, order] = value.split('-') as [
                      'sentDate' | 'recipient',
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
                    <SelectItem value="sentDate-desc" className="text-white">
                      Date (Newest)
                    </SelectItem>
                    <SelectItem value="sentDate-asc" className="text-white">
                      Date (Oldest)
                    </SelectItem>
                    <SelectItem value="recipient-asc" className="text-white">
                      Recipient (A-Z)
                    </SelectItem>
                    <SelectItem value="recipient-desc" className="text-white">
                      Recipient (Z-A)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="hidden md:block rounded-md border border-gray-700 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-750 border-gray-700 hover:bg-gray-750">
                      <TableHead className="text-gray-300">Recipient</TableHead>
                      <TableHead className="text-gray-300">Subject</TableHead>
                      <TableHead className="text-gray-300">Date</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedHistory.map((email) => (
                      <TableRow key={email.id} className="border-gray-700 hover:bg-gray-750">
                        <TableCell className="text-white">{email.recipient}</TableCell>
                        <TableCell className="text-gray-300">{email.subject}</TableCell>
                        <TableCell className="text-gray-300">
                          {new Date(email.sentDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </TableCell>
                        <TableCell>
                          {email.status === 'sent' ? (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Sent
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 border-red-200">
                              Failed
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="md:hidden space-y-3">
                {filteredAndSortedHistory.map((email) => (
                  <Card key={email.id} className="bg-gray-700 border-gray-600">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white text-sm">{email.subject}</h3>
                          <p className="text-xs text-gray-400 mt-1">{email.recipient}</p>
                        </div>
                        {email.status === 'sent' ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200 ml-2">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Sent
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 border-red-200 ml-2">
                            Failed
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        {new Date(email.sentDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-sm text-gray-300 mt-2 line-clamp-2">{email.message}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredAndSortedHistory.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400">No emails found matching your search.</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Compose Email</CardTitle>
          <CardDescription className="text-gray-300">
            Send an email to your customers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="recipientType" className="text-white text-sm md:text-base">
              Send To
            </Label>
            <Select value={recipientType} onValueChange={setRecipientType}>
              <SelectTrigger
                id="recipientType"
                className="bg-gray-700 border-gray-600 text-white"
              >
                <SelectValue placeholder="Select recipient type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all" className="text-white">
                  All Customers ({mockCustomers.length})
                </SelectItem>
                <SelectItem value="individual" className="text-white">
                  Individual Customer
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {recipientType === 'individual' && (
            <div className="space-y-2">
              <Label htmlFor="customer" className="text-white text-sm md:text-base">
                Select Customer
              </Label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger
                  id="customer"
                  className="bg-gray-700 border-gray-600 text-white"
                >
                  <SelectValue placeholder="Choose a customer" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {mockCustomers.map((customer) => (
                    <SelectItem
                      key={customer.id}
                      value={customer.id.toString()}
                      className="text-white"
                    >
                      {customer.fullName} ({customer.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-white text-sm md:text-base">
              Subject
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject..."
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-white text-sm md:text-base">
              Message
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              rows={8}
              className="bg-gray-700 border-gray-600 text-white text-sm md:text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleSend}
              className="bg-white text-black hover:bg-gray-200 flex-1 text-sm md:text-base"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Email
            </Button>
            <Button
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-700 flex-1 text-sm md:text-base"
            >
              <Clock className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
