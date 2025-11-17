import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'capacity';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  resourceType?: 'country' | 'region' | 'host';
  resourceId?: string;
  resourceName?: string;
  timestamp: string;
  read: boolean;
  dismissed: boolean;
  actionUrl?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  preferences: {
    enabled: boolean;
    capacityWarnings: boolean;
    capacityThresholds: {
      warning: number; // 80%
      critical: number; // 90%
    };
    browserNotifications: boolean;
    emailNotifications: boolean;
  };

  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read' | 'dismissed'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  clearAll: () => void;
  updatePreferences: (preferences: Partial<NotificationState['preferences']>) => void;
  getUnreadNotifications: () => Notification[];
  getNotificationsByType: (type: NotificationType) => Notification[];
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,

      preferences: {
        enabled: true,
        capacityWarnings: true,
        capacityThresholds: {
          warning: 80,
          critical: 90,
        },
        browserNotifications: false,
        emailNotifications: false,
      },

      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          read: false,
          dismissed: false,
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));

        // Request browser notification if enabled
        if (get().preferences.browserNotifications && notification.priority === 'critical') {
          requestBrowserNotification(newNotification);
        }
      },

      markAsRead: (id) => {
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          if (!notification || notification.read) return state;

          return {
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, read: true } : n
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
          };
        });
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        }));
      },

      dismissNotification: (id) => {
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          const wasUnread = notification && !notification.read;

          return {
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, dismissed: true } : n
            ),
            unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
          };
        });
      },

      clearAll: () => {
        set({
          notifications: [],
          unreadCount: 0,
        });
      },

      updatePreferences: (preferences) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...preferences,
          },
        }));
      },

      getUnreadNotifications: () => {
        return get().notifications.filter((n) => !n.read && !n.dismissed);
      },

      getNotificationsByType: (type) => {
        return get().notifications.filter((n) => n.type === type && !n.dismissed);
      },
    }),
    {
      name: 'ipam-notifications',
      partialize: (state) => ({
        notifications: state.notifications.slice(0, 100), // Keep last 100
        preferences: state.preferences,
      }),
    }
  )
);

/**
 * Request browser notification permission and show notification
 */
function requestBrowserNotification(notification: Notification) {
  if (!('Notification' in window)) {
    return;
  }

  if (Notification.permission === 'granted') {
    showBrowserNotification(notification);
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        showBrowserNotification(notification);
      }
    });
  }
}

/**
 * Show browser notification
 */
function showBrowserNotification(notification: Notification) {
  const browserNotif = new Notification(notification.title, {
    body: notification.message,
    icon: '/icons/notification-icon.png',
    badge: '/icons/badge-icon.png',
    tag: notification.id,
    requireInteraction: notification.priority === 'critical',
  });

  browserNotif.onclick = () => {
    window.focus();
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
    browserNotif.close();
  };
}
