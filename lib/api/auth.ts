import apiClient from './client';
import axios from 'axios';
import type { LoginCredentials, LoginResponse, SignupCredentials, SignupResponse, AuthError, ResendVerificationResponse } from '@/lib/types/api';
import { AuthErrorCode } from '@/lib/types/api';

// Error parsing utility
function parseAuthError(error: unknown): AuthError {
  // Normalize unknown error to a shape we can inspect safely
  const err = error as { response?: { status?: number; data?: Record<string, unknown> }; message?: string };

  // Handle Axios errors
  if (err && err.response) {
    const { status, data } = err.response;

    // Check for specific error codes from backend logs
    if (status === 401) {
      // Check error message for specific cases
      const errorMessage = data?.message || data?.error || err.message;

      if (String(errorMessage ?? '').toLowerCase().includes('user not found') ||
        String(errorMessage ?? '').toLowerCase().includes('login_user_not_found')) {
        return {
          success: false,
          error: 'Authentication Failed',
          message: 'No account found with this email address. Please check your email or sign up for a new account.',
          code: AuthErrorCode.USER_NOT_FOUND,
          details: data?.details as Record<string, unknown> | undefined
        };
      }

      if (String(errorMessage ?? '').toLowerCase().includes('invalid credentials') ||
        String(errorMessage ?? '').toLowerCase().includes('wrong password')) {
        return {
          success: false,
          error: 'Invalid Credentials',
          message: 'The email or password you entered is incorrect. Please try again.',
          code: AuthErrorCode.INVALID_CREDENTIALS,
          details: data?.details as Record<string, unknown> | undefined
        };
      }

      if (String(errorMessage ?? '').toLowerCase().includes('account locked') ||
        String(errorMessage ?? '').toLowerCase().includes('locked')) {
        return {
          success: false,
          error: 'Account Locked',
          message: 'Your account has been temporarily locked due to too many failed login attempts. Please try again later or contact support.',
          code: AuthErrorCode.ACCOUNT_LOCKED,
          details: data?.details as Record<string, unknown> | undefined
        };
      }

      if (String(errorMessage ?? '').toLowerCase().includes('disabled') ||
        String(errorMessage ?? '').toLowerCase().includes('suspended')) {
        return {
          success: false,
          error: 'Account Disabled',
          message: 'Your account has been disabled. Please contact support for assistance.',
          code: AuthErrorCode.ACCOUNT_DISABLED,
          details: data?.details as Record<string, unknown> | undefined
        };
      }

      if (String(errorMessage ?? '').toLowerCase().includes('not verified') ||
        String(errorMessage ?? '').toLowerCase().includes('email verification')) {
        return {
          success: false,
          error: 'Email Not Verified',
          message: 'Please verify your email address before signing in.',
          code: AuthErrorCode.EMAIL_NOT_VERIFIED,
          details: data?.details as Record<string, unknown> | undefined
        };
      }

      // Default 401 error
      return {
        success: false,
        error: 'Authentication Failed',
        message: 'Invalid email or password. Please try again.',
        code: AuthErrorCode.INVALID_CREDENTIALS,
        details: data?.details as Record<string, unknown> | undefined
      };
    }

    if (status === 403) {
      const errorMessage = data?.message || data?.error || data?.detail || err.message;

      // Check for email not verified in various ways
      if (String(errorMessage ?? '').toLowerCase().includes('email not verified') ||
        String(errorMessage ?? '').toLowerCase().includes('not verified') ||
        (String(errorMessage ?? '').toLowerCase().includes('email') && String(errorMessage ?? '').toLowerCase().includes('verified') && String(errorMessage ?? '').toLowerCase().includes('not')) ||
        (String(errorMessage ?? '').toLowerCase().includes('403') && String(errorMessage ?? '').toLowerCase().includes('email') && String(errorMessage ?? '').toLowerCase().includes('not verified'))) {
        return {
          success: false,
          error: 'Email Not Verified',
          message: 'Please verify your email address before signing in.',
          code: AuthErrorCode.EMAIL_NOT_VERIFIED,
          details: data?.details as Record<string, unknown> | undefined
        };
      }

      // Default 403 error
      return {
        success: false,
        error: 'Access Forbidden',
        message: 'Access to this resource is forbidden.',
        code: AuthErrorCode.SERVER_ERROR,
        details: data?.details as Record<string, unknown> | undefined
      };
    }

    if (status === 429) {
      return {
        success: false,
        error: 'Too Many Attempts',
        message: 'Too many login attempts. Please wait a few minutes before trying again.',
        code: AuthErrorCode.TOO_MANY_ATTEMPTS,
        details: data?.details as Record<string, unknown> | undefined
      };
    }

    if (status === 422) {
      // Validation errors
      const errorMessage = data?.message || data?.error || 'Invalid input data';
      return {
        success: false,
        error: 'Validation Error',
        message: String(errorMessage),
        code: AuthErrorCode.INVALID_EMAIL_FORMAT,
        details: data?.details as Record<string, unknown> | undefined
      };
    }

    if ((status ?? 0) >= 500) {
      return {
        success: false,
        error: 'Server Error',
        message: 'A server error occurred. Please try again later.',
        code: AuthErrorCode.SERVER_ERROR,
        details: data?.details as Record<string, unknown> | undefined
      };
    }
  }

  // Network errors
  if (((err as unknown) as { code?: string }).code === 'NETWORK_ERROR' || !err.response) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔍 Network error detected');
    }
    return {
      success: false,
      error: 'Connection Error',
      message: 'Unable to connect to the server. Please check your internet connection and server configuration.',
      code: AuthErrorCode.NETWORK_ERROR,
      details: { originalError: error }
    };
  }

  // Generic error fallback
  if (process.env.NODE_ENV !== 'production') {
    console.log('🔍 Generic error fallback - no response object');
  }
  const fallbackResult: AuthError = {
    success: false,
    error: 'Authentication Error',
    message: err.message || 'An unexpected error occurred. Please try again.',
    code: AuthErrorCode.SERVER_ERROR,
    details: { originalError: error }
  };
  return fallbackResult;
}

export async function login(credentials: LoginCredentials, apiUrl?: string): Promise<LoginResponse> {
  try {
    if (apiUrl) {
      const response = await axios.post<LoginResponse>(`${apiUrl.replace(/\/$/, '')}/auth/login`, credentials, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    }

    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  } catch (error) {
    const authError = parseAuthError(error);
    throw authError;
  }
}

export async function signup(credentials: SignupCredentials, apiUrl?: string): Promise<SignupResponse> {
  try {
    if (apiUrl) {
      const response = await axios.post<SignupResponse>(`${apiUrl.replace(/\/$/, '')}/auth/register`, credentials, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    }

    const response = await apiClient.post<SignupResponse>('/auth/register', credentials);
    return response.data;
  } catch (error) {
    const authError = parseAuthError(error);
    throw authError;
  }
}

export async function resendVerification(email: string, apiUrl?: string): Promise<ResendVerificationResponse> {
  try {
    if (apiUrl) {
      const response = await axios.post<ResendVerificationResponse>(`${apiUrl.replace(/\/$/, '')}/auth/resend-verification-email`, { email }, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    }

    const response = await apiClient.post<ResendVerificationResponse>('/auth/resend-verification-email', { email });
    return response.data;
  } catch (error) {
    const authError = parseAuthError(error);
    throw authError;
  }
}
