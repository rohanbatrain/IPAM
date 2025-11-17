"use client";

import { useEffect, useMemo, useState } from 'react';
import { Mail, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { resendVerification } from '@/lib/api/auth';
import { AuthErrorCode } from '@/lib/types/api';
import { Button } from '@/components/ui/button';

type Props = {
  email?: string;
  className?: string;
  onSent?: (email: string) => void;
  initialCooldown?: number;
  supportUrl?: string;
};

export default function VerificationResend({
  email,
  className,
  onSent,
  initialCooldown = 0,
  supportUrl = '/support',
}: Props) {
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState<number>(initialCooldown);
  const [lastSentEmail, setLastSentEmail] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);

  useEffect(() => {
    if (cooldown > 0) {
      const t = setTimeout(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
      return () => clearTimeout(t);
    } else if (rateLimited) {
      // Clear rate limit once cooldown expires
      setRateLimited(false);
      setStatusMessage(null);
    }
  }, [cooldown, rateLimited]);

  // computed for small progress bar (0..100)
  const cooldownMax = useMemo(() => (rateLimited ? 300 : 60), [rateLimited]);
  const progress = useMemo(() => {
    if (cooldownMax === 0) return 0;
    return Math.round(((cooldownMax - cooldown) / cooldownMax) * 100);
  }, [cooldown, cooldownMax]);

  // Lightweight analytics emitter (no-op if not present)
  const emitAnalytics = (eventName: string, payload: Record<string, any> = {}) => {
    try {
      if (typeof window !== 'undefined') {
        // gtag if available
        if ((window as any).gtag) {
          (window as any).gtag('event', eventName, payload);
        }
        // dataLayer if available
        if ((window as any).dataLayer) {
          (window as any).dataLayer.push({ event: eventName, ...payload });
        }
      }
    } catch (e) {
      // swallow analytics errors
      console.debug('analytics emit failed', e);
    }
  };

  const handleResend = async () => {
    emitAnalytics('resend_verification_attempt', { email_provided: !!email });

    if (!email) {
      setStatusMessage('Please enter your email address first');
      toast.error('Please enter your email address first');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setStatusMessage('Please enter a valid email address');
      toast.error('Please enter a valid email address');
      return;
    }

    if (cooldown > 0) {
      setStatusMessage(`Please wait ${cooldown} seconds before resending`);
      toast.error(`Please wait ${cooldown} seconds before resending`);
      return;
    }

    setIsResending(true);
    setStatusMessage(null);
    try {
      await resendVerification(email);
      setLastSentEmail(email);
      onSent?.(email);
      setCooldown(60);
      setRateLimited(false);
      setStatusMessage(`Verification email sent to ${email}`);
      emitAnalytics('resend_verification_success', { email_present: !!email });

      toast.success(
        <div className="flex flex-col gap-1">
          <div className="font-medium">Verification email sent!</div>
          <div className="text-sm opacity-90">Check your inbox for {email}</div>
          <div className="text-xs opacity-75">Check your spam folder if you do not see it</div>
        </div>,
        { duration: 6000 }
      );
    } catch (err: any) {
      console.error('Resend verification error:', err);
      if (err?.code === AuthErrorCode.TOO_MANY_ATTEMPTS) {
        // extended cooldown
        setCooldown(300);
        setRateLimited(true);
        setStatusMessage('Too many attempts. Please try again in 5 minutes or contact support.');
        emitAnalytics('resend_verification_rate_limited', { email_present: !!email });
        toast.error('Too many attempts. Please wait 5 minutes before trying again.');
      } else {
        setStatusMessage('Failed to send verification email. Please try again.');
        emitAnalytics('resend_verification_failed', { email_present: !!email });
        toast.error('Failed to send verification email. Please try again.');
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className={className}>
      <div className="bg-white border border-gray-200 rounded-md p-3 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="text-sm text-slate-800 font-medium mb-1">Need a new verification email?</p>
            {lastSentEmail && (
              <p className="text-xs text-slate-600 mb-1">Last sent to: <span className="font-medium">{lastSentEmail}</span></p>
            )}
            <p className="text-xs text-slate-500">Tip: check your spam or junk folder if you don't see the email.</p>

            {/* status announced for screen readers */}
            <div role="status" aria-live="polite" className="sr-only">
              {statusMessage ?? ''}
            </div>

            {/* Visible small progress bar */}
            {cooldown > 0 && (
              <div className="mt-2">
                <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-1 bg-blue-500 transition-all" style={{ width: `${progress}%` }} />
                </div>
                <div className="text-xs text-slate-500 mt-1">Available in {cooldown}s</div>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 self-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResend}
              disabled={isResending || cooldown > 0}
              aria-disabled={isResending || cooldown > 0}
              className="inline-flex items-center gap-2"
            >
              {isResending ? (
                <div className="flex items-center gap-2 text-slate-700">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Sending...
                </div>
              ) : cooldown > 0 ? (
                <div className="flex items-center gap-2 text-slate-600">
                  <RefreshCw className="w-3 h-3" />
                  Wait {cooldown}s
                </div>
              ) : (
                <div className="flex items-center gap-2 text-blue-600">
                  <Mail className="w-4 h-4" />
                  <span className="underline">Resend</span>
                </div>
              )}
            </Button>
          </div>
        </div>

        {rateLimited && (
          <div className="mt-3 text-xs text-yellow-700">
            Too many resend attempts. <a href={supportUrl} className="underline">Contact support</a> for help.
          </div>
        )}
      </div>
    </div>
  );
}
