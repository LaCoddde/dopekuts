// dopekuts/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/sonner';
import { Chatbot } from '@/components/Chatbot';

const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID || 'G-SCG3GZJBL3'; // from your screenshot

export const metadata: Metadata = {
  title: 'DopeCuts - Premium Barbershop Experience',
  description:
    'Professional barbershop services with online booking, premium cuts, and exceptional customer service.',
  keywords:
    'barbershop, haircuts, grooming, beard trim, styling, appointments',
  // If you’re also verifying Search Console via meta:
  // verification: { google: 'googlef5c608fcd1687fba' }, // usually without ".html"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {/* Microsoft Clarity */}
        <Script id="ms-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "t9tmlpn0a1");
          `}
        </Script>

        {/* Google tag (gtag.js) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            // Main GA4 property
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname
            });
          `}
        </Script>

        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />

        {/* Chatbot lives on every page */}
        <Chatbot />
      </body>
    </html>
  );
}
