// dopekuts/app/admin/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Scissors, ArrowRight, Shield } from 'lucide-react';
import { requestOtp, verifyOtpAndLogin } from '../../lib/api/auth'; // Import API functions

export default function AdminLogin() {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // State for API errors
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError(null);

    try {
      await requestOtp({ email });
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;

    setIsLoading(true);
    setError(null);

    try {
      await verifyOtpAndLogin({ email, otp });
      localStorage.setItem('admin_authenticated', 'true');
      router.push('/admin/booking'); // Redirect to a protected admin page
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP or verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="container-max section-padding py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white rounded-full">
                <Shield className="h-12 w-12 text-black" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-gray-300">
              {step === 'email'
                ? 'Enter your email to receive a verification code'
                : 'Enter the 6-digit code sent to your email'
              }
            </p>
          </div>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                {step === 'email' ? 'Email Verification' : 'Enter OTP Code'}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {step === 'email'
                  ? "We'll send a verification code to your email"
                  : `Code sent to ${email}`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 text-center text-sm text-red-400">
                  {error}
                </div>
              )}
              {step === 'email' ? (
                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="email" className="text-white font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@dopecuts.com"
                      className="mt-2 bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-white text-black hover:bg-gray-200"
                    disabled={isLoading || !email}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                        Sending Code...
                      </div>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="otp" className="text-white font-medium">
                      Verification Code
                    </Label>
                    <Input
                      id="otp"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      className="mt-2 bg-gray-700 border-gray-600 text-white text-center text-2xl tracking-widest"
                      maxLength={6}
                      required
                    />
                    <p className="text-sm text-gray-400 mt-2">
                      Enter the 6-digit code sent to your email
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Button
                      type="submit"
                      className="w-full bg-white text-black hover:bg-gray-200"
                      disabled={isLoading || otp.length !== 6}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                          Verifying...
                        </div>
                      ) : (
                        'Verify & Login'
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-gray-600 text-white hover:bg-gray-700"
                      onClick={() => {
                        setStep('email');
                        setError(null);
                      }}
                    >
                      Back to Email
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}