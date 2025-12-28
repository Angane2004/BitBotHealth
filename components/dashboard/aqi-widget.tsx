'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wind, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocationStore } from '@/lib/hooks/useLocation';
import { useLiveWeather } from '@/lib/hooks/weather';
import { Badge } from '@/components/ui/badge';

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
    const { snapshot, loading, error } = useLiveWeather({ city: location?.city || 'Mumbai' });

    const city = location?.city || 'Mumbai';
    const isRealData = snapshot?.aqi !== undefined && !error;
    const current = snapshot?.aqi ?? 285; // Fallback only if API fails
    const category = getAQICategory(current);
    const color = getAQIColor(current);
    const healthImpact = getHealthImpact(current);

    return (
        <Card className="hover:shadow-lg transition-shadow border-2 bg-white dark:bg-gray-900 border-black dark:border-gray-800">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-lg text-black dark:text-white">Air Quality Index</CardTitle>
                            {loading && (
                                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                            )}
                        </div>
                        <CardDescription className="text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                            {city} - {isRealData ? 'Real-time monitoring' : 'Demo data'}
                            {!isRealData && !loading && (
                                <Badge variant="outline" className="text-[10px] h-4 border-orange-400 text-orange-600">
                                    API Key Required
                                </Badge>
                            )}
                        </CardDescription>
                    </div>
                    <Wind className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                </div>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-lg flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-orange-800 dark:text-orange-200">
                            <p className="font-semibold mb-1">OpenWeather API Key Not Configured</p>
                            <p className="text-orange-700 dark:text-orange-300">
                                Add <code className="bg-orange-100 dark:bg-orange-900/30 px-1 rounded">NEXT_PUBLIC_OPENWEATHER_API_KEY</code> to <code className="bg-orange-100 dark:bg-orange-900/30 px-1 rounded">.env.local</code> for real-time data.
                            </p>
                            <p className="mt-1 text-orange-600 dark:text-orange-400">Showing demo data below.</p>
                        </div>
                    </div>
                )}

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

                    {isRealData && snapshot && (
                        <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <span className="text-gray-500">Temperature:</span>
                                    <span className="ml-1 font-medium text-black dark:text-white">{snapshot.temperature}°C</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Humidity:</span>
                                    <span className="ml-1 font-medium text-black dark:text-white">{snapshot.humidity}%</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
