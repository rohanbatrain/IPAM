'use client';

import { useNotificationStore } from '@/lib/store/notification-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bell, Save } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const { preferences, updatePreferences } = useNotificationStore();
  const [localPrefs, setLocalPrefs] = useState(preferences);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updatePreferences(localPrefs);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRequestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setLocalPrefs({ ...localPrefs, browserNotifications: true });
      }
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your notification preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Configure when and how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enabled">Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications for important events
              </p>
            </div>
            <input
              type="checkbox"
              id="enabled"
              checked={localPrefs.enabled}
              onChange={(e) =>
                setLocalPrefs({ ...localPrefs, enabled: e.target.checked })
              }
              className="h-4 w-4"
            />
          </div>

          {/* Capacity Warnings */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="capacityWarnings">Capacity Warnings</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when regions or countries reach capacity thresholds
              </p>
            </div>
            <input
              type="checkbox"
              id="capacityWarnings"
              checked={localPrefs.capacityWarnings}
              onChange={(e) =>
                setLocalPrefs({
                  ...localPrefs,
                  capacityWarnings: e.target.checked,
                })
              }
              className="h-4 w-4"
              disabled={!localPrefs.enabled}
            />
          </div>

          {/* Warning Threshold */}
          <div className="space-y-2">
            <Label htmlFor="capacityThreshold">
              Warning Threshold ({localPrefs.capacityThresholds.warning}%)
            </Label>
            <p className="text-sm text-muted-foreground">
              Show warning when capacity reaches this percentage
            </p>
            <Input
              type="range"
              id="capacityThreshold"
              min="50"
              max="95"
              step="5"
              value={localPrefs.capacityThresholds.warning}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLocalPrefs({
                  ...localPrefs,
                  capacityThresholds: {
                    ...localPrefs.capacityThresholds,
                    warning: parseInt(e.target.value),
                  },
                })
              }
              disabled={!localPrefs.enabled || !localPrefs.capacityWarnings}
            />
          </div>

          {/* Critical Threshold */}
          <div className="space-y-2">
            <Label htmlFor="criticalThreshold">
              Critical Threshold ({localPrefs.capacityThresholds.critical}%)
            </Label>
            <p className="text-sm text-muted-foreground">
              Show critical alert when capacity reaches this percentage
            </p>
            <Input
              type="range"
              id="criticalThreshold"
              min="60"
              max="100"
              step="5"
              value={localPrefs.capacityThresholds.critical}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLocalPrefs({
                  ...localPrefs,
                  capacityThresholds: {
                    ...localPrefs.capacityThresholds,
                    critical: parseInt(e.target.value),
                  },
                })
              }
              disabled={!localPrefs.enabled || !localPrefs.capacityWarnings}
            />
          </div>

          {/* Browser Notifications */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="browserNotifications">
                  Browser Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Show desktop notifications even when tab is not active
                </p>
              </div>
              <input
                type="checkbox"
                id="browserNotifications"
                checked={localPrefs.browserNotifications}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleRequestNotificationPermission();
                  } else {
                    setLocalPrefs({
                      ...localPrefs,
                      browserNotifications: false,
                    });
                  }
                }}
                className="h-4 w-4"
                disabled={!localPrefs.enabled}
              />
            </div>
            {localPrefs.browserNotifications &&
              'Notification' in window &&
              Notification.permission === 'denied' && (
                <p className="text-sm text-destructive">
                  Browser notifications are blocked. Please enable them in your
                  browser settings.
                </p>
              )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} disabled={saved}>
              <Save className="h-4 w-4 mr-2" />
              {saved ? 'Saved!' : 'Save Preferences'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
