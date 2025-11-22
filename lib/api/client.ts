import axios, { InternalAxiosRequestConfig } from 'axios';

// Dynamic server URL getter - will be set by the server store
let getServerUrl = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const setServerUrlGetter = (getter: () => string) => {
  getServerUrl = getter;
  // Update baseURL when getter changes
  updateBaseURL();
};

// Token refresh function
const refreshAccessToken = async () => {
  if (typeof window === 'undefined') {
    throw new Error('Cannot refresh token on server side');
  }

  const authData = localStorage.getItem('sbd-auth');
  if (!authData) {
    throw new Error('No auth data available');
  }

  try {
    const parsed = JSON.parse(authData);
    const refreshToken = parsed.state?.refreshToken;

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('Attempting token refresh...');
    }

    // Call refresh endpoint
    const response = await axios.post(
      `${getServerUrl()}/auth/refresh`,
      { refresh_token: refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const { access_token, refresh_token: newRefreshToken } = response.data;

    if (process.env.NODE_ENV !== 'production') {
      console.log('Token refreshed successfully');
    }

    // Update stored tokens in Zustand format
    parsed.state.accessToken = access_token;
    if (newRefreshToken) {
      parsed.state.refreshToken = newRefreshToken;
    }
    localStorage.setItem('sbd-auth', JSON.stringify(parsed));

    return { access_token, refresh_token: newRefreshToken };
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};

const apiClient = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dynamic baseURL setter
const updateBaseURL = () => {
  apiClient.defaults.baseURL = getServerUrl();
};

// Initialize baseURL
updateBaseURL();

// Request interceptor: Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const authData = localStorage.getItem('sbd-auth');
      if (authData) {
        try {
          const parsed = JSON.parse(authData);
          // Zustand persist stores data in a 'state' property
          const accessToken = parsed.state?.accessToken;
          if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
        } catch (error) {
          console.error('Failed to parse auth data:', error);
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling token refresh and redirects
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry or redirect for auth requests - let the auth components handle the errors
      if (originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/signup')) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const newTokens = await refreshAccessToken();

        // Update the request with new token
        originalRequest.headers.Authorization = `Bearer ${newTokens.access_token}`;

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);

        // Clear stored tokens
        if (typeof window !== 'undefined') {
          localStorage.removeItem('sbd-auth');
        }

        // Check if we're on a public page or making a request to a public endpoint
        const isPublicPage = ['/', '/server-setup', '/download'].some(path =>
          typeof window !== 'undefined' && (
            window.location.pathname === path ||
            window.location.pathname.startsWith(path + '/')
          )
        );

        const isPublicEndpoint = originalRequest.url?.includes('/analytics') ||
          originalRequest.url?.includes('/health') ||
          originalRequest.url?.includes('/public');

        if (!isPublicPage && !isPublicEndpoint) {
          if (process.env.NODE_ENV !== 'production') {
            console.log('Redirecting to login due to auth failure');
          }
          // Only redirect to login if not on a public page and not accessing a public endpoint
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
        } else {
          if (process.env.NODE_ENV !== 'production') {
            console.log('On public page or accessing public endpoint, not redirecting to login');
          }
        }

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
