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

// City-specific Weather and AQI Data
export const cityWeatherData: Record<string, { temperature: number; humidity: number; conditions: string; aqi: number }> = {
    'Delhi': { temperature: 18, humidity: 65, conditions: 'Hazy', aqi: 285 },
    'Mumbai': { temperature: 28, humidity: 75, conditions: 'Humid', aqi: 95 },
    'Bangalore': { temperature: 24, humidity: 60, conditions: 'Partly Cloudy', aqi: 65 },
    'Hyderabad': { temperature: 26, humidity: 55, conditions: 'Clear', aqi: 110 },
    'Chennai': { temperature: 32, humidity: 80, conditions: 'Hot', aqi: 88 },
    'Kolkata': { temperature: 22, humidity: 70, conditions: 'Cloudy', aqi: 180 },
    'Pune': { temperature: 25, humidity: 58, conditions: 'Pleasant', aqi: 72 },
    'Ahmedabad': { temperature: 27, humidity: 50, conditions: 'Clear', aqi: 125 },
};

// Mock Festival Calendar
export const mockFestivals = [
    { name: 'Navratri', date: new Date('2025-03-22'), impact: 'high', description: 'Nine-day Hindu festival' },
    { name: 'Holi', date: new Date('2025-03-14'), impact: 'high', description: 'Festival of colors' },
    { name: 'Eid ul-Fitr', date: new Date('2025-03-31'), impact: 'medium', description: 'End of Ramadan' },
    { name: 'Diwali', date: new Date('2025-10-20'), impact: 'high', description: 'Festival of lights' },
    { name: 'Ganesh Chaturthi', date: new Date('2025-08-27'), impact: 'medium', description: 'Birth of Lord Ganesha' },
    { name: 'Durga Puja', date: new Date('2025-09-30'), impact: 'high', description: 'Worship of Goddess Durga' },
    { name: 'Eid ul-Adha', date: new Date('2025-06-07'), impact: 'medium', description: 'Festival of sacrifice' },
    { name: 'Christmas', date: new Date('2025-12-25'), impact: 'low', description: 'Christian festival' },
    { name: 'Makar Sankranti', date: new Date('2026-01-14'), impact: 'low', description: 'Harvest festival' },
    { name: 'Janmashtami', date: new Date('2025-08-16'), impact: 'medium', description: 'Birth of Lord Krishna' },
];

// Mock Notifications (Past 7 Days)
export interface Notification {
    id: string;
    type: 'aqi' | 'project';
    title: string;
    message: string;
    city: string;
    timestamp: Date;
    severity: 'info' | 'warning' | 'critical';
    read: boolean;
}


