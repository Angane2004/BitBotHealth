import {
    collection,
    CollectionReference,
    DocumentData
} from 'firebase/firestore';
import { db } from './firebase';

// Data Models
export interface Hospital {
    id: string;
    name: string;
    location: {
        lat: number;
        lng: number;
        address: string;
        city: string;
    };
    departments: string[];
    capacity: {
        totalBeds: number;
        icuBeds: number;
        emergencyBeds: number;
    };
    currentOccupancy: {
        total: number;
        icu: number;
        emergency: number;
    };
    staff: {
        doctors: number;
        nurses: number;
        technicians: number;
    };
    inventory: {
        oxygenCylinders: number;
        ppeMasks: number;
        asthmaKits: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface Prediction {
    id: string;
    hospitalId: string;
    department: 'Emergency' | 'Respiratory' | 'OPD' | 'ICU';
    date: Date;
    predictedPatients: number;
    confidenceInterval: {
        lower: number;
        upper: number;
    };
    confidence: number;
    factors: {
        aqi?: number;
        temperature?: number;
        festival?: string;
        historicalTrend?: string;
    };
    createdAt: Date;
}

export interface ActionItem {
    id: string;
    hospitalId: string;
    predictionId: string;
    priority: 'high' | 'medium' | 'low';
    category: 'staffing' | 'supplies' | 'infrastructure' | 'advisory';
    title: string;
    description: string;
    rationale: string;
    estimatedCost?: number;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    assignedTo?: string;
    dueDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface AuditLog {
    id: string;
    userId: string;
    action: string;
    entityType: string;
    entityId: string;
    changes?: any;
    timestamp: Date;
}

// Collection References
export const hospitalsCollection = collection(db, 'hospitals') as CollectionReference<Hospital>;
export const predictionsCollection = collection(db, 'predictions') as CollectionReference<Prediction>;
export const actionsCollection = collection(db, 'actions') as CollectionReference<ActionItem>;
export const auditLogsCollection = collection(db, 'auditLogs') as CollectionReference<AuditLog>;
