'use client';

import { useMemo, useState } from 'react';
import { mockAIRecommendations, AIRecommendation } from '../mock-data';
import { useLocationStore } from './useLocation';
import { addDoc, serverTimestamp } from 'firebase/firestore';
import { actionsCollection } from '../firebase/collections';
import { toast } from 'sonner';

export function useAIRecommendations() {
    const { location } = useLocationStore();
    const [recommendations, setRecommendations] = useState<AIRecommendation[]>(mockAIRecommendations);
    const [processing, setProcessing] = useState<string | null>(null);

    // Filter recommendations by selected location
    const filtered = useMemo(() => {
        if (!location?.city) return recommendations;
        return recommendations
            .filter(r => r.city === location.city)
            .sort((a, b) => {
                // Sort by priority: high > medium > low
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
    }, [recommendations, location?.city]);

    // Approve recommendation and store to actions
    const approveRecommendation = async (id: string) => {
        const recommendation = recommendations.find(r => r.id === id);
        if (!recommendation) return;

        setProcessing(id);
        try {
            // Store to Firebase actions
            await addDoc(actionsCollection, {
                hospitalId: 'ai-generated',
                predictionId: id,
                priority: recommendation.priority,
                category: recommendation.type,
                title: recommendation.title,
                description: recommendation.description,
                rationale: recommendation.rationale,
                status: 'approved',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            // Remove from recommendations list
            setRecommendations(prev => prev.filter(r => r.id !== id));

            toast.success('Recommendation Approved', {
                description: `${recommendation.title} has been added to action items`,
            });
        } catch (error) {
            toast.error('Failed to approve', {
                description: (error as Error).message,
            });
        } finally {
            setProcessing(null);
        }
    };

    // Reject recommendation
    const rejectRecommendation = async (id: string) => {
        const recommendation = recommendations.find(r => r.id === id);
        if (!recommendation) return;

        setProcessing(id);
        try {
            // Store rejection to Firebase for learning
            await addDoc(actionsCollection, {
                hospitalId: 'ai-generated',
                predictionId: id,
                priority: recommendation.priority,
                category: recommendation.type,
                title: recommendation.title,
                description: recommendation.description,
                rationale: recommendation.rationale,
                status: 'rejected',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            // Remove from recommendations list
            setRecommendations(prev => prev.filter(r => r.id !== id));

            toast.info('Recommendation Rejected', {
                description: 'Your feedback helps improve future suggestions',
            });
        } catch (error) {
            toast.error('Failed to reject', {
                description: (error as Error).message,
            });
        } finally {
            setProcessing(null);
        }
    };

    return {
        recommendations: filtered,
        approveRecommendation,
        rejectRecommendation,
        processing,
    };
}
