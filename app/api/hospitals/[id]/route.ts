import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// GET /api/hospitals/[id] - Fetch single hospital
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const docRef = doc(db, 'hospitals', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return NextResponse.json(
                { success: false, error: 'Hospital not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: { id: docSnap.id, ...docSnap.data() },
        });
    } catch (error) {
        console.error('Error fetching hospital:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch hospital' },
            { status: 500 }
        );
    }
}

// PATCH /api/hospitals/[id] - Update hospital
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await request.json();
        const { id } = await params;
        const docRef = doc(db, 'hospitals', id);

        await updateDoc(docRef, {
            ...body,
            updatedAt: serverTimestamp(),
        });

        const updatedDoc = await getDoc(docRef);

        return NextResponse.json({
            success: true,
            data: { id: updatedDoc.id, ...updatedDoc.data() },
            message: 'Hospital updated successfully',
        });
    } catch (error) {
        console.error('Error updating hospital:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update hospital' },
            { status: 500 }
        );
    }
}

// DELETE /api/hospitals/[id] - Delete hospital
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const docRef = doc(db, 'hospitals', id);
        await deleteDoc(docRef);

        return NextResponse.json({
            success: true,
            message: 'Hospital deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting hospital:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete hospital' },
            { status: 500 }
        );
    }
}
