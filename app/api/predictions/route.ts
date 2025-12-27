import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// GET /api/predictions - Fetch predictions with filters
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const hospitalId = searchParams.get('hospitalId');
        const department = searchParams.get('department');
        const days = parseInt(searchParams.get('days') || '7');

        let q = query(
            collection(db, 'predictions'),
            orderBy('date', 'desc'),
            limit(days * 4) // 4 departments
        );

        if (hospitalId) {
            q = query(
                collection(db, 'predictions'),
                where('hospitalId', '==', hospitalId),
                orderBy('date', 'desc'),
                limit(days * 4)
            );
        }

        if (department) {
            q = query(
                collection(db, 'predictions'),
                where('department', '==', department),
                orderBy('date', 'desc'),
                limit(days * 4)
            );
        }

        const snapshot = await getDocs(q);
        const predictions = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Convert Firestore Timestamp to ISO string
                date: data.date instanceof Timestamp ? data.date.toDate().toISOString() : data.date,
                createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
            };
        });

        return NextResponse.json({
            success: true,
            data: predictions,
            count: predictions.length,
        });
    } catch (error) {
        console.error('Error fetching predictions:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch predictions' },
            { status: 500 }
        );
    }
}
