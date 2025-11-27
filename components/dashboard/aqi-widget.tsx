'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockAQIData } from '@/lib/mock-data';
import { Wind } from 'lucide-react';
import { cn } from '@/lib/utils';

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

export function AQIWidget() {
    const { current } = mockAQIData;
    const category = getAQICategory(current);
    const color = getAQIColor(current);

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">Air Quality Index</CardTitle>
                        <CardDescription>Real-time AQI monitoring</CardDescription>
                    </div>
                    <Wind className="h-8 w-8 text-muted-foreground" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-end gap-2">
                        <div className="text-4xl font-bold">{current}</div>
                        <div className={cn('px-3 py-1 rounded-full text-white text-sm font-medium mb-1', color)}>
                            {category}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Health Impact</span>
                            <span className="font-medium text-red-600">High Risk</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                            <div
                                className={cn('h-2 rounded-full transition-all', color)}
                                style={{ width: `${Math.min((current / 500) * 100, 100)}%` }}
                            />
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        ⚠️ Expected to increase respiratory cases by 60% during Diwali week
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
