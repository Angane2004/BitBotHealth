import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, addDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// GET /api/hospitals - Fetch all hospitals
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const city = searchParams.get('city');

        let q = collection(db, 'hospitals');

        if (city) {
            q = query(collection(db, 'hospitals'), where('location.city', '==', city)) as any;
        }

        const snapshot = await getDocs(q);
        const hospitals = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return NextResponse.json({
            success: true,
            data: hospitals,
            count: hospitals.length,
        });
    } catch (error) {
        console.error('Error fetching hospitals:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch hospitals' },
            { status: 500 }
        );
    }
}

// POST /api/hospitals - Add new hospital (admin only)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, city, totalBeds, departments } = body;

        // Validation
        if (!name || !city || !totalBeds) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const hospitalData = {
            name,
            location: {
                city,
                lat: 0,
                lng: 0,
                address: city,
            },
            capacity: {
                totalBeds: Number(totalBeds),
                icuBeds: 0,
                emergencyBeds: 0,
            },
            currentOccupancy: {
                total: 0,
                icu: 0,
                emergency: 0,
            },
            staff: {
                doctors: 0,
                nurses: 0,
                technicians: 0,
            },
            departments: departments || [],
            inventory: {
                oxygenCylinders: 0,
                ppeMasks: 0,
                asthmaKits: 0,
            },
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, 'hospitals'), hospitalData);

        return NextResponse.json({
            success: true,
            data: { id: docRef.id, ...hospitalData },
            message: 'Hospital added successfully',
        });
    } catch (error) {
        console.error('Error adding hospital:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to add hospital' },
            { status: 500 }
        );
    }
}
