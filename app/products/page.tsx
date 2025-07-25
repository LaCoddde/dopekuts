'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star } from 'lucide-react';

const products = [
  {
    id: 1,
    name: 'Premium Hair Pomade',
    description: 'Strong hold, medium shine pomade for classic styling',
    price: 25,
    originalPrice: 30,
    rating: 4.8,
    reviews: 124,
    image: 'https://images.pexels.com/photos/3992133/pexels-photo-3992133.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Hair Products',
    inStock: true
  },
  {
    id: 2,
    name: 'Beard Oil - Sandalwood',
    description: 'Nourishing beard oil with natural sandalwood scent',
    price: 20,
    originalPrice: 25,
    rating: 4.9,
    reviews: 89,
    image: 'https://images.pexels.com/photos/4792065/pexels-photo-4792065.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Beard Care',
    inStock: true
  },
  {
    id: 3,
    name: 'Clay Hair Styling Paste',
    description: 'Matte finish clay for textured, natural-looking styles',
    price: 28,
    originalPrice: null,
    rating: 4.7,
    reviews: 156,
    image: 'https://images.pexels.com/photos/3992133/pexels-photo-3992133.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Hair Products',
    inStock: true
  },
  {
    id: 4,
    name: 'Shampoo & Conditioner Set',
    description: 'Professional grade shampoo and conditioner duo',
    price: 35,
    originalPrice: 45,
    rating: 4.6,
    reviews: 203,
    image: 'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Hair Care',
    inStock: false
  },
  {
    id: 5,
    name: 'Beard Balm - Cedarwood',
    description: 'Conditioning balm for beard styling and maintenance',
    price: 22,
    originalPrice: null,
    rating: 4.8,
    reviews: 78,
    image: 'https://images.pexels.com/photos/4792065/pexels-photo-4792065.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Beard Care',
    inStock: true
  },
  {
    id: 6,
    name: 'Premium Hair Wax',
    description: 'Flexible hold wax for versatile styling options',
    price: 26,
    originalPrice: null,
    rating: 4.5,
    reviews: 92,
    image: 'https://images.pexels.com/photos/3992133/pexels-photo-3992133.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Hair Products',
    inStock: true
  }
];

export default function Products() {
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
            <Card key={product.id} className="hover-lift overflow-hidden bg-gray-800 border-gray-700">
              <div className="aspect-square relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.originalPrice && (
                  <Badge className="absolute top-4 left-4 bg-red-500">
                    Sale
                  </Badge>
                )}
                {!product.inStock && (
                  <Badge className="absolute top-4 right-4 bg-gray-500">
                    Out of Stock
                  </Badge>
                )}
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-white">{product.name}</CardTitle>
                    <Badge variant="outline" className="mt-2">
                      {product.category}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="mt-2 text-gray-300">
                  {product.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium">{product.rating}</span>
                  </div>
                  <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-400 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  
                  <Button 
                    size="sm" 
                    disabled={!product.inStock}
                    className="flex items-center gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-gray-50 p-8 rounded-lg">
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
      </div>
    </div>
  );
}