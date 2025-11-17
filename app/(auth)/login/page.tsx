'use client';

import { useState, useEffect } from 'react';
// Note: router not required here; login shows a notice instead of redirecting
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { useServerStore } from '@/lib/store/server-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Lock, Mail, Shield, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';
import VerificationResend from '../components/VerificationResend';
import { toast } from 'sonner';
import type { AuthError } from '@/lib/types/api';
import { AuthErrorCode } from '@/lib/types/api';
import { resendVerification } from '@/lib/api/auth';

export default function LoginPage() {
  const router = useRouter();
  const { isConfigured } = useServerStore();
  const login = useAuthStore((state) => state.login);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [lastResendEmail, setLastResendEmail] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // Resend is handled by a reusable component with its own cooldown state

  // Clear auth errors when component mounts or form data changes
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formData.email, formData.password]);

  // If server is not configured, redirect to server setup
  // If server is not configured, show a notice (do not auto-redirect)
  // Auto-redirecting from the login page can be disruptive (e.g. when
  // login fails with "user not found"). Instead, present a link so the
  // user can choose to configure the server if needed.

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fillTestCredentials = () => {
    setFormData({
      email: 'test_user@example.com',
      password: 'test_password',
    });
    setErrors({});
    clearError();
    toast.info('Test credentials filled');
  };

  // Verification resend is delegated to `VerificationResend` component

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await login(formData);
      toast.success('Welcome back! Redirecting...');
      
      // Use window.location for a hard redirect to ensure state is fresh
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Login error:', {
        error: (error as any)?.error,
        message: (error as any)?.message,
        code: (error as any)?.code
      });
      // Error is already handled by the auth store and displayed below
      setIsLoading(false);
    }
  };

  const getErrorDisplay = (authError: AuthError) => {
    const isEmailNotVerified = authError.code === AuthErrorCode.EMAIL_NOT_VERIFIED;

    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-red-800 mb-1">
              {authError.error}
            </h4>
            <p className="text-sm text-red-700 mb-3">
              {authError.message}
            </p>
            {/* Resend control moved below the form for a cleaner layout */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your Second Brain Database account</p>
          <p className="text-sm text-gray-500 mt-1">Powered by Second Brain Database Auth</p>
        </div>

        {/* If server not configured, show an inline notice instead of forcing a redirect */}
        {!isConfigured && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Server not configured.{' '}
              <a href="/server-setup" className="font-medium text-yellow-900 underline">
                Configure server
              </a>
            </p>
          </div>
        )}

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Use your Second Brain Database account to access the IPAM system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && getErrorDisplay(error)}

            {/* Verification status section */}
            {lastResendEmail && !error && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-green-800 mb-1">
                      Verification Email Sent
                    </h4>
                    <p className="text-sm text-green-700 mb-2">
                      A new verification email has been sent to <strong>{lastResendEmail}</strong>
                    </p>
                    <div className="text-xs text-green-600 space-y-1">
                      <p>📧 Check your inbox (and spam folder)</p>
                      <p>🔗 Click the verification link in the email</p>
                      <p>⚡ The link expires in 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={isLoading}
                    className={`pl-10 h-11 transition-all duration-200 ${
                      errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={isLoading}
                    className={`pl-10 pr-10 h-11 transition-all duration-200 ${
                      errors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.password}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Place resend control below the sign-in form for cleaner layout */}
            {error?.code === AuthErrorCode.EMAIL_NOT_VERIFIED && (
              <div className="mt-4">
                <VerificationResend email={formData.email} onSent={(e) => setLastResendEmail(e)} />
              </div>
            )}

            <div className="mt-6 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-gray-500 font-medium">Development</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-10 border-gray-300 hover:bg-gray-50 transition-colors"
                  onClick={fillTestCredentials}
                  disabled={isLoading}
                >
                  Use Test Credentials
                </Button>

                <Button
                  type="button"
                  className="w-full h-10 bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
                  onClick={() => router.push('/server-setup')}
                >
                  Server Settings
                </Button>
              </div>

              
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  href="/signup"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
