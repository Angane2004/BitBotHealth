'use client';

import { useMemo, useState, useEffect } from 'react';
import { useLiveWeather } from './weather';

export interface Notification {
    id: string;
    type: 'aqi' | 'project' | 'system';
    severity: 'info' | 'warning' | 'critical';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    city?: string;
    data?: any;
}

export function useNotifications(city?: string) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { snapshot } = useLiveWeather({ city: city || 'Mumbai' });

    // Generate real-time AQI notifications based on live data
    useEffect(() => {
        if (!snapshot?.aqi) return;

        const aqiNotifications: Notification[] = [];
        const aqi = snapshot.aqi;

        // Critical AQI Alert
        if (aqi > 300) {
            aqiNotifications.push({
                id: `aqi-critical-${Date.now()}`,
                type: 'aqi',
                severity: 'critical',
                title: 'Hazardous Air Quality',
                message: `AQI level ${aqi} in ${city || 'Mumbai'}. Health emergency - avoid all outdoor activities. Expect significant surge in respiratory admissions.`,
                timestamp: new Date(),
                read: false,
                city: city || 'Mumbai',
                data: { aqi, category: 'Hazardous' }
            });
        } else if (aqi > 200) {
            aqiNotifications.push({
                id: `aqi-warning-${Date.now()}`,
                type: 'aqi',
                severity: 'warning',
                title: 'Very Unhealthy Air Quality',
                message: `AQI ${aqi} in ${city || 'Mumbai'}. Prepare for 40-50% increase in respiratory cases. Activate emergency protocols.`,
                timestamp: new Date(),
                read: false,
                city: city || 'Mumbai',
                data: { aqi, category: 'Very Unhealthy' }
            });
        } else if (aqi > 150) {
            aqiNotifications.push({
                id: `aqi-alert-${Date.now()}`,
                type: 'aqi',
                severity: 'warning',
                title: 'Unhealthy Air Quality',
                message: `AQI ${aqi} in ${city || 'Mumbai'}. Expect 25-30% increase in respiratory consultations. Prepare additional capacity.`,
                timestamp: new Date(),
                read: false,
                city: city || 'Mumbai',
                data: { aqi, category: 'Unhealthy' }
            });
        } else if (aqi > 100) {
            aqiNotifications.push({
                id: `aqi-info-${Date.now()}`,
                type: 'aqi',
                severity: 'info',
                title: 'Moderate Air Quality',
                message: `AQI ${aqi} in ${city || 'Mumbai'}. Monitor sensitive patient populations closely.`,
                timestamp: new Date(),
                read: false,
                city: city || 'Mumbai',
                data: { aqi, category: 'Moderate' }
            });
        }

        // Update notifications with real-time AQI data
        setNotifications(prev => {
            // Remove old AQI notifications for this city
            const filtered = prev.filter(n => !(n.type === 'aqi' && n.city === (city || 'Mumbai')));
            // Add new AQI notifications
            return [...aqiNotifications, ...filtered];
        });
    }, [snapshot?.aqi, city]);

    // Filter notifications by city and past 7 days
    const filtered = useMemo(() => {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        return notifications
            .filter(n => {
                // Filter by city if provided
                if (city && n.city && n.city !== city) return false;
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
