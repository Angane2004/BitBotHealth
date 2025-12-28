import { NextRequest, NextResponse } from 'next/server';
import { HealthcareAnalyticsService } from '@/lib/services/healthcare-analytics';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { hospitalData, aqiData, predictionData, timeframe } = body;

        // Generate comprehensive healthcare insights
        const insights = await HealthcareAnalyticsService.generateInsights({
            hospitalData,
            aqiData,
            predictionData,
            timeframe
        });

        return NextResponse.json({
            success: true,
            insights,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Healthcare insights error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to generate healthcare insights',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        service: 'Healthcare Analytics API',
        version: '1.0.0',
        status: 'operational',
        endpoints: {
            insights: 'POST /api/healthcare/insights',
            staffing: 'POST /api/healthcare/staffing',
            supplies: 'POST /api/healthcare/supplies'
        }
    });
}