export const mockNotifications: Notification[] = [
    // Delhi Notifications
    { id: '1', type: 'aqi', title: 'AQI Spike Alert', message: 'Air quality reached 285 (Very Poor). Respiratory cases expected to increase.', city: 'Delhi', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), severity: 'critical', read: false },
    { id: '2', type: 'project', title: 'Prediction Approved', message: 'Emergency department surge plan for 95 patients approved.', city: 'Delhi', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), severity: 'info', read: false },
    { id: '3', type: 'aqi', title: 'Pollution Warning', message: 'Expected AQI increase to 310 due to festival activities.', city: 'Delhi', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), severity: 'warning', read: true },
    { id: '4', type: 'project', title: 'Resource Allocated', message: 'Additional 5 ICU beds allocated for respiratory cases.', city: 'Delhi', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), severity: 'info', read: true },

    // Mumbai Notifications
    { id: '5', type: 'aqi', title: 'Air Quality Improved', message: 'AQI dropped to 95 (Moderate). Coastal winds improving conditions.', city: 'Mumbai', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), severity: 'info', read: false },
    { id: '6', type: 'project', title: 'System Update', message: 'New AQI data source integrated for real-time monitoring.', city: 'Mumbai', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), severity: 'info', read: false },
    { id: '7', type: 'aqi', title: 'Humidity Alert', message: 'High humidity (85%) may affect respiratory patients.', city: 'Mumbai', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), severity: 'warning', read: true },

    // Bangalore Notifications
    { id: '8', type: 'project', title: 'Forecast Updated', message: 'OPD patient volume forecast updated: 210 expected tomorrow.', city: 'Bangalore', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), severity: 'info', read: false },
    { id: '9', type: 'aqi', title: 'Good Air Quality', message: 'AQI maintained at 65 (Satisfactory). No alerts.', city: 'Bangalore', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), severity: 'info', read: true },
    { id: '10', type: 'project', title: 'Staff Scheduled', message: '3 additional doctors scheduled for weekend surge.', city: 'Bangalore', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), severity: 'info', read: true },

    // Hyderabad Notifications
    { id: '11', type: 'aqi', title: 'Moderate AQI', message: 'Current AQI: 125 (Moderate). Monitor sensitive groups.', city: 'Hyderabad', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), severity: 'warning', read: false },
    { id: '12', type: 'project', title: 'Supplies Ordered', message: '500 asthma kits ordered for festival season.', city: 'Hyderabad', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), severity: 'info', read: true },

    // Chennai Notifications
    { id: '13', type: 'aqi', title: 'Coastal Air Quality', message: 'Sea breeze maintaining AQI at 75 (Satisfactory).', city: 'Chennai', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), severity: 'info', read: false },
    { id: '14', type: 'project', title: 'Heatwave Prep', message: 'Heatwave protocol activated. Hydration kits ready.', city: 'Chennai', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), severity: 'warning', read: true },

    // Kolkata Notifications
    { id: '15', type: 'aqi', title: 'AQI Rising', message: 'AQI increased to 180 (Moderate). Industrial emissions detected.', city: 'Kolkata', timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), severity: 'warning', read: false },
    { id: '16', type: 'project', title: 'Prediction Rejected', message: 'ICU surge plan rejected due to stable conditions.', city: 'Kolkata', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), severity: 'info', read: true },

    // Pune Notifications
    { id: '17', type: 'project', title: 'Advisory Sent', message: 'Patient advisory sent to 1,200 at-risk individuals.', city: 'Pune', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), severity: 'info', read: true },

    // Ahmedabad Notifications
    { id: '18', type: 'aqi', title: 'Dust Storm Warning', message: 'Expected dust storm may spike AQI to 250+.', city: 'Ahmedabad', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), severity: 'critical', read: false },
];

