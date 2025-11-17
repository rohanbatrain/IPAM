'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useServerStore } from '@/lib/store/server-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Server, Globe, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ServerSetupPage() {
  const router = useRouter();
  const { serverUrl, isConfigured, setServerUrl, resetServer } = useServerStore();
  const [inputUrl, setInputUrl] = useState(serverUrl);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  // If already configured, redirect to login
  // If already configured, show a notice and let the user continue manually.
  if (isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-xl text-center">
          <h2 className="text-2xl font-semibold mb-2">Server Already Configured</h2>
          <p className="text-sm text-gray-600 mb-4">This instance is already connected to a backend server.</p>
          <p className="text-xs text-gray-500 mb-4">
            Active backend:{' '}
            <span
              title={serverUrl}
              className="inline-block max-w-[40ch] align-middle overflow-hidden text-ellipsis whitespace-nowrap px-3 py-1 bg-gray-100 border border-gray-200 rounded-md text-sm font-mono text-gray-700"
            >
              {serverUrl}
            </span>
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => router.push('/login')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Continue to Login
            </button>

            <button
              onClick={() => {
                const defaultUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                try {
                  resetServer();
                  setInputUrl(defaultUrl);
                  setTestResult(null);
                  toast.success('Server reset to default');
                } catch (e) {
                  console.error('Reset failed', e);
                  toast.error('Failed to reset server configuration');
                }
              }}
              className="px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-700"
            >
              Reset Server
            </button>
          </div>
        </div>
      </div>
    );
  }

  const validateUrl = (url: string): boolean => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const testConnection = async () => {
    if (!validateUrl(inputUrl)) {
      toast.error('Please enter a valid HTTP or HTTPS URL');
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      // Test connection by trying to reach the server's health endpoint
      const response = await fetch(`${inputUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Short timeout for connection test
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        setTestResult('success');
        toast.success('Server connection successful!');
      } else {
        throw new Error(`Server responded with status ${response.status}`);
      }
    } catch {
      setTestResult('error');
      toast.error('Failed to connect to server. Please check the URL and try again.');
    } finally {
      setIsTesting(false);
    }
  };

  const handleContinue = () => {
    if (!validateUrl(inputUrl)) {
      toast.error('Please enter a valid server URL');
      return;
    }

    try {
      setServerUrl(inputUrl);
      toast.success('Server configured successfully!');
      router.push('/login');
    } catch {
      toast.error('Failed to save server configuration');
    }
  };

  const useDefaultServer = () => {
    const defaultUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    setInputUrl(defaultUrl);
    setTestResult(null);
  };

  const handleReset = () => {
    const defaultUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    try {
      resetServer();
      setInputUrl(defaultUrl);
      setTestResult(null);
      toast.success('Server reset to default');
    } catch (e) {
      console.error('Reset failed', e);
      toast.error('Failed to reset server configuration');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
            <Server className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Server Configuration</h1>
          <p className="text-gray-600">Configure your Second Brain Database server</p>
          <p className="text-sm text-gray-500 mt-1">Connect to your own backend or use the default</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold text-center flex items-center justify-center gap-2">
              <Globe className="w-5 h-5" />
              Backend Server
            </CardTitle>
            <CardDescription className="text-center">
              Enter the URL of your Second Brain Database server. All API requests will be sent to this server.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="serverUrl" className="text-sm font-medium text-gray-700">
                Server URL
              </Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="serverUrl"
                  type="url"
                  placeholder="https://your-server.com or http://localhost:8000"
                  value={inputUrl}
                  onChange={(e) => {
                    setInputUrl(e.target.value);
                    setTestResult(null);
                  }}
                  className="pl-10 h-11 text-sm font-mono"
                />
              </div>
              <p className="text-xs text-gray-500">
                Include the protocol (http:// or https://) and port if needed
              </p>
            </div>

            {/* Connection Test */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full h-10"
                onClick={testConnection}
                disabled={isTesting || !inputUrl.trim()}
              >
                {isTesting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Testing Connection...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Test Connection
                  </div>
                )}
              </Button>

              {testResult && (
                <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                  testResult === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {testResult === 'success' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  {testResult === 'success'
                    ? 'Connection successful! Server is responding.'
                    : 'Connection failed. Please check the URL and server status.'
                  }
                </div>
              )}
            </div>

            {/* Quick Options */}
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-gray-500 font-medium">Quick Setup</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={useDefaultServer}
                  className="justify-start"
                >
                  <Server className="w-4 h-4 mr-2" />
                  Use Local Server (localhost:8000)
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setInputUrl('https://api.secondbraindatabase.com')}
                  className="justify-start"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Use Cloud Server
                </Button>
              </div>
            </div>

            {/* Continue Button */}
            <Button
              onClick={handleContinue}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-200"
              disabled={!inputUrl.trim() || !validateUrl(inputUrl)}
            >
              Continue to Login
            </Button>

            {/* Reset to default */}
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="w-full h-10 mt-3"
            >
              Reset Server
            </Button>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Your server configuration will be saved locally and can be changed anytime from settings.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help setting up your server?{' '}
            <a
              href="https://docs.secondbraindatabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline"
            >
              View Documentation
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}