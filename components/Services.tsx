'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Scissors, Rat as Razor, Sparkles, Clock } from 'lucide-react';

const services = [
  {
    icon: Scissors,
    title: 'Classic Cuts',
    description: 'Precision haircuts tailored to your style and personality',
    price: 'From $35',
    duration: '45 min'
  },
  {
    icon: Razor,
    title: 'Beard Grooming',
    description: 'Professional beard trimming and styling services',
    price: 'From $25',
    duration: '30 min'
  },
  {
    icon: Sparkles,
    title: 'Premium Package',
    description: 'Complete grooming experience with wash, cut, and styling',
    price: 'From $65',
    duration: '90 min'
  },
  {
    icon: Clock,
    title: 'Express Service',
    description: 'Quick touch-ups and maintenance cuts for busy schedules',
    price: 'From $25',
    duration: '20 min'
  }
];

export function Services() {
  return (
    <section className="py-24 bg-gray-900">
      <div className="container-max section-padding">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our Services
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Professional grooming services delivered by master barbers with years of experience
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="hover-lift cursor-pointer bg-gray-800 border-gray-700">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-white rounded-full w-fit">
                  <service.icon className="h-8 w-8 text-black" />
                </div>
                <CardTitle className="text-xl font-bold text-white">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-300 mb-4 min-h-[3rem]">
                  {service.description}
                </CardDescription>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-white">{service.price}</div>
                  <div className="text-sm text-gray-400">{service.duration}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}