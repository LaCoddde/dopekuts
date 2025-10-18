'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Calendar, Scissors, Star } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="absolute inset-0 bg-white/5"></div>
      
      <div className="relative z-10 container-max section-padding text-center">
        <div className="fade-in">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white rounded-full">
              <Scissors className="h-12 w-12 text-black" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            DOPE<span className="text-gray-400">CUTS</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Premium barbershop experience with master barbers, modern techniques, and exceptional service. 
            Your style, perfected.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="text-lg px-8 py-6 hover-lift" asChild>
              <Link href="/book">
                <Calendar className="mr-2 h-5 w-5" />
                Book Appointment
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 hover-lift" asChild>
              <Link href="/gallery">
                View Our Work
              </Link>
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">5000+</div>
              <div className="text-gray-300">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">10+</div>
              <div className="text-gray-300">Years Experience</div>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="flex items-center gap-1 mb-2">
                <span className="text-3xl font-bold text-white">4.9</span>
                <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="text-gray-300">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}