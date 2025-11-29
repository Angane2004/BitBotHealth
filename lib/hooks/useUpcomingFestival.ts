'use client';

import { mockFestivals } from '../mock-data';
import { differenceInDays } from 'date-fns';
import { useMemo } from 'react';

export interface UpcomingFestival {
    name: string;
    date: Date;
    impact: 'high' | 'medium' | 'low';
    description?: string;
    daysUntil: number;
    countdownText: string;
}

export function useUpcomingFestival(): UpcomingFestival | null {
    return useMemo(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Reset to start of day for accurate comparison

        // Filter future festivals and sort by date
        const upcomingFestivals = mockFestivals
            .filter(f => f.date >= now)
            .sort((a, b) => a.date.getTime() - b.date.getTime());

        if (upcomingFestivals.length === 0) {
            return null;
        }

        const nextFestival = upcomingFestivals[0];
        const daysUntil = differenceInDays(nextFestival.date, now);

        // Format countdown text
        let countdownText: string;
        if (daysUntil === 0) {
            countdownText = 'Today';
        } else if (daysUntil === 1) {
            countdownText = 'Tomorrow';
        } else {
            countdownText = `T-${daysUntil}`;
        }

        return {
            ...nextFestival,
            impact: nextFestival.impact as 'high' | 'medium' | 'low',
            daysUntil,
            countdownText,
        };
    }, []);
}
