import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// GET /api/actions - Fetch action items
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const hospitalId = searchParams.get('hospitalId');
        const status = searchParams.get('status');

        let q = query(
            collection(db, 'actions'),
            orderBy('createdAt', 'desc')
        );

        if (hospitalId && status) {
            q = query(
                collection(db, 'actions'),
                where('hospitalId', '==', hospitalId),
                where('status', '==', status),
                orderBy('createdAt', 'desc')
            );
        } else if (hospitalId) {
            q = query(
                collection(db, 'actions'),
                where('hospitalId', '==', hospitalId),
                orderBy('createdAt', 'desc')
            );
        } else if (status) {
            q = query(
                collection(db, 'actions'),
                where('status', '==', status),
                orderBy('createdAt', 'desc')
            );
        }

        const snapshot = await getDocs(q);
        const actions = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Convert Firestore Timestamps
                createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
                updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
                dueDate: data.dueDate instanceof Timestamp ? data.dueDate.toDate().toISOString() : data.dueDate,
            };
        });

        return NextResponse.json({
            success: true,
            data: actions,
            count: actions.length,
        });
    } catch (error) {
        console.error('Error fetching actions:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch actions' },
            { status: 500 }
        );
    }
}
