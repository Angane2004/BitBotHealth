'use client';

import { useState } from 'react';
import { MapPin, Navigation, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { useLocationStore, CITIES } from '@/lib/hooks/useLocation';
import { toast } from 'sonner';

export function LocationSelector() {
    const { location, getCurrentLocation, setCustomLocation } = useLocationStore();
    const [loading, setLoading] = useState(false);

    const handleCurrentLocation = async () => {
        setLoading(true);
        try {
            await getCurrentLocation();
            toast.success('Location detected', {
                description: `Using your current location`,
            });
        } catch (error) {
            toast.error('Location access denied', {
                description: 'Using default location (Delhi)',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCustomLocation = (city: string) => {
        setCustomLocation(city);
        toast.success('Location updated', {
            description: `Now showing data for ${city}`,
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="gap-2 rounded-full border-black/10 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10"
                >
                    <MapPin className="h-4 w-4" />
                    <span className="hidden sm:inline">
                        {location?.city || 'Select Location'}
                    </span>
                    <ChevronDown className="h-3 w-3" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-900 border-2">
                <DropdownMenuLabel>Location Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={handleCurrentLocation}
                    disabled={loading}
                    className="gap-2 cursor-pointer"
                >
                    <Navigation className="h-4 w-4" />
                    <span>{loading ? 'Detecting...' : 'Current Location'}</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>Use Another Location</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="max-h-[300px] overflow-y-auto bg-white dark:bg-gray-900 border-2">
                        {CITIES.map((city) => (
                            <DropdownMenuItem
                                key={city}
                                onClick={() => handleCustomLocation(city)}
                                className="cursor-pointer"
                            >
                                {city}
                                {location?.city === city && (
                                    <span className="ml-auto text-xs text-emerald-600">✓</span>
                                )}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
