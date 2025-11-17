'use client';

import { useNotificationStore } from '@/lib/store/notification-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Bell, AlertTriangle, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function NotificationSettingsPage() {
  const { preferences, updatePreferences } = useNotificationStore();

  const handleToggle = (key: keyof typeof preferences, value: boolean) => {
    updatePreferences({ [key]: value });
    toast.success('Notification preferences updated');
  };

  const handleThresholdChange = (type: 'warning' | 'critical', value: number[]) => {
    updatePreferences({
      capacityThresholds: {
        ...preferences.capacityThresholds,
        [type]: value[0],
      },
    });
  };

  const requestBrowserNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('Browser notifications are not supported');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      updatePreferences({ browserNotifications: true });
      toast.success('Browser notifications enabled');
    } else {
      toast.error('Browser notification permission denied');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Notification Settings</h2>
        <p className="text-muted-foreground">
          Manage how and when you receive notifications
        </p>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              General Notifications
            </CardTitle>
            <CardDescription>
              Control overall notification behavior
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enabled">Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive in-app notifications for important events
                </p>
              </div>
              <Switch
                id="enabled"
                checked={preferences.enabled}
                onCheckedChange={(checked: boolean) => handleToggle('enabled', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Capacity Warnings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Capacity Warnings
            </CardTitle>
            <CardDescription>
              Get notified when resources reach capacity thresholds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="capacity-warnings">Enable Capacity Warnings</Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts when regions or countries reach capacity limits
                </p>
              </div>
              <Switch
                id="capacity-warnings"
                checked={preferences.capacityWarnings}
                onCheckedChange={(checked: boolean) => handleToggle('capacityWarnings', checked)}
                disabled={!preferences.enabled}
              />
            </div>

            {preferences.capacityWarnings && (
              <>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Warning Threshold</Label>
                      <span className="text-sm font-medium">
                        {preferences.capacityThresholds.warning}%
                      </span>
                    </div>
                    <Slider
                      value={[preferences.capacityThresholds.warning]}
                      onValueChange={(value: number[]) => handleThresholdChange('warning', value)}
                      min={50}
                      max={95}
                      step={5}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Show warning badge when capacity reaches this percentage
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Critical Threshold</Label>
                      <span className="text-sm font-medium">
                        {preferences.capacityThresholds.critical}%
                      </span>
                    </div>
                    <Slider
                      value={[preferences.capacityThresholds.critical]}
                      onValueChange={(value: number[]) => handleThresholdChange('critical', value)}
                      min={preferences.capacityThresholds.warning + 5}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Show critical alert when capacity reaches this percentage
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Browser Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Browser Notifications
            </CardTitle>
            <CardDescription>
              Receive notifications even when the app is not open
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="browser-notifications">Enable Browser Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get desktop notifications for critical alerts
                </p>
              </div>
              <Switch
                id="browser-notifications"
                checked={preferences.browserNotifications}
                onCheckedChange={(checked: boolean) => {
                  if (checked) {
                    requestBrowserNotificationPermission();
                  } else {
                    handleToggle('browserNotifications', false);
                  }
                }}
                disabled={!preferences.enabled}
              />
            </div>

            {!preferences.browserNotifications && (
              <Button
                variant="outline"
                size="sm"
                onClick={requestBrowserNotificationPermission}
                disabled={!preferences.enabled}
              >
                Request Permission
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Email Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Notifications
            </CardTitle>
            <CardDescription>
              Receive email alerts for important events
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Enable Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get email alerts for critical capacity warnings
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={preferences.emailNotifications}
                onCheckedChange={(checked: boolean) => handleToggle('emailNotifications', checked)}
                disabled={!preferences.enabled}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
