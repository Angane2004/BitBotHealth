'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area } from 'recharts';
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
            const lower = Math.round(baseValue - 8 - seededRandom(baseSeed + i * 2) * 5);
            const upper = Math.round(baseValue + 8 + seededRandom(baseSeed + i * 3) * 5);

            return {
                date: format(date, 'MMM dd'),
                predicted: Math.round(baseValue),
                range: [lower, upper],
                actual: i === 0 ? Math.round(baseValue + (seededRandom(baseSeed + i * 4) - 0.5) * 10) : null,
            };
        });
    }, [department]);

    return (
        <Card className="col-span-full hover:shadow-lg transition-shadow border-2 bg-white dark:bg-black border-black dark:border-white">
            <CardHeader>
                <CardTitle className="text-black dark:text-white">7-Day Patient Volume Forecast</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                    {department} Department • AI-Predicted admissions
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={data}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke={isDark ? "#333" : "#eee"}
                                vertical={false}
                            />
                            <XAxis
                                dataKey="date"
                                className="text-xs"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: isDark ? '#fff' : '#000' }}
                            />
                            <YAxis
                                className="text-xs"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: isDark ? '#fff' : '#000' }}
                                label={{
                                    value: 'Patients',
                                    angle: -90,
                                    position: 'insideLeft',
                                    fill: isDark ? '#fff' : '#000'
                                }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: isDark ? '#000' : '#fff',
                                    border: `2px solid ${isDark ? '#fff' : '#000'}`,
                                    borderRadius: '0px',
                                    color: isDark ? '#fff' : '#000',
                                    boxShadow: 'none'
                                }}
                            />
                            <Legend
                                verticalAlign="top"
                                height={36}
                                wrapperStyle={{
                                    color: isDark ? '#fff' : '#000'
                                }}
                            />

                            {/* Confidence Interval Band - Gray */}
                            <Area
                                name="Confidence"
                                dataKey="range"
                                stroke="none"
                                fill={isDark ? "#333" : "#eee"}
                                fillOpacity={0.5}
                            />

                            {/* Main Prediction Line - Black/White */}
                            <Line
                                name="Predicted"
                                type="monotone"
                                dataKey="predicted"
                                stroke={isDark ? "#ffffff" : "#000000"}
                                strokeWidth={3}
                                dot={{ fill: isDark ? "#fff" : "#000", r: 4, strokeWidth: 0 }}
                                activeDot={{ r: 6, fill: isDark ? "#fff" : "#000" }}
                            />

                            {/* Actual Data Line - Dashed Gray */}
                            <Line
                                name="Actual"
                                type="monotone"
                                dataKey="actual"
                                stroke={isDark ? "#666" : "#999"}
                                strokeWidth={2}
                                dot={{ fill: isDark ? "#666" : "#999", r: 4 }}
                                strokeDasharray="5 5"
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
