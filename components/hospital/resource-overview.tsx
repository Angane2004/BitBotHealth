'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { mockHospitals } from '@/lib/mock-data';
import { Bed, Users, Package } from 'lucide-react';

interface ResourceOverviewProps {
    hospitalId?: string;
}

export function ResourceOverview({ hospitalId = '1' }: ResourceOverviewProps) {
    const hospital = mockHospitals.find(h => h.id === hospitalId) || mockHospitals[0];

    const bedOccupancy = (hospital.currentOccupancy.total / hospital.capacity.totalBeds) * 100;
    const icuOccupancy = (hospital.currentOccupancy.icu / hospital.capacity.icuBeds) * 100;
    const emergencyOccupancy = (hospital.currentOccupancy.emergency / hospital.capacity.emergencyBeds) * 100;

    const getOccupancyColor = (percentage: number) => {
        if (percentage >= 90) return 'bg-red-500';
        if (percentage >= 75) return 'bg-orange-500';
        if (percentage >= 50) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle className="text-lg">Resource Overview</CardTitle>
                <CardDescription>{hospital.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Bed Capacity */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bed className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">Total Beds</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                            {hospital.currentOccupancy.total}/{hospital.capacity.totalBeds}
                        </span>
                    </div>
                    <div className="space-y-1">
                        <Progress value={bedOccupancy} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                            {bedOccupancy.toFixed(0)}% occupied
                        </p>
                    </div>
                </div>

                {/* ICU Capacity */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bed className="h-5 w-5 text-red-500" />
                            <span className="font-medium">ICU Beds</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                            {hospital.currentOccupancy.icu}/{hospital.capacity.icuBeds}
                        </span>
                    </div>
                    <div className="space-y-1">
                        <div className="w-full bg-secondary rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all ${getOccupancyColor(icuOccupancy)}`}
                                style={{ width: `${icuOccupancy}%` }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {icuOccupancy.toFixed(0)}% occupied
                        </p>
                    </div>
                </div>

                {/* Emergency Capacity */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bed className="h-5 w-5 text-orange-500" />
                            <span className="font-medium">Emergency Beds</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                            {hospital.currentOccupancy.emergency}/{hospital.capacity.emergencyBeds}
                        </span>
                    </div>
                    <div className="space-y-1">
                        <div className="w-full bg-secondary rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all ${getOccupancyColor(emergencyOccupancy)}`}
                                style={{ width: `${emergencyOccupancy}%` }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {emergencyOccupancy.toFixed(0)}% occupied
                        </p>
                    </div>
                </div>

                {/* Staff */}
                <div className="pt-3 border-t">
                    <div className="flex items-center gap-2 mb-3">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Staff</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="p-2 rounded-lg bg-muted/50">
                            <div className="text-2xl font-bold">{hospital.staff.doctors}</div>
                            <div className="text-xs text-muted-foreground">Doctors</div>
                        </div>
                        <div className="p-2 rounded-lg bg-muted/50">
                            <div className="text-2xl font-bold">{hospital.staff.nurses}</div>
                            <div className="text-xs text-muted-foreground">Nurses</div>
                        </div>
                        <div className="p-2 rounded-lg bg-muted/50">
                            <div className="text-2xl font-bold">{hospital.staff.technicians}</div>
                            <div className="text-xs text-muted-foreground">Technicians</div>
                        </div>
                    </div>
                </div>

                {/* Inventory */}
                <div className="pt-3 border-t">
                    <div className="flex items-center gap-2 mb-3">
                        <Package className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Critical Inventory</span>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Oxygen Cylinders</span>
                            <span className="font-medium">{hospital.inventory.oxygenCylinders}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">PPE Masks</span>
                            <span className="font-medium">{hospital.inventory.ppeMasks.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Asthma Kits</span>
                            <span className="font-medium">{hospital.inventory.asthmaKits}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
