// dopekuts/app/gallery/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const galleryItems = [
  { id: 1, category: 'Classic Cuts', image: '/g1.png' },
  { id: 2, category: 'Beard Styling', image: '/g2.png' },
  { id: 3, category: 'Modern Styles', image: '/g3.png' },
  { id: 4, category: 'Classic Cuts', image: '/g4.png' },
  { id: 5, category: 'Beard Styling', image: '/g5.png' },
  { id: 6, category: 'Modern Styles', image: '/g6.png' },
  { id: 7, category: 'Classic Cuts', image: '/g7.png' },
  { id: 8, category: 'Beard Styling', image: '/g8.png' },
  { id: 9, category: 'Modern Styles', image: '/g9.png' },
];

const categories = ['All', 'Classic Cuts', 'Beard Styling', 'Modern Styles'];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filteredItems =
    selectedCategory === 'All'
      ? galleryItems
      : galleryItems.filter((item) => item.category === selectedCategory);

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
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <Badge
                  key={category}
                  variant={isActive ? 'default' : 'outline'}
                  className={`cursor-pointer px-4 py-2 ${
                    isActive ? '' : 'text-white border-white/40 hover:bg-white/10'
                  }`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSelectedId(null);
                  }}
                >
                  {category}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, idx) => {
            const isSelected = selectedId === item.id;
            return (
              <Card
                key={item.id}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={() => setSelectedId(isSelected ? null : item.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedId(isSelected ? null : item.id);
                  }
                }}
                className={`overflow-hidden cursor-pointer bg-gray-800 border ${
                  isSelected ? 'border-2 border-white' : 'border-gray-700'
                } transition-colors duration-300 hover-lift`}
              >
                <CardContent className="p-0">
                  <div className="aspect-square relative">
                    <Image
                      src={item.image}
                      alt={`${item.category} example ${item.id}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                      priority={idx < 2}
                    />
                    <div
                      className={`absolute inset-0 flex items-end transition-all duration-300 ${
                        isSelected
                          ? 'bg-white/40 opacity-100'
                          : 'bg-black/20 opacity-0 hover:opacity-100'
                      }`}
                    >
                      <div className="p-4 w-full">
                        <Badge
                          className={
                            isSelected
                              ? 'bg-white text-black border-black/10'
                              : 'bg-white/20 text-white border-white/20'
                          }
                        >
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
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