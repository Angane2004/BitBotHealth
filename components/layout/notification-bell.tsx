'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, AlertTriangle, Info, AlertCircle, Wind, Briefcase } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocationStore } from '@/lib/hooks/useLocation';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { location } = useLocationStore();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(location?.city);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [open]);

  const getSeverityIcon = (severity: 'info' | 'warning' | 'critical') => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTypeIcon = (type: 'aqi' | 'project') => {
    return type === 'aqi' ? <Wind className="h-4 w-4" /> : <Briefcase className="h-4 w-4" />;
  };

  // Group notifications by type
  const aqiNotifications = notifications.filter(n => n.type === 'aqi');
  const projectNotifications = notifications.filter(n => n.type === 'project');

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative rounded-full border border-black/10 dark:border-white/15 p-2 hover:bg-black/5 dark:hover:bg-white/10 transition"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-black dark:text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-semibold animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-3 w-96 max-h-[600px] overflow-y-auto rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 shadow-2xl z-50"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-black/10 dark:border-white/10 p-4 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-black dark:text-white">
                    Notifications {location?.city && `(${location.city})`}
                  </p>
                  <p className="text-xs text-gray-500">Past 7 days</p>
                </div>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    Mark all read
                  </Button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="p-2">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No notifications
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {location?.city ? `No alerts for ${location.city}` : 'Select a location to see notifications'}
                  </p>
                </div>
              ) : (
                <>
                  {/* AQI Alerts */}
                  {aqiNotifications.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 px-2 py-1 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        <Wind className="h-3 w-3" />
                        AQI Alerts
                      </div>
                      <div className="space-y-1">
                        {aqiNotifications.map((notification) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`p-3 rounded-xl cursor-pointer transition-all hover:bg-black/5 dark:hover:bg-white/5 ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                              }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5">{getSeverityIcon(notification.severity)}</div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-sm font-medium text-black dark:text-white">
                                    {notification.title}
                                  </p>
                                  {!notification.read && (
                                    <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                  {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Project Updates */}
                  {projectNotifications.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 px-2 py-1 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        <Briefcase className="h-3 w-3" />
                        Project Updates
                      </div>
                      <div className="space-y-1">
                        {projectNotifications.map((notification) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`p-3 rounded-xl cursor-pointer transition-all hover:bg-black/5 dark:hover:bg-white/5 ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                              }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5">{getSeverityIcon(notification.severity)}</div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-sm font-medium text-black dark:text-white">
                                    {notification.title}
                                  </p>
                                  {!notification.read && (
                                    <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                  {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
