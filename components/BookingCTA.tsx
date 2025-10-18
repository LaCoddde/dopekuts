'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Calendar, MapPin, Phone } from 'lucide-react';

export function BookingCTA() {
  return (
    <section className="py-24 bg-black text-white">
      <div className="container-max section-padding text-center">
        <div className="fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready for Your Best Look?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Book your appointment online and experience the DopeCuts difference. 
            Professional service, premium results.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 hover-lift" asChild>
              <Link href="/book">
                <Calendar className="mr-2 h-5 w-5" />
                Book Now
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 hover-lift border-white text-white hover:bg-white hover:text-black" asChild>
              <Link href="/contact">
                <Phone className="mr-2 h-5 w-5" />
                Call Us
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <MapPin className="h-8 w-8 mx-auto mb-4 text-gray-300" />
              <div className="font-semibold mb-2">Location</div>
              <div className="text-gray-300">123 Main Street, Downtown</div>
            </div>
            <div className="text-center">
              <Phone className="h-8 w-8 mx-auto mb-4 text-gray-300" />
              <div className="font-semibold mb-2">Phone</div>
              <div className="text-gray-300">(555) 123-4567</div>
            </div>
            <div className="text-center">
              <Calendar className="h-8 w-8 mx-auto mb-4 text-gray-300" />
              <div className="font-semibold mb-2">Hours</div>
              <div className="text-gray-300">Mon-Sat: 9AM-7PM</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}