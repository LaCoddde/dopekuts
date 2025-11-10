// components/Hero.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Calendar, Scissors, Star } from 'lucide-react';
import { getAllProducts, type IProduct } from '@/lib/api/product';

export function Hero() {
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const apiProducts = await getAllProducts();
        setProducts(apiProducts || []);
      } catch (err) {
        console.error('Failed to fetch products for hero marquee:', err);
      }
    }
    loadProducts();
  }, []);

  const marqueeItems = products.slice(0, 8);
  const hasProducts = marqueeItems.length > 0;

  return (
    <>
      {/* Local styles for marquee animation + mobile scroll */}
      <style jsx global>{`
        @keyframes hero-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .hero-marquee-track {
          display: inline-flex;
          gap: 1.5rem;
          white-space: nowrap;
          animation: hero-marquee 25s linear infinite;
        }

        @media (max-width: 640px) {
          .hero-marquee-track {
            animation-duration: 18s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-marquee-track {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
          }
        }

        /* Mobile horizontal scroll – hide scrollbar */
        .hero-mobile-scroll {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }

        .hero-mobile-scroll::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>

      <section className="relative min-h-screen flex items-start justify-center bg-gray-900 pt-10 md:pt-16 pb-12">
        {/* Match Services: gray-900 → gray-950 gradient + subtle white film */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-950"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" aria-hidden="true" />

        <div className="relative z-10 container-max section-padding text-center pt-0 mt-0">
          <div className="fade-in">
            {/* Product strip */}
            {hasProducts && (
              <>
                {/* Mobile: horizontally scrollable chips */}
                <div className="sm:hidden w-full mb-6">
                  <Link href="/products" className="group block">
                    <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-black/60 px-4 py-3">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
                          Products we use
                        </span>
                        <span className="text-[10px] text-black-300 group-hover:text-white/80 transition-colors">
                          View all
                        </span>
                      </div>

                      <div className="hero-mobile-scroll flex gap-2 overflow-x-auto">
                        {marqueeItems.map((product) => (
                          <span
                            key={product._id}
                            className="flex-shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-black-50"
                          >
                            {product.name}
                            {typeof product.price === 'number' && (
                              <span className="ml-1 text-black-300">
                                ${product.price}
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Desktop: animated marquee */}
                <div className="hidden sm:block w-full mb-6 sm:mb-8">
                  <Link href="/products" className="group block">
                    <div className="relative overflow-hidden rounded-full border border-white/15 bg-black/60 px-4 py-2.5">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-white/80 shrink-0">
                          Products we use
                        </span>
                        <span className="h-4 w-px bg-white/20 shrink-0" />
                        <div className="relative flex-1 overflow-hidden">
                          <div className="hero-marquee-track">
                            {marqueeItems.map((product) => (
                              <span
                                key={product._id}
                                className="whitespace-nowrap text-[11px] sm:text-sm text-black-200"
                              >
                                {product.name}
                                {typeof product.price === 'number' && (
                                  <span className="ml-1 text-black-300">
                                    ${product.price}
                                  </span>
                                )}
                              </span>
                            ))}
                            {/* Duplicate list for seamless loop */}
                            {marqueeItems.map((product) => (
                              <span
                                key={`${product._id}-dup`}
                                className="whitespace-nowrap text-[11px] sm:text-sm text-black-200"
                              >
                                {product.name}
                                {typeof product.price === 'number' && (
                                  <span className="ml-1 text-black-300">
                                    ${product.price}
                                  </span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Edge fade gradients */}
                      <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-gray-900/90 via-gray-900/40 to-transparent" />
                      <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-gray-900/90 via-gray-900/40 to-transparent" />
                    </div>
                  </Link>
                </div>
              </>
            )}

            <div className="flex justify-center mb-5 sm:mb-6">
              <div className="p-4 bg-white rounded-full">
                <Scissors className="h-12 w-12 text-black-950" />
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 md:mb-6 tracking-tight">
              DOPE<span className="text-black-400">CUTS</span>
            </h1>

            <p className="text-xl md:text-2xl text-black-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Premium barbershop experience with master barbers, modern techniques, and exceptional service.
              Your style, perfected.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col gap-4 justify-center items-center mb-12">
              {/* Primary actions in one row */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" className="text-lg px-8 py-6 hover-lift" asChild>
                  <Link href="/book">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Appointment
                  </Link>
                </Button>

                <Button size="lg" className="text-lg px-8 py-6 hover-lift" asChild>
                  <Link href="/reschedule">
                    <Calendar className="mr-2 h-5 w-5" />
                    Manage Appointment
                  </Link>
                </Button>
              </div>

              {/* Secondary action on its own line */}
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 hover-lift"
                asChild
              >
                <Link href="/gallery">View Our Work</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">5000+</div>
                <div className="text-black-200">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">10+</div>
                <div className="text-black-200">Years Experience</div>
              </div>
              <div className="text-center flex flex-col items-center">
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-3xl font-bold text-white">4.9</span>
                  <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="text-black-200">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
