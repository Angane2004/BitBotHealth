'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface LiveWeatherSnapshot {
  city: string;
  temperature: number;
  humidity: number;
  description: string;
  wind: number;
  icon: string;
  aqi?: number;
  alertLevel: 'normal' | 'warning' | 'critical';
  alertMessage: string;
  lastUpdated: number;
  sunrise?: number;
  sunset?: number;
}

interface UseLiveWeatherOptions {
  city?: string;
  lat?: number;
  lon?: number;
  refreshInterval?: number;
}

const WEATHER_ENDPOINT = 'https://api.openweathermap.org/data/2.5';

/**
 * Calculate AQI from PM2.5 concentration using US EPA breakpoints
 * PM2.5 in μg/m³ -> AQI (0-500 scale)
 */
function calculateAQIFromPM25(pm25: number): number {
  // US EPA AQI breakpoints for PM2.5
  const breakpoints = [
    { cLow: 0.0, cHigh: 12.0, iLow: 0, iHigh: 50 },      // Good
    { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },   // Moderate
    { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },  // Unhealthy for Sensitive Groups
    { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 }, // Unhealthy
    { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },// Very Unhealthy
    { cLow: 250.5, cHigh: 500.4, iLow: 301, iHigh: 500 } // Hazardous
  ];

  // Find the appropriate breakpoint
  for (const bp of breakpoints) {
    if (pm25 >= bp.cLow && pm25 <= bp.cHigh) {
      // Linear interpolation formula: I = ((IHi - ILo) / (CHi - CLo)) * (C - CLo) + ILo
      const aqi = Math.round(
        ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (pm25 - bp.cLow) + bp.iLow
      );
      return aqi;
    }
  }

  // If PM2.5 exceeds all breakpoints, return maximum AQI
  return pm25 > 500.4 ? 500 : 0;
}

export function useLiveWeather({
  city = 'Delhi',
  lat,
  lon,
  refreshInterval = 1000 * 60 * 5, // 5 minutes
}: UseLiveWeatherOptions = {}) {
  const [snapshot, setSnapshot] = useState<LiveWeatherSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | undefined>(undefined);
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  const fetchWeather = useCallback(async () => {
    // Log API key status for debugging
    console.log('OpenWeather API Key available:', !!apiKey);

    if (!apiKey) {
      setError('OpenWeather API key not configured. Please add NEXT_PUBLIC_OPENWEATHER_API_KEY to .env.local');
      setLoading(false);

      // Use mock data as absolute fallback
      const { cityWeatherData } = await import('@/lib/mock-data');
      const mockData = cityWeatherData[city] || cityWeatherData['Delhi'];

      const snapshotPayload: LiveWeatherSnapshot = {
        city: city,
        temperature: mockData.temperature,
        humidity: mockData.humidity,
        description: mockData.conditions,
        wind: 5,
        icon: '01d',
        aqi: mockData.aqi,
        alertLevel: mockData.aqi > 200 ? 'critical' : mockData.aqi > 120 ? 'warning' : 'normal',
        alertMessage:
          mockData.aqi > 200
            ? 'Air quality is hazardous. Trigger respiratory surge plan.'
            : mockData.aqi > 120
              ? 'Air quality deteriorating — prep advisory.'
              : 'Conditions stable. Continue monitoring.',
        lastUpdated: Date.now(),
      };

      setSnapshot(snapshotPayload);
      return;
    }

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      setLoading(true);
      setError(null);
      const query = lat && lon ? `lat=${lat}&lon=${lon}` : `q=${encodeURIComponent(city)}`;

      const weatherResponse = await fetch(
        `${WEATHER_ENDPOINT}/weather?${query}&units=metric&appid=${apiKey}`,
        { signal: controller.signal }
      );
      const weatherJson = await weatherResponse.json();

      if (weatherJson.cod && weatherJson.cod !== 200) {
        throw new Error(weatherJson.message || 'Unable to fetch weather');
      }

      const resolvedLat = weatherJson.coord?.lat;
      const resolvedLon = weatherJson.coord?.lon;

      let aqiValue: number | undefined;
      if (resolvedLat && resolvedLon) {
        const pollutionResponse = await fetch(
          `${WEATHER_ENDPOINT}/air_pollution?lat=${resolvedLat}&lon=${resolvedLon}&appid=${apiKey}`,
          { signal: controller.signal }
        );
        const pollutionJson = await pollutionResponse.json();

        // Get PM2.5 concentration (μg/m³) and convert to AQI
        const pm25 = pollutionJson?.list?.[0]?.components?.pm2_5;
        if (pm25 !== undefined) {
          // Convert PM2.5 to AQI using US EPA breakpoints
          aqiValue = calculateAQIFromPM25(pm25);
        }
      }

      const mainDescription = weatherJson.weather?.[0]?.description ?? 'Clear';
      const alertLevel =
        aqiValue && aqiValue > 200
          ? 'critical'
          : aqiValue && aqiValue > 120
            ? 'warning'
            : 'normal';

      const snapshotPayload: LiveWeatherSnapshot = {
        city: weatherJson.name ?? city,
        temperature: Math.round(weatherJson.main?.temp ?? 0),
        humidity: Number(weatherJson.main?.humidity ?? 0),
        description: mainDescription,
        wind: Number(weatherJson.wind?.speed ?? 0),
        icon: weatherJson.weather?.[0]?.icon ?? '01d',
        aqi: aqiValue,
        alertLevel,
        alertMessage:
          alertLevel === 'critical'
            ? 'Air quality is hazardous. Trigger respiratory surge plan.'
            : alertLevel === 'warning'
              ? 'Air quality deteriorating — prep advisory.'
              : 'Conditions stable. Continue monitoring.',
        lastUpdated: Date.now(),
        sunrise: weatherJson.sys?.sunrise,
        sunset: weatherJson.sys?.sunset,
      };

      setSnapshot(snapshotPayload);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError((err as Error).message || 'Unable to fetch weather');
      }
    } finally {
      setLoading(false);
    }
  }, [apiKey, city, lat, lon]);

  useEffect(() => {
    fetchWeather();
    if (!refreshInterval) return;
    const interval = setInterval(fetchWeather, refreshInterval);
    return () => {
      clearInterval(interval);
      controllerRef.current?.abort();
    };
  }, [fetchWeather, refreshInterval]);

  const enrichments = useMemo(() => {
    if (!snapshot) return null;
    const accentStops =
      snapshot.alertLevel === 'critical'
        ? ['#ef4444', '#f97316', '#facc15']
        : snapshot.alertLevel === 'warning'
          ? ['#fbbf24', '#fde047', '#a3e635']
          : ['#34d399', '#22d3ee', '#0ea5e9'];

    return {
      accentStops,
      iconUrl: `https://openweathermap.org/img/wn/${snapshot.icon}@2x.png`,
    };
  }, [snapshot]);

  return {
    snapshot,
    loading,
    error,
    accent: enrichments,
    refresh: fetchWeather,
  };
}

