'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Users, Bed, TrendingUp, Plus, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useState } from 'react';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useHospitals } from '@/lib/firebase/hooks';
import { Hospital } from '@/lib/firebase/collections';
import { useLiveWeather } from '@/lib/hooks/weather';
import { useLocationStore } from '@/lib/hooks/useLocation';
import { mockDummyHospitals } from '@/lib/mock-data';
import { LocationSelector } from '@/components/layout/location-selector';

function HospitalWeatherTag({ city }: { city?: string }) {
    const { snapshot } = useLiveWeather({ city: city || 'Delhi', refreshInterval: 1000 * 60 * 3 });
    if (!snapshot) return null;
    return (
        <Badge className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white border-none">
            AQI {snapshot.aqi ?? '—'} · {snapshot.temperature}°C
        </Badge>
    );
}

export default function HospitalsPage() {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showManageDialog, setShowManageDialog] = useState(false);
    const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
    const [manageForm, setManageForm] = useState({
        totalBeds: '',
        occupiedBeds: '',
        doctors: '',
        nurses: '',
    });
    const [newHospital, setNewHospital] = useState({
        name: '',
        city: '',
        totalBeds: '',
        departments: '',
    });
    const { hospitals: firebaseHospitals, loading } = useHospitals();
    const { location } = useLocationStore();

    // Merge Firebase hospitals with dummy hospitals
    const allHospitals = [
        ...firebaseHospitals,
        ...mockDummyHospitals.map(h => ({
            id: h.id,
            name: h.name,
            location: {
                city: h.city,
                lat: 0,
                lng: 0,
                address: h.city,
            },
            capacity: {
                totalBeds: h.totalBeds,
                icuBeds: 0,
                emergencyBeds: 0,
            },
            currentOccupancy: {
                total: h.occupiedBeds,
                icu: 0,
                emergency: 0,
            },
            staff: h.staff,
            departments: h.departments,
            inventory: {
                oxygenCylinders: 0,
                ppeMasks: 0,
                asthmaKits: 0,
            },
            createdAt: new Date(),
            updatedAt: new Date(),
        } as Hospital))
    ];

    // Filter by selected location
    const hospitals = location?.city
        ? allHospitals.filter(h => h.location?.city === location.city)
        : allHospitals;

    const handleAddHospital = async () => {
        try {
            const hospitalsRef = collection(db, 'hospitals');
            await addDoc(hospitalsRef, {
                name: newHospital.name,
                location: {
                    city: newHospital.city,
                },
                capacity: {
                    totalBeds: Number(newHospital.totalBeds),
                },
                currentOccupancy: {
                    total: 0,
                },
                staff: {
                    doctors: 0,
                    nurses: 0,
                    technicians: 0,
                },
                departments: newHospital.departments.split(',').map(d => d.trim()),
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            toast.success('Hospital Added', {
                description: `${newHospital.name} has been added successfully`,
            });

            setShowAddDialog(false);
            setNewHospital({ name: '', city: '', totalBeds: '', departments: '' });
        } catch (error) {
            toast.error('Error', {
                description: (error as Error).message || 'Failed to add hospital. Please try again.',
            });
        }
    };

    const handleSaveManage = async () => {
        if (!selectedHospital) return;
        try {
            await updateDoc(doc(db, 'hospitals', selectedHospital.id), {
                capacity: {
                    ...selectedHospital.capacity,
                    totalBeds: Number(manageForm.totalBeds),
                },
                currentOccupancy: {
                    ...selectedHospital.currentOccupancy,
                    total: Number(manageForm.occupiedBeds),
                },
                staff: {
                    ...selectedHospital.staff,
                    doctors: Number(manageForm.doctors),
                    nurses: Number(manageForm.nurses),
                },
                updatedAt: serverTimestamp(),
            });
            toast.success('Hospital updated');
            setShowManageDialog(false);
        } catch (error) {
            toast.error('Failed to update hospital', { description: (error as Error).message });
        }
    };

    const handleManage = (hospital: Hospital) => {
        setSelectedHospital(hospital);
        setManageForm({
            totalBeds: hospital.capacity?.totalBeds?.toString() ?? '',
            occupiedBeds: hospital.currentOccupancy?.total?.toString() ?? '',
            doctors: hospital.staff?.doctors?.toString() ?? '',
            nurses: hospital.staff?.nurses?.toString() ?? '',
        });
        setShowManageDialog(true);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">
                        Hospitals {location?.city && `in ${location.city}`}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {location?.city
                            ? `Showing ${hospitals.length} hospital${hospitals.length !== 1 ? 's' : ''} in ${location.city}`
                            : `Manage and monitor all hospital locations (${hospitals.length} total)`
                        }
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Location Selector */}
                    <LocationSelector />

                    {/* Add Hospital Dialog */}
                    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                        <DialogTrigger asChild>
                            <Button className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black transition-all duration-200 hover:scale-105 shadow-lg">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Hospital
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white dark:bg-gray-900">
                            <DialogHeader>
                                <DialogTitle className="text-black dark:text-white">Add New Hospital</DialogTitle>
                                <DialogDescription className="text-gray-600 dark:text-gray-400">
                                    Enter the details of the new hospital
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-black dark:text-white">Hospital Name</Label>
                                    <Input
                                        id="name"
                                        value={newHospital.name}
                                        onChange={(e) => setNewHospital({ ...newHospital, name: e.target.value })}
                                        placeholder="Apollo Hospital"
                                        className="border-black dark:border-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city" className="text-black dark:text-white">City</Label>
                                    <Input
                                        id="city"
                                        value={newHospital.city}
                                        onChange={(e) => setNewHospital({ ...newHospital, city: e.target.value })}
                                        placeholder="Delhi"
                                        className="border-black dark:border-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="beds" className="text-black dark:text-white">Total Beds</Label>
                                    <Input
                                        id="beds"
                                        type="number"
                                        value={newHospital.totalBeds}
                                        onChange={(e) => setNewHospital({ ...newHospital, totalBeds: e.target.value })}
                                        placeholder="500"
                                        className="border-black dark:border-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="departments" className="text-black dark:text-white">Departments (comma-separated)</Label>
                                    <Input
                                        id="departments"
                                        value={newHospital.departments}
                                        onChange={(e) => setNewHospital({ ...newHospital, departments: e.target.value })}
                                        placeholder="Emergency, ICU, OPD"
                                        className="border-black dark:border-white"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setShowAddDialog(false)} className="border-black dark:border-white">
                                    Cancel
                                </Button>
                                <Button onClick={handleAddHospital} className="bg-black dark:bg-white text-white dark:text-black">
                                    Add Hospital
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {loading && (
                <Card className="border-2 bg-white/80 dark:bg-white/5">
                    <CardContent className="p-6 text-gray-600 dark:text-gray-300">Syncing hospitals…</CardContent>
                </Card>
            )}

            {/* Hospitals Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                {(loading ? [] : hospitals).map((hospital) => {
                    const totalBeds = hospital.capacity?.totalBeds ?? 0;
                    const occupiedBeds = hospital.currentOccupancy?.total ?? 0;
                    const occupancyPercentage = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
                    const isHighOccupancy = occupancyPercentage > 80;
                    const staff = hospital.staff ?? { doctors: 0, nurses: 0, technicians: 0 };
                    const totalStaff = (staff.doctors ?? 0) + (staff.nurses ?? 0) + (staff.technicians ?? 0);
                    const departments = hospital.departments ?? [];

                    return (
                        <Card
                            key={hospital.id}
                            className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-2 hover:border-black dark:hover:border-white bg-white dark:bg-gray-900"
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 rounded-lg bg-black dark:bg-white shadow-lg">
                                            <Building2 className="h-6 w-6 text-white dark:text-black" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl text-black dark:text-white">{hospital.name}</CardTitle>
                                            <CardDescription className="flex items-center gap-2 mt-1 text-gray-600 dark:text-gray-400">
                                                <span>{hospital.location?.city ?? 'Unknown'}</span>
                                                {isHighOccupancy && (
                                                    <Badge variant="destructive" className="animate-pulse">High Occupancy</Badge>
                                                )}
                                            </CardDescription>
                                            <HospitalWeatherTag city={hospital.location?.city ?? 'Unknown'} />
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            <Bed className="h-4 w-4" />
                                            Bed Occupancy
                                        </span>
                                        <span className="font-medium text-black dark:text-white">{occupancyPercentage}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-500 ${isHighOccupancy
                                                ? 'bg-gradient-to-r from-red-500 to-orange-500'
                                                : 'bg-black dark:bg-white'
                                                }`}
                                            style={{ width: `${occupancyPercentage}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {occupiedBeds} of {totalBeds} beds occupied
                                    </p>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                    <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Users className="h-4 w-4" />
                                        Total Staff
                                    </span>
                                    <span className="font-semibold text-black dark:text-white">{totalStaff}</span>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-sm font-medium text-black dark:text-white">Departments</span>
                                    <div className="flex flex-wrap gap-2">
                                        {departments.map((dept) => (
                                            <Badge key={dept} variant="outline" className="transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 border-black dark:border-white text-black dark:text-white">
                                                {dept}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Link href={`/predictions`} className="flex-1">
                                        <Button variant="outline" className="w-full transition-all duration-200 hover:scale-105 border-black dark:border-white text-black dark:text-white">
                                            <TrendingUp className="mr-2 h-4 w-4" />
                                            View Predictions
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="default"
                                        onClick={() => handleManage(hospital)}
                                        className="flex-1 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black transition-all duration-200 hover:scale-105"
                                    >
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Manage
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
                {!loading && hospitals.length === 0 && (
                    <Card className="border-2 bg-white/80 dark:bg-white/5 col-span-full">
                        <CardContent className="p-8 text-center text-gray-600 dark:text-gray-300">
                            {location?.city
                                ? `No hospitals found in ${location.city}. Try selecting a different location.`
                                : 'No hospitals yet. Add your first location to start tracking.'
                            }
                        </CardContent>
                    </Card>
                )}
            </div>

            <Dialog open={showManageDialog} onOpenChange={setShowManageDialog}>
                <DialogContent className="bg-white dark:bg-gray-900 max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-black dark:text-white">Manage Hospital</DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400">
                            {selectedHospital?.name} - {selectedHospital?.location?.city ?? 'Unknown'}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedHospital && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-black dark:text-white">Doctors</Label>
                                    <Input
                                        value={manageForm.doctors}
                                        onChange={(e) => setManageForm({ ...manageForm, doctors: e.target.value })}
                                        className="border-black dark:border-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black dark:text-white">Nurses</Label>
                                    <Input
                                        value={manageForm.nurses}
                                        onChange={(e) => setManageForm({ ...manageForm, nurses: e.target.value })}
                                        className="border-black dark:border-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black dark:text-white">Total Beds</Label>
                                    <Input
                                        value={manageForm.totalBeds}
                                        onChange={(e) => setManageForm({ ...manageForm, totalBeds: e.target.value })}
                                        className="border-black dark:border-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black dark:text-white">Occupied Beds</Label>
                                    <Input
                                        value={manageForm.occupiedBeds}
                                        onChange={(e) => setManageForm({ ...manageForm, occupiedBeds: e.target.value })}
                                        className="border-black dark:border-white"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <div className="flex w-full gap-2">
                            <Button variant="outline" onClick={() => setShowManageDialog(false)} className="border-black dark:border-white flex-1 text-black dark:text-white">
                                Cancel
                            </Button>
                            <Button onClick={handleSaveManage} className="bg-black dark:bg-white text-white dark:text-black flex-1">
                                Save changes
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