// Mock Dummy Hospitals (Distributed Across Cities)
export const mockDummyHospitals = [
    // Delhi Hospitals
    { id: 'h1', name: 'Apollo Hospital Delhi', city: 'Delhi', totalBeds: 500, occupiedBeds: 420, departments: ['Emergency', 'ICU', 'Respiratory', 'OPD'], staff: { doctors: 120, nurses: 300, technicians: 80 } },
    { id: 'h2', name: 'Fortis Escorts Heart Institute', city: 'Delhi', totalBeds: 310, occupiedBeds: 245, departments: ['Cardiology', 'Emergency', 'ICU'], staff: { doctors: 85, nurses: 180, technicians: 45 } },
    { id: 'h3', name: 'Max Super Speciality Hospital', city: 'Delhi', totalBeds: 380, occupiedBeds: 310, departments: ['Emergency', 'Neurology', 'Orthopedics', 'OPD'], staff: { doctors: 95, nurses: 220, technicians: 60 } },
    { id: 'h4', name: 'AIIMS Delhi', city: 'Delhi', totalBeds: 2500, occupiedBeds: 2100, departments: ['Emergency', 'ICU', 'Respiratory', 'OPD', 'Trauma'], staff: { doctors: 450, nurses: 1200, technicians: 350 } },

    // Mumbai Hospitals
    { id: 'h5', name: 'Lilavati Hospital', city: 'Mumbai', totalBeds: 350, occupiedBeds: 280, departments: ['Emergency', 'ICU', 'OPD'], staff: { doctors: 100, nurses: 250, technicians: 70 } },
    { id: 'h6', name: 'Hinduja Hospital', city: 'Mumbai', totalBeds: 425, occupiedBeds: 340, departments: ['Emergency', 'Cardiology', 'Respiratory', 'ICU'], staff: { doctors: 115, nurses: 280, technicians: 85 } },
    { id: 'h7', name: 'Kokilaben Dhirubhai Ambani Hospital', city: 'Mumbai', totalBeds: 750, occupiedBeds: 600, departments: ['Emergency', 'ICU', 'OPD', 'Oncology'], staff: { doctors: 180, nurses: 450, technicians: 120 } },

    // Bangalore Hospitals
    { id: 'h8', name: 'Manipal Hospital', city: 'Bangalore', totalBeds: 400, occupiedBeds: 320, departments: ['Emergency', 'ICU', 'Respiratory'], staff: { doctors: 110, nurses: 270, technicians: 75 } },
    { id: 'h9', name: 'Fortis Hospital Bangalore', city: 'Bangalore', totalBeds: 280, occupiedBeds: 210, departments: ['Emergency', 'OPD', 'Cardiology'], staff: { doctors: 75, nurses: 190, technicians: 50 } },
    { id: 'h10', name: 'Narayana Health City', city: 'Bangalore', totalBeds: 1400, occupiedBeds: 1150, departments: ['Emergency', 'ICU', 'OPD', 'Cardiology', 'Neurology'], staff: { doctors: 320, nurses: 850, technicians: 240 } },

    // Hyderabad Hospitals
    { id: 'h11', name: 'Apollo Hospitals Hyderabad', city: 'Hyderabad', totalBeds: 550, occupiedBeds: 465, departments: ['Emergency', 'ICU', 'Respiratory', 'OPD'], staff: { doctors: 135, nurses: 340, technicians: 95 } },
    { id: 'h12', name: 'KIMS Hospital', city: 'Hyderabad', totalBeds: 320, occupiedBeds: 255, departments: ['Emergency', 'ICU', 'OPD'], staff: { doctors: 90, nurses: 210, technicians: 60 } },

    // Chennai Hospitals
    { id: 'h13', name: 'Apollo Hospitals Chennai', city: 'Chennai', totalBeds: 600, occupiedBeds: 480, departments: ['Emergency', 'ICU', 'Cardiology', 'OPD'], staff: { doctors: 145, nurses: 380, technicians: 105 } },
    { id: 'h14', name: 'Fortis Malar Hospital', city: 'Chennai', totalBeds: 180, occupiedBeds: 140, departments: ['Emergency', 'OPD'], staff: { doctors: 50, nurses: 120, technicians: 35 } },

    // Kolkata Hospitals
    { id: 'h15', name: 'AMRI Hospital', city: 'Kolkata', totalBeds: 400, occupiedBeds: 330, departments: ['Emergency', 'ICU', 'Respiratory'], staff: { doctors: 105, nurses: 260, technicians: 72 } },
    { id: 'h16', name: 'Fortis Hospital Kolkata', city: 'Kolkata', totalBeds: 220, occupiedBeds: 175, departments: ['Emergency', 'OPD'], staff: { doctors: 65, nurses: 150, technicians: 42 } },

    // Pune Hospitals
    { id: 'h17', name: 'Ruby Hall Clinic', city: 'Pune', totalBeds: 350, occupiedBeds: 280, departments: ['Emergency', 'ICU', 'OPD'], staff: { doctors: 95, nurses: 230, technicians: 65 } },

    // Ahmedabad Hospital
    { id: 'h18', name: 'Sterling Hospital', city: 'Ahmedabad', totalBeds: 275, occupiedBeds: 215, departments: ['Emergency', 'ICU', 'Cardiology'], staff: { doctors: 80, nurses: 180, technicians: 52 } },
];

// AI Recommendations
export interface AIRecommendation {
    id: string;
    type: 'staffing' | 'resources' | 'alert' | 'preparation';
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    rationale: string;
    city: string;
    basedOn: {
        aqi?: number;
        festival?: string;
        capacity?: number;
        weather?: string;
    };
    expectedImpact: string;
    createdAt: Date;
}

