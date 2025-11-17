// API response types

export interface ApiError {
  success: false;
  error: string;
  message: string;
  details?: Record<string, any>;
  code?: string; // Add error code for specific error types
}

export interface ApiSuccess<T = any> {
  success: true;
  data: T;
  message?: string;
}

export type ApiResponse<T = any> = ApiSuccess<T> | ApiError;

// Auth-specific error types
export enum AuthErrorCode {
  USER_NOT_FOUND = 'user_not_found',
  INVALID_CREDENTIALS = 'invalid_credentials',
  ACCOUNT_LOCKED = 'account_locked',
  ACCOUNT_DISABLED = 'account_disabled',
  EMAIL_NOT_VERIFIED = 'email_not_verified',
  TOO_MANY_ATTEMPTS = 'too_many_attempts',
  INVALID_EMAIL_FORMAT = 'invalid_email_format',
  WEAK_PASSWORD = 'weak_password',
  USERNAME_TAKEN = 'username_taken',
  EMAIL_TAKEN = 'email_taken',
  SERVER_ERROR = 'server_error',
  NETWORK_ERROR = 'network_error',
}

export interface AuthError extends ApiError {
  code: AuthErrorCode;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
  plan?: string;
  role?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  permissions: string[];
}

export interface LoginResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface SignupResponse {
  access_token: string;
  token_type: string;
  issued_at: number;
  expires_at: number;
  is_verified: boolean;
  two_fa_enabled: boolean;
}

export interface ResendVerificationResponse {
  success: boolean;
  message: string;
}
