'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format, addDays } from 'date-fns';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';

interface PredictionChartProps {
    department?: string;
}

function seededRandom(seed: number) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

export function PredictionChart({ department = 'Emergency' }: PredictionChartProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const data = useMemo(() => {
        const baseSeed = department.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return Array.from({ length: 7 }, (_, i) => {
            const date = addDays(new Date(), i);
            const variance = seededRandom(baseSeed + i) * 30;
            const baseValue = 70 + variance;
            return {
                date: format(date, 'MMM dd'),
                predicted: Math.round(baseValue),
                lower: Math.round(baseValue - 8 - seededRandom(baseSeed + i * 2) * 5),
                upper: Math.round(baseValue + 8 + seededRandom(baseSeed + i * 3) * 5),
                actual: i === 0 ? Math.round(baseValue + (seededRandom(baseSeed + i * 4) - 0.5) * 10) : null,
            };
        });
    }, [department]);

    return (
        <Card className="col-span-full hover:shadow-lg transition-shadow border-2 bg-white dark:bg-gray-900">
            <CardHeader>
                <CardTitle className="text-black dark:text-white">7-Day Patient Volume Forecast</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                    {department} Department • Predicted admissions with confidence intervals
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={isDark ? "#ffffff" : "#000000"} stopOpacity={0.2} />
                                <stop offset="95%" stopColor={isDark ? "#ffffff" : "#000000"} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={isDark ? "#374151" : "#e5e7eb"}
                        />
                        <XAxis
                            dataKey="date"
                            className="text-xs"
                            tick={{ fill: isDark ? '#9ca3af' : '#6b7280' }}
                            stroke={isDark ? '#4b5563' : '#d1d5db'}
                        />
                        <YAxis
                            className="text-xs"
                            tick={{ fill: isDark ? '#9ca3af' : '#6b7280' }}
                            stroke={isDark ? '#4b5563' : '#d1d5db'}
                            label={{
                                value: 'Patients',
                                angle: -90,
                                position: 'insideLeft',
                                fill: isDark ? '#9ca3af' : '#6b7280'
                            }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                                border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                                borderRadius: '8px',
                                color: isDark ? '#ffffff' : '#000000'
                            }}
                        />
                        <Legend
                            wrapperStyle={{
                                color: isDark ? '#ffffff' : '#000000'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="upper"
                            stroke="none"
                            fill={isDark ? "#4b5563" : "#e5e7eb"}
                            fillOpacity={0.4}
                        />
                        <Area
                            type="monotone"
                            dataKey="lower"
                            stroke="none"
                            fill={isDark ? "#111827" : "#ffffff"}
                            fillOpacity={1}
                        />
                        <Line
                            type="monotone"
                            dataKey="predicted"
                            stroke={isDark ? "#ffffff" : "#000000"}
                            strokeWidth={3}
                            dot={{ fill: isDark ? "#ffffff" : "#000000", r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="actual"
                            stroke={isDark ? "#10b981" : "#059669"}
                            strokeWidth={2}
                            dot={{ fill: isDark ? "#10b981" : "#059669", r: 5 }}
                            strokeDasharray="5 5"
                        />
                    </AreaChart>
                </ResponsiveContainer>
                <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-black dark:bg-white rounded"></div>
                        <span className="text-black dark:text-white">Predicted</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-600 rounded"></div>
                        <span className="text-black dark:text-white">Actual</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                        <span className="text-black dark:text-white">Confidence Interval</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
