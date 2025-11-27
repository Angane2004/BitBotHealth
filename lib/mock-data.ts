import { Hospital, Prediction, ActionItem } from './firebase/collections';

// Mock Hospitals Data
export const mockHospitals: Hospital[] = [
    {
        id: '1',
        name: 'Apollo Hospital Delhi',
        location: {
            lat: 28.5494,
            lng: 77.2001,
            address: 'Sarita Vihar, Delhi',
            city: 'Delhi',
        },
        departments: ['Emergency', 'Respiratory', 'OPD', 'ICU'],
        capacity: {
            totalBeds: 500,
            icuBeds: 80,
            emergencyBeds: 100,
        },
        currentOccupancy: {
            total: 420,
            icu: 65,
            emergency: 82,
        },
        staff: {
            doctors: 120,
            nurses: 300,
            technicians: 80,
        },
        inventory: {
            oxygenCylinders: 150,
            ppeMasks: 5000,
            asthmaKits: 200,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '2',
        name: 'Fortis Hospital Gurgaon',
        location: {
            lat: 28.4595,
            lng: 77.0266,
            address: 'Sector 44, Gurgaon',
            city: 'Gurgaon',
        },
        departments: ['Emergency', 'Respiratory', 'OPD', 'ICU'],
        capacity: {
            totalBeds: 400,
            icuBeds: 60,
            emergencyBeds: 80,
        },
        currentOccupancy: {
            total: 310,
            icu: 48,
            emergency: 65,
        },
        staff: {
            doctors: 95,
            nurses: 240,
            technicians: 65,
        },
        inventory: {
            oxygenCylinders: 120,
            ppeMasks: 4000,
            asthmaKits: 150,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

// Mock Predictions Data
export const mockPredictions: Prediction[] = [
    {
        id: '1',
        hospitalId: '1',
        department: 'Emergency',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        predictedPatients: 95,
        confidenceInterval: { lower: 85, upper: 105 },
        confidence: 0.87,
        factors: {
            aqi: 285,
            temperature: 18,
            festival: 'Diwali',
            historicalTrend: 'increasing',
        },
        createdAt: new Date(),
    },
    {
        id: '2',
        hospitalId: '1',
        department: 'Respiratory',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        predictedPatients: 145,
        confidenceInterval: { lower: 130, upper: 160 },
        confidence: 0.92,
        factors: {
            aqi: 285,
            temperature: 18,
            festival: 'Diwali',
            historicalTrend: 'increasing',
        },
        createdAt: new Date(),
    },
];

// Mock Action Items
export const mockActions: ActionItem[] = [
    {
        id: '1',
        hospitalId: '1',
        predictionId: '1',
        priority: 'high',
        category: 'staffing',
        title: 'Increase Emergency Department Staff',
        description: 'Add 5 additional nurses and 2 doctors to emergency department for next 3 days',
        rationale: 'Predicted 40% surge in emergency admissions due to Diwali pollution spike (AQI 285)',
        estimatedCost: 75000,
        status: 'pending',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '2',
        hospitalId: '1',
        predictionId: '2',
        priority: 'high',
        category: 'supplies',
        title: 'Stock Respiratory Supplies',
        description: 'Order 100 additional oxygen cylinders and 500 asthma kits',
        rationale: 'Expected 60% increase in respiratory cases during Diwali week',
        estimatedCost: 125000,
        status: 'pending',
        dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '3',
        hospitalId: '1',
        predictionId: '1',
        priority: 'medium',
        category: 'advisory',
        title: 'Send Patient Advisory',
        description: 'Send SMS alerts to at-risk patients about air quality and precautions',
        rationale: 'Proactive patient engagement can reduce emergency visits by 15-20%',
        status: 'approved',
        dueDate: new Date(Date.now() + 12 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

// Mock Festival Calendar
export const mockFestivals = [
    { name: 'Diwali', date: new Date('2024-11-01'), impact: 'high' },
    { name: 'Holi', date: new Date('2025-03-14'), impact: 'high' },
    { name: 'Ganesh Chaturthi', date: new Date('2024-09-07'), impact: 'medium' },
    { name: 'Eid', date: new Date('2024-04-11'), impact: 'medium' },
    { name: 'Christmas', date: new Date('2024-12-25'), impact: 'low' },
];

// Mock AQI Data
export const mockAQIData = {
    current: 285,
    category: 'Very Poor',
    color: '#e74c3c',
    forecast: [
        { date: new Date(), value: 285 },
        { date: new Date(Date.now() + 24 * 60 * 60 * 1000), value: 310 },
        { date: new Date(Date.now() + 48 * 60 * 60 * 1000), value: 295 },
        { date: new Date(Date.now() + 72 * 60 * 60 * 1000), value: 265 },
        { date: new Date(Date.now() + 96 * 60 * 60 * 1000), value: 240 },
    ],
};

// Mock Weather Data
export const mockWeatherData = {
    temperature: 18,
    humidity: 65,
    conditions: 'Hazy',
    forecast: [
        { date: new Date(), temp: 18, conditions: 'Hazy' },
        { date: new Date(Date.now() + 24 * 60 * 60 * 1000), temp: 17, conditions: 'Hazy' },
        { date: new Date(Date.now() + 48 * 60 * 60 * 1000), temp: 19, conditions: 'Partly Cloudy' },
    ],
};
