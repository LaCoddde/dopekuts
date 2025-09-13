'use client';

import Link from 'next/link';
import { Scissors, MapPin, Phone, Mail, Instagram, Facebook, Twitter, Clock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        {/* Main Footer Content */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center space-x-4 mb-8 group">
                <div className="p-3 bg-black rounded-xl group-hover:bg-gray-900 transition-all duration-300 group-hover:scale-105">
                  <Scissors className="h-10 w-10 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl lg:text-4xl font-bold tracking-tight text-black">DOPECUTS</span>
                  <span className="text-sm text-gray-600 tracking-widest font-medium">PREMIUM BARBERSHOP</span>
                </div>
              </Link>
              
              <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                Where tradition meets innovation. Experience the art of grooming with our master barbers 
                and premium services that define modern masculinity.
              </p>
              
              {/* Social Media */}
              <div>
                <h4 className="text-black font-bold text-lg mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="p-3 bg-gray-100 rounded-xl text-gray-600 hover:text-black hover:bg-gray-200 transition-all duration-300 hover:scale-110">
                    <Instagram className="h-6 w-6" />
                  </a>
                  <a href="#" className="p-3 bg-gray-100 rounded-xl text-gray-600 hover:text-black hover:bg-gray-200 transition-all duration-300 hover:scale-110">
                    <Facebook className="h-6 w-6" />
                  </a>
                  <a href="#" className="p-3 bg-gray-100 rounded-xl text-gray-600 hover:text-black hover:bg-gray-200 transition-all duration-300 hover:scale-110">
                    <Twitter className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
            
            {/* Services & Contact Combined */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-12">
              
              {/* Services */}
              <div>
                <h3 className="text-black font-bold text-xl mb-8">Our Services</h3>
                <ul className="space-y-4">
                  {[
                    'Classic Cuts',
                    'Beard Grooming', 
                    'Premium Package',
                    'Express Service',
                    'Hair Styling',
                    'Consultations'
                  ].map((service) => (
                    <li key={service}>
                      <span className="text-gray-600 hover:text-black transition-colors duration-300 flex items-center group text-lg cursor-pointer">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-4 group-hover:bg-black transition-colors duration-300"></span>
                        {service}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-black font-bold text-xl mb-8">Get In Touch</h3>
                <div className="space-y-6">
                  
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gray-100 rounded-xl flex-shrink-0">
                      <MapPin className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-black font-semibold mb-2 text-lg">Visit Our Shop</p>
                      <p className="text-gray-600 leading-relaxed">
                        646 Upper James Street,<br />
                        Hamilton, ON<br />
                        L9C 2Z2
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gray-100 rounded-xl flex-shrink-0">
                      <Phone className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-black font-semibold mb-2 text-lg">Call Us</p>
                      <p className="text-gray-600 text-lg font-medium">(365) 323-3680</p>
                      <p className="text-gray-500 text-sm">Available during business hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gray-100 rounded-xl flex-shrink-0">
                      <Clock className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-black font-semibold mb-2 text-lg">Business Hours</p>
                      <div className="text-gray-600 space-y-1">
                        <p>Mon - Fri: 9:00 AM - 7:00 PM</p>
                        <p>Saturday: 9:00 AM - 6:00 PM</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gray-100 rounded-xl flex-shrink-0">
                      <Mail className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-black font-semibold mb-2 text-lg">Email Us</p>
                      <p className="text-gray-600 text-lg">info@dopecuts.com</p>
                      <p className="text-gray-500 text-sm">We'll respond within 24 hours</p>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="py-8 border-t border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-center lg:text-left">
              <p className="text-gray-600 text-lg mb-2">
                © 2025 DopeCuts. All rights reserved.
              </p>
              <p className="text-gray-500 text-sm">
                Crafted with precision and passion for the modern gentleman.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center lg:justify-end gap-6">
              <Link href="/privacy" className="text-gray-600 hover:text-black transition-colors text-lg">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-black transition-colors text-lg">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="text-gray-600 hover:text-black transition-colors text-lg">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}