'use client';

import { StatsCard } from '@/components/dashboard/stats-card';
import { PredictionChart } from '@/components/dashboard/prediction-chart';
import { AQIWidget } from '@/components/dashboard/aqi-widget';
import { FestivalCalendar } from '@/components/dashboard/festival-calendar';
import { RecommendationsPanel } from '@/components/ai/recommendations-panel';
import { ResourceOverview } from '@/components/hospital/resource-overview';
import { Activity, Users, TrendingUp, AlertTriangle } from 'lucide-react';

export default function DashboardPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    AI-powered hospital demand forecasting and operational planning
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Patients"
                    value="1,234"
                    change="+12.5%"
                    trend="up"
                    icon={Activity}
                    iconColor="bg-blue-600"
                    iconClassName="animate-heartbeat"
                />
                <StatsCard
                    title="Bed Occupancy"
                    value="87%"
                    change="+5.2%"
                    trend="up"
                    icon={Users}
                    iconColor="bg-green-600"
                />
                <StatsCard
                    title="Predicted Surge"
                    value="+23%"
                    change="Next 7 days"
                    trend="up"
                    icon={TrendingUp}
                    iconColor="bg-orange-600"
                />
                <StatsCard
                    title="Active Alerts"
                    value="3"
                    change="High Priority"
                    trend="down"
                    icon={AlertTriangle}
                    iconColor="bg-red-600"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column - Charts and Predictions */}
                <div className="lg:col-span-2 space-y-6">
                    <PredictionChart />

                    <div className="grid gap-6 md:grid-cols-2">
                        <AQIWidget />
                        <FestivalCalendar />
                    </div>
                </div>

                {/* Right Column - Recommendations and Resources */}
                <div className="space-y-6">
                    <RecommendationsPanel />
                    <ResourceOverview />
                </div>
            </div>
        </div>
    );
}
