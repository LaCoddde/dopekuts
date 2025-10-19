'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Scissors, Plus, Trash2, Edit, Clock, DollarSign } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
}

const mockServices: Service[] = [
  {
    id: 1,
    name: 'Classic Cut',
    description: 'Traditional haircut with clippers and scissors',
    price: 30,
    duration: 30,
  },
  {
    id: 2,
    name: 'Premium Cut & Style',
    description: 'Haircut with styling and premium products',
    price: 45,
    duration: 45,
  },
  {
    id: 3,
    name: 'Beard Trim',
    description: 'Professional beard trimming and shaping',
    price: 20,
    duration: 20,
  },
  {
    id: 4,
    name: 'Hot Towel Shave',
    description: 'Traditional hot towel shave experience',
    price: 35,
    duration: 30,
  },
  {
    id: 5,
    name: 'Deluxe Package',
    description: 'Haircut, beard trim, and hot towel treatment',
    price: 70,
    duration: 60,
  },
];

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    duration: '30',
  });

  const handleAddService = () => {
    if (newService.name && newService.price) {
      const service: Service = {
        id: services.length + 1,
        name: newService.name,
        description: newService.description,
        price: parseFloat(newService.price),
        duration: parseInt(newService.duration),
      };
      setServices([...services, service]);
      setNewService({ name: '', description: '', price: '', duration: '30' });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditService = () => {
    if (editingService && newService.name && newService.price) {
      const updatedServices = services.map((service) =>
        service.id === editingService.id
          ? {
              ...service,
              name: newService.name,
              description: newService.description,
              price: parseFloat(newService.price),
              duration: parseInt(newService.duration),
            }
          : service
      );
      setServices(updatedServices);
      setIsEditDialogOpen(false);
      setEditingService(null);
      setNewService({ name: '', description: '', price: '', duration: '30' });
    }
  };

  const openEditDialog = (service: Service) => {
    setEditingService(service);
    setNewService({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration.toString(),
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteService = (id: number) => {
    setServices(services.filter((service) => service.id !== id));
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Services Management</h1>
          <p className="text-sm md:text-base text-gray-400">
            Manage your barbershop services and pricing
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-white text-black hover:bg-gray-200 w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add New Service
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Service</DialogTitle>
              <DialogDescription className="text-gray-400">
                Create a new service for your barbershop
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="serviceName" className="text-gray-300">
                  Service Name
                </Label>
                <Input
                  id="serviceName"
                  placeholder="e.g., Classic Cut"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the service..."
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-gray-300">
                    Price ($)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="30"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-gray-300">
                    Duration
                  </Label>
                  <Select
                    value={newService.duration}
                    onValueChange={(value) => setNewService({ ...newService, duration: value })}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="15" className="text-white">
                        15 mins
                      </SelectItem>
                      <SelectItem value="20" className="text-white">
                        20 mins
                      </SelectItem>
                      <SelectItem value="30" className="text-white">
                        30 mins
                      </SelectItem>
                      <SelectItem value="45" className="text-white">
                        45 mins
                      </SelectItem>
                      <SelectItem value="60" className="text-white">
                        60 mins
                      </SelectItem>
                      <SelectItem value="90" className="text-white">
                        90 mins
                      </SelectItem>
                      <SelectItem value="120" className="text-white">
                        120 mins
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                  onClick={handleAddService}
                  className="flex-1 bg-white text-black hover:bg-gray-200"
                >
                  Add Service
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Service</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update service details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="editServiceName" className="text-gray-300">
                Service Name
              </Label>
              <Input
                id="editServiceName"
                placeholder="e.g., Classic Cut"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editDescription" className="text-gray-300">
                Description
              </Label>
              <Textarea
                id="editDescription"
                placeholder="Describe the service..."
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editPrice" className="text-gray-300">
                  Price ($)
                </Label>
                <Input
                  id="editPrice"
                  type="number"
                  placeholder="30"
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editDuration" className="text-gray-300">
                  Duration
                </Label>
                <Select
                  value={newService.duration}
                  onValueChange={(value) => setNewService({ ...newService, duration: value })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="15" className="text-white">
                      15 mins
                    </SelectItem>
                    <SelectItem value="20" className="text-white">
                      20 mins
                    </SelectItem>
                    <SelectItem value="30" className="text-white">
                      30 mins
                    </SelectItem>
                    <SelectItem value="45" className="text-white">
                      45 mins
                    </SelectItem>
                    <SelectItem value="60" className="text-white">
                      60 mins
                    </SelectItem>
                    <SelectItem value="90" className="text-white">
                      90 mins
                    </SelectItem>
                    <SelectItem value="120" className="text-white">
                      120 mins
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditService}
                className="flex-1 bg-white text-black hover:bg-gray-200"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {services.map((service) => (
          <Card key={service.id} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Scissors className="h-5 w-5 text-gray-400" />
                  <CardTitle className="text-white text-lg">{service.name}</CardTitle>
                </div>
              </div>
              <CardDescription className="text-gray-400 min-h-[40px]">
                {service.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-300">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-2xl font-bold text-white">${service.price}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{service.duration} mins</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(service)}
                    className="flex-1 border-gray-600 text-white hover:bg-gray-700"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteService(service.id)}
                    className="flex-1 border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}