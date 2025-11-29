'use client';

import { useMemo, useState } from 'react';
import { mockAIRecommendations, AIRecommendation } from '../mock-data';
import { useLocationStore } from './useLocation';
import { addDoc, serverTimestamp } from 'firebase/firestore';
import { actionsCollection, ActionItem } from '../firebase/collections';
import { toast } from 'sonner';

// Map recommendation types to ActionItem categories
const mapTypeToCategory = (type: string): ActionItem['category'] => {
    switch (type) {
        case 'resources':
        case 'supplies':
            return 'supplies';
        case 'alert':
        case 'advisory':
            return 'advisory';
        case 'preparation':
        case 'infrastructure':
            return 'infrastructure';
        case 'staffing':
        default:
            return 'staffing';
    }
};

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
            const newAction: Omit<import('../firebase/collections').ActionItem, 'id'> = {
                hospitalId: 'ai-generated',
                predictionId: id,
                priority: recommendation.priority,
                category: mapTypeToCategory(recommendation.type),
                title: recommendation.title,
                description: recommendation.description,
                rationale: recommendation.rationale,
                status: 'approved',
                dueDate: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            await addDoc(actionsCollection, newAction as any);

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
            const newAction: Omit<import('../firebase/collections').ActionItem, 'id'> = {
                hospitalId: 'ai-generated',
                predictionId: id,
                priority: recommendation.priority,
                category: mapTypeToCategory(recommendation.type),
                title: recommendation.title,
                description: recommendation.description,
                rationale: recommendation.rationale,
                status: 'rejected',
                dueDate: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            await addDoc(actionsCollection, newAction as any);

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
