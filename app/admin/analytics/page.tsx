'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, TrendingDown, Activity, Users, Building2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
    // Mock data - replace with real data from your backend
    const stats = {
        totalHospitals: 12,
        totalPredictions: 248,
        activePredictions: 89,
        completedActions: 156,
        pendingActions: 23,
        avgAQI: 145,
        systemUptime: 99.8,
        activeUsers: 47,
    };

    const hospitalStats = [
        { city: 'Delhi', count: 4, occupancy: 78 },
        { city: 'Mumbai', count: 3, occupancy: 82 },
        { city: 'Bangalore', count: 2, occupancy: 65 },
        { city: 'Chennai', count: 2, occupancy: 71 },
        { city: 'Kolkata', count: 1, occupancy: 88 },
    ];

    const weeklyTrends = [
        { day: 'Mon', predictions: 32, actions: 28 },
        { day: 'Tue', predictions: 45, actions: 35 },
        { day: 'Wed', predictions: 38, actions: 32 },
        { day: 'Thu', predictions: 52, actions: 41 },
        { day: 'Fri', predictions: 41, actions: 38 },
        { day: 'Sat', predictions: 28, actions: 22 },
        { day: 'Sun', predictions: 22, actions: 18 },
  };

const aqiTrends = [
    { city: 'Delhi', aqi: 178, change: '+12%', status: 'Poor' },
    { city: 'Mumbai', aqi: 132, change: '-8%', status: 'Moderate' },
    { city: 'Bangalore', aqi: 98, change: '-15%', status: 'Satisfactory' },
    { city: 'Chennai', aqi: 115, change: '+5%', status: 'Moderate' },
];

return (
    <div className="space-y-8">
        <div>
            <h1 className="text-4xl font-bold text-black dark:text-white">Analytics Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
                Real-time insights and system performance metrics
            </p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
                <Card className="border-2 border-black dark:border-white bg-white dark:bg-black hover:scale-105 transition-transform">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Hospitals</CardTitle>
                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                            <Building2 className="h-4 w-4 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-black dark:text-white">{stats.totalHospitals}</div>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            +2 this month
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="border-2 border-black dark:border-white bg-white dark:bg-black hover:scale-105 transition-transform">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Predictions</CardTitle>
                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                            <TrendingUp className="h-4 w-4 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-black dark:text-white">{stats.totalPredictions}</div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{stats.activePredictions} active</p>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="border-2 border-black dark:border-white bg-white dark:bg-black hover:scale-105 transition-transform">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</CardTitle>
                        <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                            <Users className="h-4 w-4 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-black dark:text-white">{stats.activeUsers}</div>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            +8% this week
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="border-2 border-black dark:border-white bg-white dark:bg-black hover:scale-105 transition-transform">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">System Uptime</CardTitle>
                        <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                            <Activity className="h-4 w-4 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-black dark:text-white">{stats.systemUptime}%</div>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">All systems operational</p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>

        {/* Hospital Distribution */}
        <Card className="border-2 border-black dark:border-white bg-white dark:bg-black">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                        <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <span>Hospital Distribution by City</span>
                </CardTitle>
                <CardDescription>Geographic distribution and occupancy rates</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {hospitalStats.map((hospital, index) => (
                        <div key={hospital.city} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="font-medium text-black dark:text-white w-24">{hospital.city}</span>
                                    <Badge variant="outline" className="border-black dark:border-white">
                                        {hospital.count} {hospital.count === 1 ? 'hospital' : 'hospitals'}
                                    </Badge>
                                </div>
                                <span className="text-sm font-semibold text-black dark:text-white">{hospital.occupancy}%</span>
                            </div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    className={`h-full ${hospital.occupancy > 80 ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-black dark:bg-white'
                                        }`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${hospital.occupancy}%` }}
                                    transition={{ delay: index * 0.1, duration: 0.8 }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
            {/* Weekly Trends */}
            <Card className="border-2 border-black dark:border-white bg-white dark:bg-black">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                            <BarChart3 className="h-5 w-5 text-white" />
                        </div>
                        <span>Weekly Activity</span>
                    </CardTitle>
                    <CardDescription>Predictions and actions over the past week</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {weeklyTrends.map((day, index) => (
                            <div key={day.day} className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12">{day.day}</span>
                                <div className="flex-1 flex gap-2">
                                    <div className="flex-1">
                                        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(day.predictions / 60) * 100}%` }}
                                                transition={{ delay: index * 0.05, duration: 0.5 }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{day.predictions} predictions</p>
                                    </div>
                                    <div className="flex-1">
                                        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded overflow-hidden">
                                            <motion.div
                                                className="h-full bg-black dark:bg-white"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(day.actions / 60) * 100}%` }}
                                                transition={{ delay: index * 0.05, duration: 0.5 }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{day.actions} actions</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* AQI Trends */}
            <Card className="border-2 border-black dark:border-white bg-white dark:bg-black">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                            <Activity className="h-5 w-5 text-white" />
                        </div>
                        <span>AQI Trends</span>
                    </CardTitle>
                    <CardDescription>Air quality index by major cities</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {aqiTrends.map((city) => (
                            <div key={city.city} className="p-4 border-2 border-black dark:border-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-black dark:text-white">{city.city}</span>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            className={`${city.aqi > 150
                                                    ? 'bg-red-500 text-white'
                                                    : city.aqi > 100
                                                        ? 'bg-orange-500 text-white'
                                                        : 'bg-green-500 text-white'
                                                }`}
                                        >
                                            {city.status}
                                        </Badge>
                                        {city.change.startsWith('+') ? (
                                            <TrendingUp className="h-4 w-4 text-red-500" />
                                        ) : (
                                            <TrendingDown className="h-4 w-4 text-green-500" />
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-black dark:text-white">{city.aqi}</span>
                                    <span className={`text-sm font-medium ${city.change.startsWith('+') ? 'text-red-500' : 'text-green-500'}`}>
                                        {city.change}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Action Items Summary */}
        <Card className="border-2 border-black dark:border-white bg-white dark:bg-black">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500">
                        <AlertTriangle className="h-5 w-5 text-white" />
                    </div>
                    <span>Action Items Summary</span>
                </CardTitle>
                <CardDescription>Overview of completed and pending actions</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-full bg-green-100 dark:bg-green-900">
                            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-black dark:text-white">{stats.completedActions}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Completed Actions</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-full bg-orange-100 dark:bg-orange-900">
                            <AlertTriangle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-black dark:text-white">{stats.pendingActions}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Pending Actions</p>
                        </div>
                    </div>
                </div>
                <div className="mt-6 h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(stats.completedActions / (stats.completedActions + stats.pendingActions)) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                    />
                </div>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {Math.round((stats.completedActions / (stats.completedActions + stats.pendingActions)) * 100)}% completion rate
                </p>
            </CardContent>
        </Card>
    </div>
);
}
