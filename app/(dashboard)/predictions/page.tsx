'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PredictionChart } from '@/components/dashboard/prediction-chart';
import { TrendingUp, Activity, Wind, Thermometer, Calendar, Sparkles, CheckCircle2, XCircle, Stethoscope, HeartPulse } from 'lucide-react';
import { useMemo, useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePredictions } from '@/lib/firebase/hooks';
import { useLiveWeather } from '@/lib/hooks/weather';
import { useUpcomingFestival } from '@/lib/hooks/useUpcomingFestival';
import { useLocationStore } from '@/lib/hooks/useLocation';
import { addDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { actionsCollection, predictionsCollection } from '@/lib/firebase/collections';
import { toast } from 'sonner';

const departments = [
    { id: 'emergency', name: 'Emergency', icon: Activity, iconClass: 'text-black dark:text-white animate-heartbeat', accent: 'from-rose-500 via-red-500 to-amber-400' },
    { id: 'respiratory', name: 'Respiratory', icon: Wind, iconClass: 'text-sky-500 animate-airflow', accent: 'from-cyan-500 via-sky-500 to-indigo-500' },
    { id: 'opd', name: 'OPD', icon: Stethoscope, iconClass: 'text-emerald-600', accent: 'from-emerald-500 via-lime-400 to-amber-300' },
    { id: 'icu', name: 'ICU', icon: HeartPulse, iconClass: 'text-red-500 animate-heartbeat', accent: 'from-fuchsia-500 via-purple-500 to-blue-500' },
];

const fallbackPredictions = {
    emergency: { current: 85, predicted: 95, change: 11.8, trend: 'up', hospitalId: 'demo-hospital', id: undefined as string | undefined },
    respiratory: { current: 120, predicted: 145, change: 20.8, trend: 'up', hospitalId: 'demo-hospital', id: undefined as string | undefined },
    opd: { current: 200, predicted: 210, change: 5.0, trend: 'up', hospitalId: 'demo-hospital', id: undefined as string | undefined },
    icu: { current: 65, predicted: 68, change: 4.6, trend: 'up', hospitalId: 'demo-hospital', id: undefined as string | undefined },
};

const staticFactors = [
    { label: 'Air Quality Index', accessor: 'aqi', status: 'critical', icon: Wind, color: 'text-red-600' },
    { label: 'Temperature', accessor: 'temperature', status: 'normal', icon: Thermometer, color: 'text-black dark:text-white' },
    { label: 'Upcoming Festival', accessor: 'festival', status: 'high-impact', icon: Calendar, color: 'text-orange-600' },
    { label: 'Historical Trend', accessor: 'trend', status: 'warning', icon: TrendingUp, color: 'text-yellow-600' },
];

export default function PredictionsPage() {
    const [activeTab, setActiveTab] = useState('emergency');
    const [pending, startTransition] = useTransition();
    const { predictions, loading: predictionsLoading } = usePredictions(undefined, 7);
    const { location } = useLocationStore();
    const { snapshot: weather } = useLiveWeather({ city: location?.city || 'Delhi' });
    const upcomingFestival = useUpcomingFestival();

    const grouped = useMemo(() => {
        if (!predictions.length) return fallbackPredictions;
        const latestMap: Record<string, typeof fallbackPredictions.emergency> = { ...fallbackPredictions };
        predictions.forEach((pred) => {
            const deptKey = pred.department.toLowerCase();
            latestMap[deptKey] = {
                current: pred.predictedPatients,
                predicted: Math.round(pred.predictedPatients * 1.08),
                change: 8.5,
                trend: 'up',
                hospitalId: pred.hospitalId,
                id: pred.id,
            };
        });
        return latestMap;
    }, [predictions]);

    const activePrediction = grouped[activeTab as keyof typeof grouped];

    const handleDecision = (decision: 'approved' | 'rejected') => {
        if (!activePrediction) return;
        startTransition(async () => {
            try {
                const newAction: Omit<import('@/lib/firebase/collections').ActionItem, 'id'> = {
                    hospitalId: activePrediction.hospitalId,
                    predictionId: activePrediction.id ?? `${activeTab}-demo`,
                    priority: decision === 'approved' ? 'high' : 'medium',
                    category: 'staffing',
                    title: `${activeTab.toUpperCase()} surge ${decision}`,
                    description: `The ${activeTab} load of ${activePrediction.predicted} patients was ${decision}.`,
                    rationale: decision === 'approved'
                        ? 'Conditions meet the threshold and weather indicators trending up.'
                        : 'Triaged due to manageable load and stable resources.',
                    status: decision === 'approved' ? 'approved' : 'rejected',
                    dueDate: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                await addDoc(actionsCollection, newAction as any);

                if (activePrediction.id) {
                    await updateDoc(doc(predictionsCollection, activePrediction.id), {
                        decision,
                        decidedAt: serverTimestamp(),
                    });
                }

                toast.success(`Prediction ${decision}`, { description: `Logged in actions for ${activeTab}.` });
            } catch (error) {
                toast.error('Unable to record decision', { description: (error as Error).message });
            }
        });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="relative overflow-hidden rounded-3xl border border-black/5 dark:border-white/5 bg-white/70 dark:bg-white/5 p-8">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('/topographic-bg.png')] opacity-30 dark:opacity-40 mix-blend-soft-light" />
                    <motion.div
                        className="absolute -top-10 right-10 h-48 w-48 rounded-full bg-black/10 dark:bg-white/10 blur-[120px]"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
                    />
                </div>
                <div className="relative flex flex-wrap items-center gap-6">
                    <div className="space-y-2">
                        <p className="text-sm uppercase tracking-[0.6em] text-gray-500 flex items-center gap-2">
                            <Sparkles className="h-4 w-4" /> predictions
                        </p>
                        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">Live surge intelligence</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            AI-powered patient volume forecasts for the next 7-21 days using real time weather + AQI feeds.
                        </p>
                    </div>
                    {weather && (
                        <div className="ml-auto rounded-2xl border border-black/5 dark:border-white/10 px-6 py-4 bg-white/70 dark:bg-white/10 shadow-lg text-sm">
                            <p className="text-xs uppercase tracking-[0.4em] text-gray-500">Live AQI</p>
                            <p className="text-2xl font-semibold text-black dark:text-white">{weather.aqi ?? '—'}</p>
                            <p className="text-gray-500">{weather.alertMessage}</p>
                        </div>
                    )}
                </div>
            </div>

            {predictionsLoading && !predictions.length && (
                <Card className="border-0 glass-panel">
                    <CardContent className="p-6 text-gray-600 dark:text-gray-300">Syncing live predictions…</CardContent>
                </Card>
            )}

            <div className="space-y-6">
                <div className="relative rounded-3xl bg-gradient-to-r from-white/90 to-white/50 dark:from-white/5 dark:to-white/0 border border-black/5 dark:border-white/10 p-1">
                    <div className="absolute inset-0 bg-[url('/bg.png')] opacity-50 rounded-3xl mix-blend-soft-light" />
                    <div className="relative flex gap-2 rounded-2xl bg-black/5 dark:bg-white/5 p-2">
                        <motion.div
                            className="absolute top-2 bottom-2 rounded-2xl bg-white dark:bg-black shadow-lg"
                            layout
                            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                            style={{
                                width: `calc(${100 / departments.length}% - 8px)`,
                                left: `calc(${departments.findIndex(d => d.id === activeTab) * (100 / departments.length)}% + 4px)`,
                            }}
                        />
                        {departments.map((dept) => (
                            <button
                                key={dept.id}
                                onClick={() => setActiveTab(dept.id)}
                                className={`flex-1 relative z-10 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-colors duration-200 ${activeTab === dept.id ? 'text-black dark:text-white' : 'text-gray-500 hover:text-black dark:hover:text-white'
                                    }`}
                            >
                                <dept.icon className={`h-4 w-4 ${dept.iconClass ?? ''}`} />
                                <span className="hidden sm:inline font-medium">{dept.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="space-y-6"
                    >
                        <div className="grid gap-4 md:grid-cols-3">
                            <Card className="border-0 glass-panel">
                                <CardHeader className="pb-3">
                                    <CardDescription>Current Patients</CardDescription>
                                    <CardTitle className="text-3xl">{activePrediction?.current ?? '—'}</CardTitle>
                                </CardHeader>
                            </Card>
                            <Card className="border-0 glass-panel">
                                <CardHeader className="pb-3">
                                    <CardDescription>Predicted (Tomorrow)</CardDescription>
                                    <CardTitle className="text-3xl">{activePrediction?.predicted ?? '—'}</CardTitle>
                                </CardHeader>
                            </Card>
                            <Card className="border-0 glass-panel">
                                <CardHeader className="pb-3">
                                    <CardDescription>Expected Change</CardDescription>
                                    <CardTitle className="text-3xl flex items-center gap-2 text-amber-500">
                                        <TrendingUp className="h-6 w-6" />
                                        +{activePrediction?.change ?? '0'}%
                                    </CardTitle>
                                </CardHeader>
                            </Card>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={() => handleDecision('approved')}
                                disabled={pending}
                                className="rounded-full bg-black text-white dark:bg-white dark:text-black px-6 py-3 flex items-center gap-2 shadow-lg transition hover:scale-[1.01]"
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                Approve plan
                            </button>
                            <button
                                onClick={() => handleDecision('rejected')}
                                disabled={pending}
                                className="rounded-full border border-black/20 dark:border-white/20 px-6 py-3 flex items-center gap-2 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition"
                            >
                                <XCircle className="h-4 w-4" />
                                Reject plan
                            </button>
                            {pending && <span className="text-xs uppercase tracking-[0.3em] text-gray-500">saving…</span>}
                        </div>

                        <PredictionChart department={activeTab} />

                        <Card className="border-0 glass-panel">
                            <CardHeader>
                                <CardTitle>Key Drivers</CardTitle>
                                <CardDescription>Environmental and historical data affecting the forecast</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    {staticFactors.map((factor) => (
                                        <div key={factor.label} className="flex items-start gap-3 p-4 rounded-2xl bg-white/80 dark:bg-white/10 border border-black/5 dark:border-white/10">
                                            <div className="p-2 rounded-xl bg-gradient-to-br from-black/80 to-black/60 dark:from-white dark:to-gray-200 text-white dark:text-black">
                                                <factor.icon className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate text-black dark:text-white">{factor.label}</p>
                                                <p className={`text-lg font-bold ${factor.color}`}>
                                                    {factor.accessor === 'aqi' && (weather?.aqi ?? '—')}
                                                    {factor.accessor === 'temperature' && `${weather?.temperature ?? '—'}°C`}
                                                    {factor.accessor === 'festival' && upcomingFestival && (
                                                        <span className="text-orange-600 dark:text-orange-500">
                                                            {upcomingFestival.name} ({upcomingFestival.countdownText})
                                                        </span>
                                                    )}
                                                    {factor.accessor === 'festival' && !upcomingFestival && '—'}
                                                    {factor.accessor === 'trend' && 'Increasing'}
                                                </p>
                                                <Badge variant="outline" className="mt-1 text-xs border-black/30 dark:border-white/30">
                                                    {factor.accessor === 'festival' && upcomingFestival
                                                        ? `${upcomingFestival.impact}-impact`
                                                        : factor.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
