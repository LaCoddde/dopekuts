// app/products/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAllProducts, IProduct } from '@/lib/api/product';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x400?text=No+Image';

export default function Products() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true);
        const apiProducts = await getAllProducts();
        setProducts(apiProducts);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Could not load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 py-16 flex justify-center items-center">
        <h2 className="text-3xl font-bold text-white">Loading Products...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 py-16 flex justify-center items-center">
        <h2 className="text-3xl font-bold text-red-500">{error}</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-16">
      <div className="container-max section-padding">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-6">Hair Products</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Professional-grade products used and trusted by our barbers.
            Get the same quality styling products we use in our shop.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product._id} className="hover-lift overflow-hidden bg-gray-800 border-gray-700">
              <div className="aspect-square relative">
                <img
                  src={product.image || PLACEHOLDER_IMAGE}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-white">{product.name}</CardTitle>
                  </div>
                </div>
                <CardDescription className="mt-2 text-gray-300">
                  {product.description || 'No description available.'}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white">${product.price}</span>
                  </div>

                  <Button
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => {
                      const targetLink = product.affiliateLink || product.link;
                      window.open(targetLink, '_blank', 'noopener,noreferrer');
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Get Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section — dark theme to match Services */}
        <div className="mt-16 bg-gray-800 border border-gray-700 p-8 rounded-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose Our Products?</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Every product in our collection is personally tested and approved by our master barbers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white text-black p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                ✓
              </div>
              <h3 className="font-bold text-white mb-2">Professional Grade</h3>
              <p className="text-gray-300">The same products used by our expert barbers</p>
            </div>

            <div className="text-center">
              <div className="bg-white text-black p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                ★
              </div>
              <h3 className="font-bold text-white mb-2">Premium Quality</h3>
              <p className="text-gray-300">Only the finest ingredients and formulations</p>
            </div>

            <div className="text-center">
              <div className="bg-white text-black p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                ❤
              </div>
              <h3 className="font-bold text-white mb-2">Customer Approved</h3>
              <p className="text-gray-300">Loved by thousands of satisfied customers</p>
            </div>
          </div>
        </div>
        {/* End Info Section */}
      </div>
    </div>
  );
}