'use client';

import { useMemo, useState } from 'react';
import { mockNotifications, Notification } from '../mock-data';

export function useNotifications(city?: string) {
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

    // Filter notifications by city and past 7 days
    const filtered = useMemo(() => {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        return notifications
            .filter(n => {
                // Filter by city if provided
                if (city && n.city !== city) return false;
                // Filter by past 7 days
                if (n.timestamp < sevenDaysAgo) return false;
                return true;
            })
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // Newest first
    }, [notifications, city]);

    // Get unread count
    const unreadCount = useMemo(() => {
        return filtered.filter(n => !n.read).length;
    }, [filtered]);

    // Mark notification as read
    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read: true } : n))
        );
    };

    // Mark all as read
    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(n => (city ? (n.city === city ? { ...n, read: true } : n) : { ...n, read: true }))
        );
    };

    return {
        notifications: filtered,
        unreadCount,
        markAsRead,
        markAllAsRead,
    };
}
