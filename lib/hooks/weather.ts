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

export function useLiveWeather({
  city = 'Delhi',
  lat,
  lon,
  refreshInterval = 1000 * 60 * 5, // 5 minutes
}: UseLiveWeatherOptions = {}) {
  const [snapshot, setSnapshot] = useState<LiveWeatherSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController>();
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
        aqiValue = pollutionJson?.list?.[0]?.main?.aqi
          ? Number(pollutionJson.list[0].main.aqi) * 50
          : undefined;
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

