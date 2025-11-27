'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PredictionChart } from '@/components/dashboard/prediction-chart';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function PredictionsPage() {
    const departments = ['Emergency', 'Respiratory', 'OPD', 'ICU'];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Predictions</h1>
                <p className="text-muted-foreground mt-1">
                    Department-wise patient volume forecasts for the next 7-21 days
                </p>
            </div>

            {/* Department Tabs */}
            <Tabs defaultValue="Emergency" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    {departments.map((dept) => (
                        <TabsTrigger key={dept} value={dept}>
                            {dept}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {departments.map((dept) => (
                    <TabsContent key={dept} value={dept} className="space-y-6">
                        {/* Summary Cards */}
                        <div className="grid gap-4 md:grid-cols-3">
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardDescription>Today's Forecast</CardDescription>
                                    <CardTitle className="text-3xl">95 patients</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2 text-sm">
                                        <TrendingUp className="h-4 w-4 text-red-500" />
                                        <span className="text-red-500 font-medium">+40%</span>
                                        <span className="text-muted-foreground">vs. baseline</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-3">
                                    <CardDescription>7-Day Average</CardDescription>
                                    <CardTitle className="text-3xl">88 patients</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Badge variant="outline">87% confidence</Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-3">
                                    <CardDescription>Peak Expected</CardDescription>
                                    <CardTitle className="text-3xl">Nov 2</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm text-muted-foreground">
                                        Day after Diwali
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Prediction Chart */}
                        <PredictionChart department={dept} />

                        {/* Factors Influencing Prediction */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Key Factors</CardTitle>
                                <CardDescription>
                                    Environmental and social factors influencing this forecast
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                        <div>
                                            <div className="font-medium">Air Quality Index</div>
                                            <div className="text-sm text-muted-foreground">Very Poor</div>
                                        </div>
                                        <div className="text-2xl font-bold text-red-500">285</div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                        <div>
                                            <div className="font-medium">Temperature</div>
                                            <div className="text-sm text-muted-foreground">Moderate</div>
                                        </div>
                                        <div className="text-2xl font-bold">18°C</div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                        <div>
                                            <div className="font-medium">Upcoming Festival</div>
                                            <div className="text-sm text-muted-foreground">High Impact</div>
                                        </div>
                                        <Badge variant="destructive">Diwali</Badge>
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                        <div>
                                            <div className="font-medium">Historical Trend</div>
                                            <div className="text-sm text-muted-foreground">Last 30 days</div>
                                        </div>
                                        <div className="flex items-center gap-1 text-red-500">
                                            <TrendingUp className="h-5 w-5" />
                                            <span className="font-medium">Increasing</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
