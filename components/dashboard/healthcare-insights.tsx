'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertTriangle,
    TrendingUp,
    Lightbulb,
    Activity,
    ChevronRight,
    Sparkles,
    RefreshCw,
    Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveWeather } from '@/lib/hooks/weather';
import { useLocationStore } from '@/lib/hooks/useLocation';

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
    rationale?: string;
    impact?: string;
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
    autoRefresh = true,
    refreshInterval = 600000 // 10 minutes
}: HealthcareInsightsProps) {
    const [insights, setInsights] = useState<HealthcareInsight[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [selectedInsight, setSelectedInsight] = useState<HealthcareInsight | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    // Get real-time data
    const { location } = useLocationStore();
    const { snapshot: weatherSnapshot, loading: weatherLoading } = useLiveWeather({
        city: location?.city || 'Mumbai'
    });

    const fetchInsights = async () => {
        setLoading(true);
        setError(null);

        try {
            // Collect real-time data from multiple sources
            const requestData = {
                hospitalData: hospitalData || {
                    totalBeds: 500,
                    occupancyRate: 87,
                    occupiedBeds: 435,
                    trend: 'increasing'
                },
                aqiData: aqiData || {
                    value: weatherSnapshot?.aqi || 285,
                    location: location?.city || 'Mumbai',
                    category: weatherSnapshot?.aqi ? getAQICategory(weatherSnapshot.aqi) : 'Very Poor'
                },
                predictionData: predictionData || {
                    predictions: generateMockPredictions()
                },
                weatherData: {
                    temperature: weatherSnapshot?.temperature,
                    humidity: weatherSnapshot?.humidity,
                    conditions: weatherSnapshot?.description,
                    wind: weatherSnapshot?.wind
                },
                timeframe: '7days',
                timestamp: new Date().toISOString()
            };

            console.log('Sending data to Gemini AI:', requestData);

            const response = await fetch('/api/healthcare/insights', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();

            if (data.success) {
                setInsights(data.insights);
                setLastUpdated(new Date());
                console.log('Received AI insights:', data.insights);
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
        // Wait for weather data to load before first fetch
        if (!weatherLoading && weatherSnapshot) {
            fetchInsights();
        }
    }, [weatherSnapshot?.aqi, location?.city]); // Refetch when AQI or location changes

    useEffect(() => {
        if (autoRefresh && !weatherLoading) {
            const interval = setInterval(fetchInsights, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [autoRefresh, refreshInterval, weatherLoading]);

    const getInsightIcon = (type: string) => {
        switch (type) {
            case 'alert': return AlertTriangle;
            case 'prediction': return TrendingUp;
            case 'recommendation': return Lightbulb;
            case 'trend': return Activity;
            default: return Sparkles;
        }
    };

    const getPriorityStyle = (priority: string) => {
        switch (priority) {
            case 'critical':
                return 'bg-black text-white dark:bg-white dark:text-black border-2 border-black dark:border-white';
            case 'high':
                return 'bg-gray-800 text-white dark:bg-gray-200 dark:text-black border border-black dark:border-white';
            case 'medium':
                return 'bg-gray-200 text-black dark:bg-gray-800 dark:text-white border border-gray-400 dark:border-gray-600';
            default:
                return 'bg-white text-black dark:bg-black dark:text-white border border-gray-300 dark:border-gray-700';
        }
    };

    const getAQICategory = (aqi: number): string => {
        if (aqi <= 50) return 'Good';
        if (aqi <= 100) return 'Moderate';
        if (aqi <= 200) return 'Poor';
        if (aqi <= 300) return 'Very Poor';
        return 'Severe';
    };

    const generateMockPredictions = () => {
        return Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString(),
            predicted: 70 + Math.floor(Math.random() * 30)
        }));
    };

    return (
        <>
            <Card className="border-2 border-black dark:border-white bg-white dark:bg-black flex flex-col shadow-lg overflow-hidden">
                <CardHeader className="border-b-2 border-black dark:border-white py-4 px-5 bg-white dark:bg-black">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 flex-1">
                                <div className="p-2 rounded-xl bg-black dark:bg-white text-white dark:text-black shadow-md">
                                    <Sparkles className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <CardTitle className="text-lg font-bold text-black dark:text-white flex items-center gap-2 flex-wrap">
                                        Healthcare Analytics
                                        <Badge variant="outline" className="text-[10px] h-5 border-black dark:border-white text-black dark:text-white">
                                            Gemini AI
                                        </Badge>
                                    </CardTitle>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                                        Real-time AI Insights • {location?.city || 'Mumbai'}
                                    </p>
                                </div>
                            </div>
                            {lastUpdated && (
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 font-mono whitespace-nowrap">
                                        {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </p>
                                    {weatherSnapshot?.aqi && (
                                        <p className="text-[10px] text-gray-500 mt-0.5">
                                            AQI: {weatherSnapshot.aqi}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        <Button
                            onClick={fetchInsights}
                            disabled={loading}
                            className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-all shadow-sm group border border-transparent hover:border-black dark:hover:border-white"
                            size="sm"
                        >
                            {loading ? (
                                <>
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    Analyzing with Gemini AI...
                                </>
                            ) : (
                                <>
                                    <Zap className="h-4 w-4 mr-2" />
                                    Generate AI Insights
                                </>
                            )}
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="p-0 flex-1 overflow-y-auto max-h-[600px] scrollbar-hide">
                    {error && (
                        <div className="m-4 p-3 border-2 border-black dark:border-white bg-white dark:bg-black rounded-lg">
                            <p className="text-xs text-black dark:text-white font-mono">{error}</p>
                        </div>
                    )}

                    {loading && insights.length === 0 ? (
                        <div className="space-y-4 p-4">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="h-24 border border-gray-200 dark:border-gray-800 rounded-xl animate-pulse bg-gray-100 dark:bg-gray-900"
                                />
                            ))}
                        </div>
                    ) : insights.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-center p-6">
                            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-full mb-3">
                                <Sparkles className="h-6 w-6 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                No insights generated yet
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Click Generate to analyze real-time data
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            <AnimatePresence>
                                {insights.map((insight, index) => {
                                    const Icon = getInsightIcon(insight.type) || Sparkles;
                                    return (
                                        <motion.div
                                            key={insight.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2, delay: index * 0.05 }}
                                            onClick={() => {
                                                setSelectedInsight(insight);
                                                setIsDetailsOpen(true);
                                            }}
                                            className="p-4 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors group cursor-pointer border-l-4 border-transparent hover:border-black dark:hover:border-white"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1">
                                                    <div className={`h-6 w-6 rounded-full flex items-center justify-center border border-black dark:border-white ${insight.priority === 'critical' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-transparent text-black dark:text-white'}`}>
                                                        <Icon className="h-3.5 w-3.5" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0 space-y-1">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <h4 className="text-sm font-bold text-black dark:text-white leading-none">
                                                            {insight.title}
                                                        </h4>
                                                        <span className="text-[10px] font-mono text-gray-500">
                                                            {Math.round(insight.confidence * 100)}%
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                                        {insight.description}
                                                    </p>
                                                    <div className="flex items-center gap-2 pt-1">
                                                        <Badge variant="outline" className="text-[10px] px-1.5 h-5 font-normal border-gray-400 dark:border-gray-600 text-gray-600 dark:text-gray-400">
                                                            {insight.category}
                                                        </Badge>
                                                        <Badge className={`text-[10px] px-1.5 h-5 font-normal rounded-sm ${getPriorityStyle(insight.priority)}`}>
                                                            {insight.priority}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors self-center" />
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="border-2 border-black dark:border-white bg-white dark:bg-black sm:max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-black dark:bg-white rounded-lg">
                                <Sparkles className="h-5 w-5 text-white dark:text-black" />
                            </div>
                            <Badge variant="outline" className="border-black dark:border-white text-black dark:text-white">
                                AI Insight Details
                            </Badge>
                        </div>
                        <DialogTitle className="text-xl font-bold text-black dark:text-white">
                            {selectedInsight?.title}
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400">
                            Generated by Google Gemini AI
                        </DialogDescription>
                    </DialogHeader>

                    {selectedInsight && (
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800">
                                <p className="text-sm text-black dark:text-white leading-relaxed">
                                    {selectedInsight.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Category</label>
                                    <p className="text-sm font-medium capitalize">{selectedInsight.category}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Priority</label>
                                    <Badge className={`rounded-sm ${getPriorityStyle(selectedInsight.priority)}`}>
                                        {selectedInsight.priority}
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Confidence</label>
                                    <p className="text-sm font-medium">{Math.round(selectedInsight.confidence * 100)}%</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Type</label>
                                    <p className="text-sm font-medium capitalize">{selectedInsight.type}</p>
                                </div>
                            </div>

                            {selectedInsight.data?.source && (
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                                        <Lightbulb className="h-3 w-3" /> Data Source
                                    </label>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        {selectedInsight.data.source === 'gemini-ai' ? 'Google Gemini AI Analysis' : 'Fallback Analytics'}
                                    </p>
                                </div>
                            )}

                            <Button onClick={() => setIsDetailsOpen(false)} className="w-full bg-black dark:bg-white text-white dark:text-black">
                                Close
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

export default HealthcareInsights;
