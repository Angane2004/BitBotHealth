'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import DashboardContent from '../(dashboard)/page';
import DashboardLayout from '../(dashboard)/layout';

export default function DashboardPage() {
    const router = useRouter();
    const { isLoaded, isSignedIn } = useUser();

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push('/login');
        }
    }, [isLoaded, isSignedIn, router]);

    if (!isLoaded || !isSignedIn) {
        return null;
    }

    return (
        <DashboardLayout>
            <DashboardContent />
        </DashboardLayout>
    );
}
