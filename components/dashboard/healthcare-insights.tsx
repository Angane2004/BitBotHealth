'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    AlertTriangle,
    TrendingUp,
    Lightbulb,
    Activity,
    RefreshCw,
    ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HealthcareInsight {
    id: string;
    type: 'prediction' | 'recommendation' | 'alert' | 'trend';
    title: string;
    description: string;
    confidence: number;
    priority: 'low' | 'medium' | 'high' | 'critical';
    category: 'capacity' | 'staffing' | 'equipment' | 'environmental' | 'outbreak';
    timestamp: Date;
    data?: any;
}

interface HealthcareInsightsProps {
    hospitalData?: any;
    aqiData?: any;
    predictionData?: any;
    autoRefresh?: boolean;
    refreshInterval?: number;
}

export function HealthcareInsights({
    hospitalData,
    aqiData,
    predictionData,
    autoRefresh = false,
    refreshInterval = 300000 // 5 minutes
}: HealthcareInsightsProps) {
    const [insights, setInsights] = useState<HealthcareInsight[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchInsights = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/healthcare/insights', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hospitalData,
                    aqiData,
                    predictionData,
                    timeframe: '7days'
                })
            });

            const data = await response.json();

            if (data.success) {
                setInsights(data.insights);
                setLastUpdated(new Date());
            } else {
                setError(data.error || 'Failed to fetch insights');
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.error('Insights fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInsights();

        if (autoRefresh) {
            const interval = setInterval(fetchInsights, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [hospitalData, aqiData, predictionData]);

    const getInsightIcon = (type: string) => {
        switch (type) {
            case 'alert': return AlertTriangle;
            case 'prediction': return TrendingUp;
            case 'recommendation': return Lightbulb;
            case 'trend': return Activity;
            default: return Lightbulb;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical': return 'bg-black text-white dark:bg-white dark:text-black border-2';
            case 'high': return 'bg-gray-700 text-white dark:bg-gray-300 dark:text-black';
            case 'medium': return 'bg-gray-500 text-white dark:bg-gray-500 dark:text-white';
            case 'low': return 'bg-gray-300 text-black dark:bg-gray-700 dark:text-white';
            default: return 'bg-gray-300 text-black dark:bg-gray-700 dark:text-white';
        }
    };

    return (
        <Card className="border-2 border-black dark:border-white bg-white dark:bg-black">
            <CardHeader className="border-b-2 border-black dark:border-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-black dark:bg-white">
                            <Activity className="h-5 w-5 text-white dark:text-black" />
                        </div>
                        <div>
                            <CardTitle className="text-black dark:text-white">Healthcare Analytics</CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                AI-Powered Insights & Recommendations
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchInsights}
                        disabled={loading}
                        className="border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
                {lastUpdated && (
                    <p className="text-xs text-gray-500 mt-2">
                        Last updated: {lastUpdated.toLocaleTimeString()}
                    </p>
                )}
            </CardHeader>
            <CardContent className="p-6">
                {error && (
                    <div className="p-4 border-2 border-black dark:border-white bg-gray-100 dark:bg-gray-900 rounded-lg mb-4">
                        <p className="text-sm text-black dark:text-white">{error}</p>
                    </div>
                )}

                {loading && insights.length === 0 ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-24 border-2 border-gray-300 dark:border-gray-700 rounded-lg animate-pulse bg-gray-100 dark:bg-gray-900"
                            />
                        ))}
                    </div>
                ) : insights.length === 0 ? (
                    <div className="text-center py-12">
                        <Activity className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">
                            No insights available. Add data to generate analytics.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <AnimatePresence>
                            {insights.map((insight, index) => {
                                const Icon = getInsightIcon(insight.type);
                                return (
                                    <motion.div
                                        key={insight.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="border-2 border-black dark:border-white rounded-lg p-4 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 rounded-lg bg-black dark:bg-white flex-shrink-0">
                                                <Icon className="h-5 w-5 text-white dark:text-black" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <h4 className="font-semibold text-black dark:text-white">
                                                        {insight.title}
                                                    </h4>
                                                    <Badge className={getPriorityColor(insight.priority)}>
                                                        {insight.priority}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                                                    {insight.description}
                                                </p>
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <span className="font-semibold">Confidence:</span>
                                                        {Math.round(insight.confidence * 100)}%
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <span className="font-semibold">Category:</span>
                                                        {insight.category}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <span className="font-semibold">Type:</span>
                                                        {insight.type}
                                                    </span>
                                                </div>
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default HealthcareInsights;
