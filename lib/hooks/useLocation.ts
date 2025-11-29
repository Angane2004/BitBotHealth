'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LocationState {
    type: 'current' | 'custom';
    city: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
    lastUpdated: Date;
}

interface LocationStore {
    location: LocationState | null;
    setLocation: (location: LocationState) => void;
    getCurrentLocation: () => Promise<void>;
    setCustomLocation: (city: string) => void;
}

const INDIAN_CITIES = {
    'Delhi': { lat: 28.7041, lng: 77.1025 },
    'Mumbai': { lat: 19.0760, lng: 72.8777 },
    'Bangalore': { lat: 12.9716, lng: 77.5946 },
    'Hyderabad': { lat: 17.3850, lng: 78.4867 },
    'Chennai': { lat: 13.0827, lng: 80.2707 },
    'Kolkata': { lat: 22.5726, lng: 88.3639 },
    'Pune': { lat: 18.5204, lng: 73.8567 },
    'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
    'Jaipur': { lat: 26.9124, lng: 75.7873 },
    'Lucknow': { lat: 26.8467, lng: 80.9462 },
};

export const useLocationStore = create<LocationStore>()(
    persist(
        (set) => ({
            location: null,

            setLocation: (location) => set({ location }),

            getCurrentLocation: async () => {
                if (!navigator.geolocation) {
                    console.error('Geolocation is not supported');
                    // Fallback to Delhi
                    set({
                        location: {
                            type: 'custom',
                            city: 'Delhi',
                            coordinates: INDIAN_CITIES['Delhi'],
                            lastUpdated: new Date(),
                        },
                    });
                    return;
                }

                try {
                    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject);
                    });

                    const { latitude, longitude } = position.coords;

                    // Find closest Indian city (simple distance calculation)
                    let closestCity = 'Delhi';
                    let minDistance = Infinity;

                    Object.entries(INDIAN_CITIES).forEach(([city, coords]) => {
                        const distance = Math.sqrt(
                            Math.pow(coords.lat - latitude, 2) + Math.pow(coords.lng - longitude, 2)
                        );
                        if (distance < minDistance) {
                            minDistance = distance;
                            closestCity = city;
                        }
                    });

                    set({
                        location: {
                            type: 'current',
                            city: closestCity,
                            coordinates: { lat: latitude, lng: longitude },
                            lastUpdated: new Date(),
                        },
                    });
                } catch (error) {
                    console.error('Error getting location:', error);
                    // Fallback to Delhi
                    set({
                        location: {
                            type: 'custom',
                            city: 'Delhi',
                            coordinates: INDIAN_CITIES['Delhi'],
                            lastUpdated: new Date(),
                        },
                    });
                }
            },

            setCustomLocation: (city) => {
                const coordinates = INDIAN_CITIES[city as keyof typeof INDIAN_CITIES];
                set({
                    location: {
                        type: 'custom',
                        city,
                        coordinates,
                        lastUpdated: new Date(),
                    },
                });
            },
        }),
        {
            name: 'location-storage',
        }
    )
);

export const CITIES = Object.keys(INDIAN_CITIES);
