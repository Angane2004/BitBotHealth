'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockHospitals } from '@/lib/mock-data';
import { Building2, MapPin, Bed, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function HospitalsPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Hospitals</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage and monitor hospital resources and predictions
                    </p>
                </div>
                <Button>
                    <Building2 className="h-4 w-4 mr-2" />
                    Add Hospital
                </Button>
            </div>

            {/* Hospital Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {mockHospitals.map((hospital) => {
                    const occupancyRate = (hospital.currentOccupancy.total / hospital.capacity.totalBeds) * 100;
                    const isHighOccupancy = occupancyRate >= 80;

                    return (
                        <Card key={hospital.id} className="hover:shadow-lg transition-all">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-xl">{hospital.name}</CardTitle>
                                        <CardDescription className="flex items-center gap-1 mt-1">
                                            <MapPin className="h-3 w-3" />
                                            {hospital.location.address}, {hospital.location.city}
                                        </CardDescription>
                                    </div>
                                    {isHighOccupancy && (
                                        <Badge variant="destructive">High Occupancy</Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Capacity Overview */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                        <Bed className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <div className="text-sm text-muted-foreground">Bed Occupancy</div>
                                            <div className="text-lg font-bold">{occupancyRate.toFixed(0)}%</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                        <Users className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <div className="text-sm text-muted-foreground">Total Staff</div>
                                            <div className="text-lg font-bold">
                                                {hospital.staff.doctors + hospital.staff.nurses + hospital.staff.technicians}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Departments */}
                                <div>
                                    <div className="text-sm font-medium mb-2">Departments</div>
                                    <div className="flex flex-wrap gap-2">
                                        {hospital.departments.map((dept) => (
                                            <Badge key={dept} variant="outline">
                                                {dept}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-2">
                                    <Link href={`/hospitals/${hospital.id}`} className="flex-1">
                                        <Button variant="default" className="w-full">
                                            <TrendingUp className="h-4 w-4 mr-2" />
                                            View Predictions
                                        </Button>
                                    </Link>
                                    <Button variant="outline">
                                        Details
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
