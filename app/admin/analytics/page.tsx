'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, TrendingUp, Activity } from 'lucide-react';

export default function AnalyticsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-black dark:text-white">
                    Analytics
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Comprehensive insights and trends
                </p>
            </div>

            <Card className="border-2 border-black dark:border-white">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                            <BarChart className="h-5 w-5 text-white" />
                        </div>
                        <span>Coming Soon</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                        Advanced analytics dashboard with real-time metrics and forecasting tools.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
