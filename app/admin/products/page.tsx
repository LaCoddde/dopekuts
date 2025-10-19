'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';

export default function ProductsManagement() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Products Management</h1>
        <p className="text-sm md:text-base text-gray-400">
          Manage your barbershop products and inventory
        </p>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Package className="h-5 w-5" />
            Products
          </CardTitle>
          <CardDescription className="text-gray-300">Coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">Product management features will be available soon.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}