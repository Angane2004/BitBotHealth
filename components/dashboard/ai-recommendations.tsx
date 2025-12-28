'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAIRecommendations } from '@/lib/hooks/useAIRecommendations';
import { useLocationStore } from '@/lib/hooks/useLocation';
import { Brain, CheckCircle2, XCircle, AlertTriangle, Info, Sparkles, Users, Package, Bell, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export function AIRecommendations() {
    const { location } = useLocationStore();
    const { recommendations, approveRecommendation, rejectRecommendation, processing } = useAIRecommendations();

    const getPriorityIcon = (priority: 'high' | 'medium' | 'low') => {
        switch (priority) {
            case 'high':
                return <AlertTriangle className="h-4 w-4" />;
            case 'medium':
                return <Info className="h-4 w-4" />;
            case 'low':
                return <Sparkles className="h-4 w-4" />;
        }
    };

    const getTypeIcon = (type: 'staffing' | 'resources' | 'alert' | 'preparation') => {
        switch (type) {
            case 'staffing':
                return <Users className="h-4 w-4 text-gray-700 dark:text-gray-300" />;
            case 'resources':
                return <Package className="h-4 w-4 text-gray-700 dark:text-gray-300" />;
            case 'alert':
                return <Bell className="h-4 w-4 text-gray-700 dark:text-gray-300" />;
            case 'preparation':
                return <Calendar className="h-4 w-4 text-gray-700 dark:text-gray-300" />;
        }
    };

    if (recommendations.length === 0) {
        return (
            <Card className="border-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 h-full flex flex-col">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-black dark:text-white" />
                        <CardTitle className="text-black dark:text-white">AI Recommendations</CardTitle>
                    </div>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                        {location?.city ? `No recommendations for ${location.city}` : 'Select a location to see AI-powered insights'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center">
                    <div className="text-center py-8">
                        <Sparkles className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            All clear! No urgent recommendations at this time.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-2 bg-white dark:bg-gray-900 border-black dark:border-gray-800 h-full flex flex-col">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-black dark:text-white" />
                        <CardTitle className="text-black dark:text-white">
                            AI Recommendations {location?.city && `(${location.city})`}
                        </CardTitle>
                    </div>
                    <Badge variant="outline" className="border-gray-200 dark:border-gray-700 text-black dark:text-white">
                        {recommendations.length} insights
                    </Badge>
                </div>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                    Smart insights from real-time analytics
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 overflow-y-auto max-h-[500px] scrollbar-hide">
                <AnimatePresence mode="popLayout">
                    {recommendations.map((rec) => (
                        <motion.div
                            key={rec.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.3 }}
                            className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between gap-3 mb-4">
                                <div className="flex items-start gap-3 flex-1">
                                    <div className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                                        {getTypeIcon(rec.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge
                                                variant="outline"
                                                className={`text-xs uppercase font-semibold ${rec.priority === 'high'
                                                    ? 'border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                                                    : rec.priority === 'medium'
                                                        ? 'border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20'
                                                        : 'border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                                    }`}
                                            >
                                                {getPriorityIcon(rec.priority)}
                                                <span className="ml-1">{rec.priority} priority</span>
                                            </Badge>
                                            <Badge variant="secondary" className="text-xs capitalize bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                                {rec.type}
                                            </Badge>
                                        </div>
                                        <h4 className="font-bold text-black dark:text-white text-lg leading-tight">
                                            {rec.title}
                                        </h4>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                                {rec.description}
                            </p>

                            {/* Rationale */}
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-600">
                                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                                    Rationale
                                </p>
                                <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                                    {rec.rationale}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                    {formatDistanceToNow(rec.createdAt, { addSuffix: true })}
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => rejectRecommendation(rec.id)}
                                        disabled={processing === rec.id}
                                        className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                    >
                                        <XCircle className="h-4 w-4 mr-1.5" />
                                        Reject
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => approveRecommendation(rec.id)}
                                        disabled={processing === rec.id}
                                        className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black"
                                    >
                                        <CheckCircle2 className="h-4 w-4 mr-1.5" />
                                        {processing === rec.id ? 'Processing...' : 'Approve'}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}
