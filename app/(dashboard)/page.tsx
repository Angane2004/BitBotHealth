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
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                    AI-powered hospital demand forecasting and operational planning
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Patients"
                    value="1,284"
                    description="Across all departments"
                    icon={Users}
                    trend={{ value: 12.5, isPositive: true }}
                />
                <StatsCard
                    title="Predicted Surge"
                    value="+40%"
                    description="Next 7 days (Diwali)"
                    icon={TrendingUp}
                    trend={{ value: 8.2, isPositive: false }}
                    className="border-orange-200 dark:border-orange-900"
                />
                <StatsCard
                    title="Active Alerts"
                    value="3"
                    description="Requiring immediate action"
                    icon={AlertTriangle}
                    className="border-red-200 dark:border-red-900"
                />
                <StatsCard
                    title="Bed Occupancy"
                    value="84%"
                    description="420 of 500 beds"
                    icon={Activity}
                    trend={{ value: 5.1, isPositive: true }}
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
