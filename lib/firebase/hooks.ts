'use client';

import { useEffect, useState } from 'react';
import {
    query,
    onSnapshot,
    orderBy,
    limit,
    where,
    QueryConstraint
} from 'firebase/firestore';
import {
    Hospital,
    Prediction,
    ActionItem,
    hospitalsCollection,
    predictionsCollection,
    actionsCollection
} from './collections';

// Hook to fetch hospitals in real-time
export function useHospitals() {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const q = query(hospitalsCollection, orderBy('name'));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Hospital[];
                setHospitals(data);
                setLoading(false);
            },
            (err) => {
                setError(err as Error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { hospitals, loading, error };
}

// Hook to fetch predictions for a specific hospital
export function usePredictions(hospitalId?: string, days: number = 7) {
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const constraints: QueryConstraint[] = [
            orderBy('date', 'desc'),
            limit(days * 4) // 4 departments
        ];

        if (hospitalId) {
            constraints.unshift(where('hospitalId', '==', hospitalId));
        }

        const q = query(predictionsCollection, ...constraints);

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Prediction[];
                setPredictions(data);
                setLoading(false);
            },
            (err) => {
                setError(err as Error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [hospitalId, days]);

    return { predictions, loading, error };
}

// Hook to fetch action items
export function useActions(hospitalId?: string, status?: string) {
    const [actions, setActions] = useState<ActionItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const constraints: QueryConstraint[] = [
            orderBy('createdAt', 'desc')
        ];

        if (hospitalId) {
            constraints.unshift(where('hospitalId', '==', hospitalId));
        }

        if (status) {
            constraints.unshift(where('status', '==', status));
        }

        const q = query(actionsCollection, ...constraints);

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as ActionItem[];
                setActions(data);
                setLoading(false);
            },
            (err) => {
                setError(err as Error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [hospitalId, status]);

    return { actions, loading, error };
}
