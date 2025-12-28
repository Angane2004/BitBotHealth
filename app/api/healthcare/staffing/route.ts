import { NextRequest, NextResponse } from 'next/server';
import { HealthcareAnalyticsService } from '@/lib/services/healthcare-analytics';

export async function POST(request: NextRequest) {
    try {
        const { predictedLoad, currentStaff } = await request.json();

        if (typeof predictedLoad !== 'number' || typeof currentStaff !== 'number') {
            return NextResponse.json(
                { success: false, error: 'Invalid input parameters' },
                { status: 400 }
            );
        }

        const recommendation = await HealthcareAnalyticsService.getStaffingRecommendations(
            predictedLoad,
            currentStaff
        );

        return NextResponse.json({
            success: true,
            recommendation,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Staffing recommendation error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to generate staffing recommendations'
            },
            { status: 500 }
        );
    }
}
