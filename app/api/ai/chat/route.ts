import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
    try {
        const { message, context } = await request.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { success: false, error: 'Gemini API key not configured' },
                { status: 500 }
            );
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Create context-aware prompt
        const systemPrompt = `You are SwasthyaSense AI, an intelligent healthcare assistant for hospital resource management and prediction. 

Your role:
- Analyze hospital data, bed occupancy, and patient trends
- Explain AQI (Air Quality Index) impacts on respiratory health
- Provide insights on prediction models
- Suggest resource allocation strategies
- Answer questions about hospital operations

Context: ${context || 'General healthcare assistance'}

Keep responses concise, actionable, and professional. Focus on data-driven insights.

User question: ${message}`;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({
            success: true,
            message: text,
        });
    } catch (error) {
        console.error('Gemini API error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to generate AI response',
                message: 'I apologize, but I encountered an error. Please try again.'
            },
            { status: 500 }
        );
    }
}
