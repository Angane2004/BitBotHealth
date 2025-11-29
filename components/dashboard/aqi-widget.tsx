'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wind } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocationStore } from '@/lib/hooks/useLocation';
import { useLiveWeather } from '@/lib/hooks/weather';

const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'bg-green-500';
    if (aqi <= 100) return 'bg-yellow-500';
    if (aqi <= 200) return 'bg-orange-500';
    if (aqi <= 300) return 'bg-red-500';
    return 'bg-purple-500';
};

const getAQICategory = (aqi: number) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 200) return 'Poor';
    if (aqi <= 300) return 'Very Poor';
    return 'Severe';
};

const getHealthImpact = (aqi: number) => {
    if (aqi <= 50) return { text: 'Low Risk', color: 'text-green-600' };
    if (aqi <= 100) return { text: 'Moderate Risk', color: 'text-yellow-600' };
    if (aqi <= 200) return { text: 'Unhealthy', color: 'text-orange-600' };
    if (aqi <= 300) return { text: 'High Risk', color: 'text-red-600' };
    return { text: 'Severe Risk', color: 'text-purple-600' };
};

export function AQIWidget() {
    const { location } = useLocationStore();
    const { snapshot } = useLiveWeather({ city: location?.city || 'Delhi' });

    const current = snapshot?.aqi ?? 285;
    const city = location?.city || 'Delhi';
    const category = getAQICategory(current);
    const color = getAQIColor(current);
    const healthImpact = getHealthImpact(current);

    return (
        <Card className="hover:shadow-lg transition-shadow border-2 bg-white dark:bg-gray-900">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg text-black dark:text-white">Air Quality Index</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                            {city} - Real-time monitoring
                        </CardDescription>
                    </div>
                    <Wind className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-end gap-2">
                        <div className="text-4xl font-bold text-black dark:text-white">{current}</div>
                        <div className={cn('px-3 py-1 rounded-full text-white text-sm font-medium mb-1', color)}>
                            {category}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Health Impact</span>
                            <span className={cn('font-medium', healthImpact.color)}>{healthImpact.text}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                                className={cn('h-2 rounded-full transition-all', color)}
                                style={{ width: `${Math.min((current / 500) * 100, 100)}%` }}
                            />
                        </div>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        {current > 200
                            ? '⚠️ Expected to increase respiratory cases significantly'
                            : current > 100
                                ? '⚠️ Sensitive groups should limit outdoor exposure'
                                : '✓ Air quality is acceptable for most people'
                        }
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
