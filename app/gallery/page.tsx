'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const galleryItems = [
  { id: 1, category: 'Classic Cuts', image: 'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 2, category: 'Beard Styling', image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 3, category: 'Modern Styles', image: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 4, category: 'Classic Cuts', image: 'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 5, category: 'Beard Styling', image: 'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 6, category: 'Modern Styles', image: 'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 7, category: 'Classic Cuts', image: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 8, category: 'Beard Styling', image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 9, category: 'Modern Styles', image: 'https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&w=600' },
];

const categories = ['All', 'Classic Cuts', 'Beard Styling', 'Modern Styles'];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredItems = selectedCategory === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-900 py-16">
      <div className="container-max section-padding">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-6">Our Work</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            See the quality and precision that sets DopeCuts apart. Every cut tells a story of 
            craftsmanship and attention to detail.
          </p>
          
          {/* Category Filter */}
          <div className="flex justify-center gap-4 flex-wrap">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer px-4 py-2"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover-lift cursor-pointer bg-gray-800 border-gray-700">
              <CardContent className="p-0">
                <div className="aspect-square relative">
                  <img
                    src={item.image}
                    alt={`${item.category} example`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 text-white w-full">
                      <Badge className="bg-white/20 text-white border-white/20">{item.category}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-white mb-4">Ready for Your Transform?</h2>
          <p className="text-gray-300 mb-8">
            Book your appointment today and join our gallery of satisfied customers.
          </p>
          <a 
            href="/book" 
            className="inline-flex items-center px-8 py-4 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors duration-200 font-semibold"
          >
            Book Your Appointment
          </a>
        </div>
      </div>
    </div>
  );
}