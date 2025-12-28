/**
 * Healthcare Analytics Service - Powered by Google Gemini AI
 * 
 * This service provides AI-powered healthcare analytics using Google's Gemini AI.
 * Gemini analyzes hospital data, environmental factors, and predictions to generate
 * actionable insights for hospital resource management.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface HealthcareInsight {
    id: string;
    type: 'prediction' | 'recommendation' | 'alert' | 'trend';
    title: string;
    description: string;
    confidence: number;
    priority: 'low' | 'medium' | 'high' | 'critical';
    category: 'capacity' | 'staffing' | 'equipment' | 'environmental' | 'outbreak';
    timestamp: Date;
    data?: any;
}

export interface AnalysisRequest {
    hospitalData?: any;
    aqiData?: any;
    predictionData?: any;
    timeframe?: string;
}

export class HealthcareAnalyticsService {
    /**
     * Generate healthcare insights using Gemini AI
     */
    static async generateInsights(request: AnalysisRequest): Promise<HealthcareInsight[]> {
        try {
            if (!process.env.GEMINI_API_KEY) {
                console.warn('Gemini API key not configured, using fallback logic');
                return this.generateFallbackInsights(request);
            }

            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

            // Create comprehensive prompt for Gemini
            const prompt = this.buildAnalysisPrompt(request);

            // Get AI-powered analysis from Gemini
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const aiAnalysis = response.text();

            // Parse Gemini's response and structure it
            const insights = this.parseGeminiResponse(aiAnalysis, request);

            return insights;
        } catch (error) {
            console.error('Gemini AI analysis error:', error);
            // Fallback to basic analysis if Gemini fails
            return this.generateFallbackInsights(request);
        }
    }

    /**
     * Build comprehensive prompt for Gemini AI analysis
     */
    private static buildAnalysisPrompt(request: AnalysisRequest): string {
        const { hospitalData, aqiData, predictionData, timeframe = '7days' } = request;

        let prompt = `You are a healthcare analytics AI specialist analyzing hospital resource management data. 
Provide actionable insights in a structured JSON format.

ANALYSIS REQUEST:
Timeframe: ${timeframe}

`;

        // Add hospital data context
        if (hospitalData) {
            prompt += `HOSPITAL DATA:
- Total Beds: ${hospitalData.totalBeds || 'N/A'}
- Occupancy Rate: ${hospitalData.occupancyRate || 'N/A'}%
- Occupied Beds: ${hospitalData.occupiedBeds || Math.round((hospitalData.totalBeds || 0) * (hospitalData.occupancyRate || 0) / 100)}
- Trend: ${hospitalData.trend || 'stable'}

`;
        }

        // Add AQI data context
        if (aqiData) {
            prompt += `AIR QUALITY INDEX (AQI) DATA:
- Current AQI: ${aqiData.value || 'N/A'}
- Category: ${this.getAQICategory(aqiData.value)}
- Location: ${aqiData.location || 'N/A'}

`;
        }

        // Add prediction data context
        if (predictionData?.predictions) {
            const predictions = predictionData.predictions.slice(0, 7); // Last 7 predictions
            prompt += `PREDICTION DATA (Last ${predictions.length} entries):
${predictions.map((p: any, i: number) => `- Day ${i + 1}: ${p.predicted || 'N/A'} predicted patients`).join('\n')}

`;
        }

        prompt += `TASK:
Analyze the above data and generate 3-5 healthcare insights. For each insight, provide:

1. Type: prediction, recommendation, alert, or trend
2. Priority: critical, high, medium, or low
3. Category: capacity, staffing, equipment, environmental, or outbreak
4. Title: Brief, actionable title (max 60 chars)
5. Description: Detailed insight with specific numbers and actionable recommendations (2-3 sentences)
6. Confidence: 0.0 to 1.0 (how confident you are in this insight)

IMPORTANT GUIDELINES:
- Focus on ACTIONABLE insights that hospital management can act upon
- Include specific numbers and percentages from the data
- Prioritize patient safety and resource optimization
- For AQI data, relate air quality to respiratory health impacts
- For capacity data, provide alerts when occupancy >75%
- For predictions, identify surge patterns or unusual trends
- Be concise but specific

RESPONSE FORMAT (JSON array):
[
  {
    "type": "alert|recommendation|prediction|trend",
    "priority": "critical|high|medium|low",
    "category": "capacity|staffing|equipment|environmental|outbreak",
    "title": "Brief Title Here",
    "description": "Detailed actionable insight with specific metrics and recommendations.",
    "confidence": 0.85
  }
]

Provide ONLY the JSON array, no additional text.`;

        return prompt;
    }

    /**
     * Parse Gemini's JSON response into structured insights
     */
    private static parseGeminiResponse(aiText: string, request: AnalysisRequest): HealthcareInsight[] {
        try {
            // Extract JSON from response (handle markdown code blocks)
            let jsonText = aiText.trim();

            // Remove markdown code blocks if present
            if (jsonText.startsWith('```')) {
                jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            }

            // Parse JSON
            const rawInsights = JSON.parse(jsonText);

            // Convert to HealthcareInsight format
            const insights: HealthcareInsight[] = rawInsights.map((insight: any, index: number) => ({
                id: `gemini-${Date.now()}-${index}`,
                type: insight.type || 'recommendation',
                title: insight.title || 'Healthcare Insight',
                description: insight.description || '',
                confidence: insight.confidence || 0.75,
                priority: insight.priority || 'medium',
                category: insight.category || 'capacity',
                timestamp: new Date(),
                data: {
                    source: 'gemini-ai',
                    rawData: request
                }
            }));

            // Sort by priority
            return insights.sort((a, b) => {
                const priorityMap = { critical: 4, high: 3, medium: 2, low: 1 };
                return priorityMap[b.priority] - priorityMap[a.priority];
            });
        } catch (error) {
            console.error('Failed to parse Gemini response:', error);
            console.log('Raw Gemini response:', aiText);
            // Return fallback insights if parsing fails
            return this.generateFallbackInsights(request);
        }
    }

    /**
     * Fallback insights when Gemini is unavailable
     */
    private static generateFallbackInsights(request: AnalysisRequest): HealthcareInsight[] {
        const insights: HealthcareInsight[] = [];

        // AQI-based insights
        if (request.aqiData) {
            const aqiInsight = this.analyzeAQIImpact(request.aqiData);
            if (aqiInsight) insights.push(aqiInsight);
        }

        // Capacity insights
        if (request.hospitalData) {
            const capacityInsights = this.analyzeCapacity(request.hospitalData);
            insights.push(...capacityInsights);
        }

        // Prediction insights
        if (request.predictionData) {
            const trendInsight = this.analyzeTrends(request.predictionData);
            if (trendInsight) insights.push(trendInsight);
        }

        // If no insights generated, add a default one
        if (insights.length === 0) {
            insights.push({
                id: `default-${Date.now()}`,
                type: 'recommendation',
                title: 'System Ready',
                description: 'Healthcare analytics system is operational. Add hospital data, AQI information, or predictions to receive AI-powered insights.',
                confidence: 1.0,
                priority: 'low',
                category: 'capacity',
                timestamp: new Date(),
                data: { source: 'system' }
            });
        }

        return insights.sort((a, b) => {
            const priorityMap = { critical: 4, high: 3, medium: 2, low: 1 };
            return priorityMap[b.priority] - priorityMap[a.priority];
        });
    }

    // Helper methods for fallback insights
    private static getAQICategory(aqi: number): string {
        if (aqi <= 50) return 'Good';
        if (aqi <= 100) return 'Moderate';
        if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
        if (aqi <= 200) return 'Unhealthy';
        if (aqi <= 300) return 'Very Unhealthy';
        return 'Hazardous';
    }

    private static analyzeAQIImpact(aqiData: any): HealthcareInsight | null {
        const aqi = aqiData.value || 0;

        if (aqi >= 200) {
            return {
                id: `aqi-${Date.now()}`,
                type: 'alert',
                title: 'Critical Air Quality Alert',
                description: `AQI level of ${aqi} (Very Unhealthy) indicates severe respiratory health risks. Expect 40-50% increase in respiratory admissions within 24-48 hours. Immediate action required: increase ICU capacity, stock respiratory medications, activate emergency protocols.`,
                confidence: 0.92,
                priority: 'critical',
                category: 'environmental',
                timestamp: new Date(),
                data: { aqi, expectedIncrease: '40-50%', timeframe: '24-48h', source: 'fallback' }
            };
        } else if (aqi >= 150) {
            return {
                id: `aqi-${Date.now()}`,
                type: 'recommendation',
                title: 'Elevated Respiratory Risk',
                description: `AQI at ${aqi} (Unhealthy). Anticipate 25-30% increase in respiratory cases. Prepare additional respiratory care beds, ensure adequate ventilator availability, brief staff on air quality-related symptoms.`,
                confidence: 0.85,
                priority: 'high',
                category: 'environmental',
                timestamp: new Date(),
                data: { aqi, expectedIncrease: '25-30%', source: 'fallback' }
            };
        } else if (aqi >= 100) {
            return {
                id: `aqi-${Date.now()}`,
                type: 'recommendation',
                title: 'Moderate Air Quality Impact',
                description: `AQI at ${aqi} (Moderate). Expect slight increase (10-15%) in respiratory consultations. Monitor sensitive patient populations closely.`,
                confidence: 0.78,
                priority: 'medium',
                category: 'environmental',
                timestamp: new Date(),
                data: { aqi, expectedIncrease: '10-15%', source: 'fallback' }
            };
        }

        return null;
    }

    private static analyzeCapacity(hospitalData: any): HealthcareInsight[] {
        const insights: HealthcareInsight[] = [];
        const occupancyRate = hospitalData.occupancyRate || 0;
        const totalBeds = hospitalData.totalBeds || 0;

        if (occupancyRate >= 90) {
            insights.push({
                id: `capacity-${Date.now()}-1`,
                type: 'alert',
                title: 'Critical Bed Capacity',
                description: `Hospital at ${occupancyRate}% occupancy (${Math.round(totalBeds * occupancyRate / 100)}/${totalBeds} beds). Critical threshold reached. Activate overflow protocols, defer non-urgent surgeries, coordinate patient transfers.`,
                confidence: 0.95,
                priority: 'critical',
                category: 'capacity',
                timestamp: new Date(),
                data: { occupancyRate, totalBeds, source: 'fallback' }
            });
        } else if (occupancyRate >= 75) {
            insights.push({
                id: `capacity-${Date.now()}-2`,
                type: 'recommendation',
                title: 'Approaching Capacity Limits',
                description: `Current occupancy at ${occupancyRate}%. Prepare for potential capacity constraints. Consider early discharge planning for stable patients and optimize bed turnover.`,
                confidence: 0.87,
                priority: 'high',
                category: 'capacity',
                timestamp: new Date(),
                data: { occupancyRate, totalBeds, source: 'fallback' }
            });
        }

        return insights;
    }

    private static analyzeTrends(predictionData: any): HealthcareInsight | null {
        const predictions = predictionData.predictions || [];

        if (predictions.length < 3) return null;

        const avgPredicted = predictions.reduce((sum: number, p: any) => sum + (p.predicted || 0), 0) / predictions.length;
        const recent = predictions[predictions.length - 1]?.predicted || 0;
        const percentChange = ((recent - avgPredicted) / avgPredicted) * 100;

        if (percentChange > 20) {
            return {
                id: `surge-${Date.now()}`,
                type: 'alert',
                title: 'Patient Surge Pattern Detected',
                description: `Predictive models indicate ${Math.round(percentChange)}% increase above average baseline. Likely triggers: seasonal factors, local outbreaks, or environmental conditions. Prepare for increased ED volume.`,
                confidence: 0.88,
                priority: 'high',
                category: 'outbreak',
                timestamp: new Date(),
                data: { percentChange, avgBaseline: Math.round(avgPredicted), projected: Math.round(recent), source: 'fallback' }
            };
        }

        return null;
    }

    /**
     * Generate staffing recommendations using Gemini AI
     */
    static async getStaffingRecommendations(predictedLoad: number, currentStaff: number): Promise<HealthcareInsight> {
        try {
            if (!process.env.GEMINI_API_KEY) {
                return this.getFallbackStaffingRecommendation(predictedLoad, currentStaff);
            }

            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

            const prompt = `You are a healthcare staffing optimization AI.

STAFFING DATA:
- Predicted Patient Load: ${predictedLoad} patients
- Current Staff Count: ${currentStaff} staff members
- Standard Ratio: 1 staff per 6 patients (adjustable based on acuity)

TASK:
Analyze the staffing situation and provide a recommendation in JSON format:

{
  "type": "recommendation" or "alert",
  "priority": "critical", "high", "medium", or "low",
  "title": "Brief title",
  "description": "Detailed staffing recommendation with specific numbers and actions",
  "confidence": 0.0 to 1.0,
  "recommendedStaff": number,
  "staffingGap": number (can be negative if overstaffed)
}

Consider:
- Patient safety (minimum ratios)
- Staff workload and fatigue
- Peak hour considerations
- Urgency of staffing changes

Provide ONLY the JSON object, no additional text.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            let aiText = response.text().trim();

            // Remove markdown if present
            if (aiText.startsWith('```')) {
                aiText = aiText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            }

            const staffingData = JSON.parse(aiText);

            return {
                id: `staffing-gemini-${Date.now()}`,
                type: staffingData.type || 'recommendation',
                title: staffingData.title,
                description: staffingData.description,
                confidence: staffingData.confidence || 0.85,
                priority: staffingData.priority || 'medium',
                category: 'staffing',
                timestamp: new Date(),
                data: {
                    predictedLoad,
                    currentStaff,
                    recommendedStaff: staffingData.recommendedStaff,
                    staffingGap: staffingData.staffingGap,
                    source: 'gemini-ai'
                }
            };
        } catch (error) {
            console.error('Gemini staffing analysis error:', error);
            return this.getFallbackStaffingRecommendation(predictedLoad, currentStaff);
        }
    }

    private static getFallbackStaffingRecommendation(predictedLoad: number, currentStaff: number): HealthcareInsight {
        const optimalRatio = 6;
        const recommendedStaff = Math.ceil(predictedLoad / optimalRatio);
        const staffingGap = recommendedStaff - currentStaff;

        return {
            id: `staffing-fallback-${Date.now()}`,
            type: 'recommendation',
            title: staffingGap > 0 ? 'Additional Staffing Needed' : 'Adequate Staffing Levels',
            description: staffingGap > 0
                ? `Based on predicted patient load of ${predictedLoad}, recommend ${recommendedStaff} staff members (current: ${currentStaff}). Shortage of ${staffingGap} staff. Consider calling in part-time staff or activating on-call personnel.`
                : `Current staffing of ${currentStaff} is adequate for predicted load of ${predictedLoad} patients. Maintain current levels.`,
            confidence: 0.85,
            priority: staffingGap > 5 ? 'high' : 'medium',
            category: 'staffing',
            timestamp: new Date(),
            data: { predictedLoad, currentStaff, recommendedStaff, staffingGap, source: 'fallback' }
        };
    }
}

export default HealthcareAnalyticsService;
