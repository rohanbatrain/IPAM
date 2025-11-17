import apiClient from './client';
import type { LoginCredentials, LoginResponse, SignupCredentials, SignupResponse, AuthError, ResendVerificationResponse } from '@/lib/types/api';
import { AuthErrorCode } from '@/lib/types/api';

// Error parsing utility
function parseAuthError(error: any): AuthError {
  // Handle Axios errors
  if (error?.response) {
    const { status, data } = error.response;

    // Check for specific error codes from backend logs
    if (status === 401) {
      // Check error message for specific cases
      const errorMessage = data?.message || data?.error || error.message;

      if (errorMessage?.toLowerCase().includes('user not found') ||
          errorMessage?.toLowerCase().includes('login_user_not_found')) {
        return {
          success: false,
          error: 'Authentication Failed',
          message: 'No account found with this email address. Please check your email or sign up for a new account.',
          code: AuthErrorCode.USER_NOT_FOUND,
          details: data?.details
        };
      }

      if (errorMessage?.toLowerCase().includes('invalid credentials') ||
          errorMessage?.toLowerCase().includes('wrong password')) {
        return {
          success: false,
          error: 'Invalid Credentials',
          message: 'The email or password you entered is incorrect. Please try again.',
          code: AuthErrorCode.INVALID_CREDENTIALS,
          details: data?.details
        };
      }

      if (errorMessage?.toLowerCase().includes('account locked') ||
          errorMessage?.toLowerCase().includes('locked')) {
        return {
          success: false,
          error: 'Account Locked',
          message: 'Your account has been temporarily locked due to too many failed login attempts. Please try again later or contact support.',
          code: AuthErrorCode.ACCOUNT_LOCKED,
          details: data?.details
        };
      }

      if (errorMessage?.toLowerCase().includes('disabled') ||
          errorMessage?.toLowerCase().includes('suspended')) {
        return {
          success: false,
          error: 'Account Disabled',
          message: 'Your account has been disabled. Please contact support for assistance.',
          code: AuthErrorCode.ACCOUNT_DISABLED,
          details: data?.details
        };
      }

      if (errorMessage?.toLowerCase().includes('not verified') ||
          errorMessage?.toLowerCase().includes('email verification')) {
        return {
          success: false,
          error: 'Email Not Verified',
          message: 'Please verify your email address before signing in.',
          code: AuthErrorCode.EMAIL_NOT_VERIFIED,
          details: data?.details
        };
      }

      // Default 401 error
      return {
        success: false,
        error: 'Authentication Failed',
        message: 'Invalid email or password. Please try again.',
        code: AuthErrorCode.INVALID_CREDENTIALS,
        details: data?.details
      };
    }

    if (status === 403) {
      const errorMessage = data?.message || data?.error || data?.detail || (error as any)?.message || (error as any)?.response?.statusText;

      // Check for email not verified in various ways
      if (errorMessage?.toLowerCase().includes('email not verified') ||
          errorMessage?.toLowerCase().includes('not verified') ||
          (errorMessage?.toLowerCase().includes('email') && errorMessage?.toLowerCase().includes('verified') && errorMessage?.toLowerCase().includes('not')) ||
          (errorMessage?.toLowerCase().includes('403') && errorMessage?.toLowerCase().includes('email') && errorMessage?.toLowerCase().includes('not verified'))) {
        return {
          success: false,
          error: 'Email Not Verified',
          message: 'Please verify your email address before signing in.',
          code: AuthErrorCode.EMAIL_NOT_VERIFIED,
          details: data?.details
        };
      }

      // Default 403 error
      return {
        success: false,
        error: 'Access Forbidden',
        message: 'Access to this resource is forbidden.',
        code: AuthErrorCode.SERVER_ERROR,
        details: data?.details
      };
    }

    if (status === 429) {
      return {
        success: false,
        error: 'Too Many Attempts',
        message: 'Too many login attempts. Please wait a few minutes before trying again.',
        code: AuthErrorCode.TOO_MANY_ATTEMPTS,
        details: data?.details
      };
    }

    if (status === 422) {
      // Validation errors
      const errorMessage = data?.message || data?.error || 'Invalid input data';
      return {
        success: false,
        error: 'Validation Error',
        message: errorMessage,
        code: AuthErrorCode.INVALID_EMAIL_FORMAT,
        details: data?.details
      };
    }

    if (status >= 500) {
      return {
        success: false,
        error: 'Server Error',
        message: 'A server error occurred. Please try again later.',
        code: AuthErrorCode.SERVER_ERROR,
        details: data?.details
      };
    }
  }

  // Network errors
  if (error?.code === 'NETWORK_ERROR' || !error?.response) {
    console.log('🔍 Network error detected');
    return {
      success: false,
      error: 'Connection Error',
      message: 'Unable to connect to the server. Please check your internet connection and server configuration.',
      code: AuthErrorCode.NETWORK_ERROR,
      details: { originalError: error }
    };
  }

  // Generic error fallback
  console.log('🔍 Generic error fallback - no response object');
  const fallbackResult: AuthError = {
    success: false,
    error: 'Authentication Error',
    message: (error as any)?.message || 'An unexpected error occurred. Please try again.',
    code: AuthErrorCode.SERVER_ERROR,
    details: { originalError: error }
  };
  return fallbackResult;
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  } catch (error) {
    const authError = parseAuthError(error);
    throw authError;
  }
}

export async function signup(credentials: SignupCredentials): Promise<SignupResponse> {
  try {
    const response = await apiClient.post<SignupResponse>('/auth/register', credentials);
    return response.data;
  } catch (error) {
    const authError = parseAuthError(error);
    throw authError;
  }
}

export async function resendVerification(email: string): Promise<ResendVerificationResponse> {
  try {
    const response = await apiClient.post<ResendVerificationResponse>('/auth/resend-verification-email', { email });
    return response.data;
  } catch (error) {
    const authError = parseAuthError(error);
    throw authError;
  }
}
