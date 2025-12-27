'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Activity, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
    {
        label: 'Total Hospitals',
        value: '24',
        change: '+3 this month',
        icon: Building2,
        color: 'from-blue-500 to-cyan-500',
    },
    {
        label: 'Active Predictions',
        value: '156',
        change: '+12% this week',
        icon: TrendingUp,
        color: 'from-green-500 to-emerald-500',
    },
    {
        label: 'Pending Actions',
        value: '8',
        change: '4 high priority',
        icon: AlertCircle,
        color: 'from-orange-500 to-red-500',
    },
    {
        label: 'System Health',
        value: '98%',
        change: 'All systems operational',
        icon: Activity,
        color: 'from-purple-500 to-pink-500',
    },
];

const recentActivity = [
    { action: 'New hospital added', location: 'Mumbai Central', time: '5 min ago', status: 'success' },
    { action: 'High AQI alert', location: 'Delhi NCR', time: '12 min ago', status: 'warning' },
    { action: 'Prediction updated', location: 'Bangalore', time: '1 hour ago', status: 'info' },
    { action: 'Resource allocation', location: 'Chennai', time: '2 hours ago', status: 'success' },
];

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-black dark:text-white">
                    Admin Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Real-time hospital network monitoring and management
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;

                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -4 }}
                        >
                            <Card className="border-2 border-black dark:border-white bg-white dark:bg-black hover:shadow-2xl transition-all duration-300">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {stat.label}
                                    </CardTitle>
                                    <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} shadow-lg`}>
                                        <Icon className="h-4 w-4 text-white" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-black dark:text-white">
                                        {stat.value}
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {stat.change}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <Card className="border-2 border-black dark:border-white bg-white dark:bg-black">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-black dark:text-white">
                        Recent Activity
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-200"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${activity.status === 'success' ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
                                            activity.status === 'warning' ? 'bg-gradient-to-br from-orange-500 to-red-500' :
                                                'bg-gradient-to-br from-blue-500 to-cyan-500'
                                        } shadow-lg`}>
                                        {activity.status === 'success' ? (
                                            <CheckCircle className="h-4 w-4 text-white" />
                                        ) : (
                                            <Activity className="h-4 w-4 text-white" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-black dark:text-white">
                                            {activity.action}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {activity.location}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {activity.time}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