export const mockAIRecommendations: AIRecommendation[] = [
    // Delhi - High AQI + Festival
    {
        id: 'ai-1',
        type: 'staffing',
        priority: 'high',
        title: 'Increase Respiratory Staff by 15%',
        description: 'Add 3 respiratory specialists and 8 nurses to handle expected surge in respiratory cases.',
        rationale: 'AQI at critical levels (285) combined with Holi festival in 105 days historically increases respiratory admissions by 35-40%.',
        city: 'Delhi',
        basedOn: { aqi: 285, festival: 'Holi', capacity: 84 },
        expectedImpact: '40-50 additional patients expected',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
    {
        id: 'ai-2',
        type: 'resources',
        priority: 'high',
        title: 'Order 300 Additional Respiratory Kits',
        description: 'Stock nebulizers, inhalers, oxygen masks, and asthma medication for anticipated surge.',
        rationale: 'Current inventory sufficient for 5 days. Expected surge will deplete stocks in 2-3 days.',
        city: 'Delhi',
        basedOn: { aqi: 285, capacity: 84 },
        expectedImpact: 'Prevent resource shortage during peak',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
        id: 'ai-3',
        type: 'alert',
        priority: 'medium',
        title: 'Activate Air Quality Advisory',
        description: 'Send SMS alerts to 1,500 at-risk patients (asthma, COPD) advising indoor stay.',
        rationale: 'Proactive patient communication reduces emergency admissions by 20-25%.',
        city: 'Delhi',
        basedOn: { aqi: 285 },
        expectedImpact: 'Reduce preventable ER visits by ~30 patients',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },

    // Mumbai - Good conditions
    {
        id: 'ai-4',
        type: 'preparation',
        priority: 'low',
        title: 'Schedule Routine Equipment Maintenance',
        description: 'Utilize low-occupancy period for preventive maintenance of ventilators and monitors.',
        rationale: 'Current occupancy at 80%, AQI good (95). Ideal window for maintenance.',
        city: 'Mumbai',
        basedOn: { aqi: 95, capacity: 80 },
        expectedImpact: 'Ensure equipment readiness for future surges',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
    {
        id: 'ai-5',
        type: 'staffing',
        priority: 'medium',
        title: 'Optimize Weekend Shift Coverage',
        description: 'Adjust staffing ratios for predicted 15% increase in weekend admissions.',
        rationale: 'Historical data shows weekend surge during monsoon season.',
        city: 'Mumbai',
        basedOn: { weather: 'Humid', capacity: 80 },
        expectedImpact: 'Better patient-to-staff ratio',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },

    // Bangalore - Moderate conditions
    {
        id: 'ai-6',
        type: 'resources',
        priority: 'medium',
        title: 'Prepare Additional 20 Beds',
        description: 'Convert 2 general wards to accommodate respiratory overflow if needed.',
        rationale: 'AQI trending upward (65→85). Proactive capacity planning recommended.',
        city: 'Bangalore',
        basedOn: { aqi: 65, capacity: 78 },
        expectedImpact: 'Ready for 10-15% surge',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    },

    // Hyderabad - Festival preparation
    {
        id: 'ai-7',
        type: 'preparation',
        priority: 'medium',
        title: 'Festival Surge Preparation',
        description: 'Stock additional supplies and schedule extra staff for upcoming festival period.',
        rationale: 'Ganesh Chaturthi approaching. Historical data shows 25% increase in admissions.',
        city: 'Hyderabad',
        basedOn: { festival: 'Ganesh Chaturthi', capacity: 85 },
        expectedImpact: 'Smooth handling of festival surge',
        createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
    },

    // Chennai - Heatwave
    {
        id: 'ai-8',
        type: 'alert',
        priority: 'high',
        title: 'Heatwave Protocol Activation',
        description: 'Activate cooling centers, stock IV fluids, and alert staff about heat-related illness protocols.',
        rationale: 'Temperature exceeding 38°C. Expected increase in heat exhaustion and dehydration cases.',
        city: 'Chennai',
        basedOn: { weather: 'Hot', capacity: 82 },
        expectedImpact: 'Prevent heat-related complications',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },

    // Kolkata - Industrial emissions
    {
        id: 'ai-9',
        type: 'staffing',
        priority: 'medium',
        title: 'Monitor Respiratory Cases Closely',
        description: 'Assign dedicated respiratory monitoring team for next 48 hours.',
        rationale: 'AQI rising to 180 due to industrial emissions. Early detection prevents complications.',
        city: 'Kolkata',
        basedOn: { aqi: 180 },
        expectedImpact: 'Early intervention for at-risk patients',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
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

