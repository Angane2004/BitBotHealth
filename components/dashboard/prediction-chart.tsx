'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format, addDays } from 'date-fns';

interface PredictionChartProps {
    hospitalId?: string;
    department?: string;
}

export function PredictionChart({ hospitalId, department = 'Emergency' }: PredictionChartProps) {
    // Generate mock prediction data for next 7 days
    const data = Array.from({ length: 7 }, (_, i) => {
        const date = addDays(new Date(), i);
        const baseValue = 80 + Math.random() * 40;
        return {
            date: format(date, 'MMM dd'),
            predicted: Math.round(baseValue),
            lower: Math.round(baseValue - 10 - Math.random() * 5),
            upper: Math.round(baseValue + 10 + Math.random() * 5),
            actual: i === 0 ? Math.round(baseValue + (Math.random() - 0.5) * 10) : null,
        };
    });

    return (
        <Card className="col-span-full hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle>7-Day Patient Volume Forecast</CardTitle>
                <CardDescription>
                    {department} Department • Predicted admissions with confidence intervals
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                            dataKey="date"
                            className="text-xs"
                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <YAxis
                            className="text-xs"
                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            label={{ value: 'Patients', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                            }}
                        />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="upper"
                            stroke="none"
                            fill="#e0e7ff"
                            fillOpacity={0.3}
                        />
                        <Area
                            type="monotone"
                            dataKey="lower"
                            stroke="none"
                            fill="#ffffff"
                            fillOpacity={1}
                        />
                        <Line
                            type="monotone"
                            dataKey="predicted"
                            stroke="#8b5cf6"
                            strokeWidth={3}
                            dot={{ fill: '#8b5cf6', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="actual"
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={{ fill: '#10b981', r: 5 }}
                            strokeDasharray="5 5"
                        />
                    </AreaChart>
                </ResponsiveContainer>
                <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-purple-500 rounded"></div>
                        <span>Predicted</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span>Actual</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-indigo-100 rounded"></div>
                        <span>Confidence Interval</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
