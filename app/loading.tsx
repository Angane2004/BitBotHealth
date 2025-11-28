'use client';

import { Logo } from '@/components/logo';
import { useLiveWeather } from '@/lib/hooks/weather';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

export default function LoadingPage() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'boot' | 'sync' | 'ready'>('boot');
  const { snapshot, accent } = useLiveWeather({ city: 'Delhi', refreshInterval: 0 });
  const smoothProgress = useSpring(progress, {
    stiffness: 140,
    damping: 30,
    mass: 0.4,
  });
  const progressPercentage = useTransform(smoothProgress, latest => `${latest}%`);

  useEffect(() => {
    let raf: number;
    let start: number | null = null;

    const animate = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const easing = Math.min(1, elapsed / 1800);
      const easedValue = Math.round(easing * 100);
      setProgress(easedValue);
      if (easedValue >= 100) {
        setPhase('ready');
        cancelAnimationFrame(raf);
        return;
      }
      if (easedValue > 75) setPhase('sync');
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const weatherCopy = useMemo(() => {
    if (!snapshot) return 'Connecting to live weather grid...';
    return `${snapshot.city}: ${snapshot.temperature}°C • AQI ${snapshot.aqi ?? '—'} • ${snapshot.alertMessage}`;
  }, [snapshot]);

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-[0.35]">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-rose-50 to-emerald-50 dark:from-black dark:via-slate-900 dark:to-black" />
          <div
            className="absolute inset-0"
            style={{ backgroundImage: 'url(/ambient-mask.svg)', backgroundSize: 'cover', mixBlendMode: 'screen', opacity: 0.45 }}
          />
        </div>
        <div className="absolute inset-0">
          <motion.div
            className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-fuchsia-400/20 blur-[120px]"
            animate={{ x: ['0%', '10%', '-5%', '0%'], opacity: [0.4, 0.7, 0.5, 0.4] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-0 right-10 h-64 w-64 rounded-full bg-cyan-400/30 blur-[100px]"
            animate={{ y: ['0%', '-15%', '5%', '0%'], opacity: [0.5, 0.8, 0.6, 0.5] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-2xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="glass-panel rounded-[32px] p-10 border border-black/5 dark:border-white/10 shadow-2xl"
        >
          <div className="flex flex-col items-center gap-6 text-center">
            <Logo size="large" />
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.6em] text-gray-500">
                {phase === 'boot' ? 'Booting systems' : phase === 'sync' ? 'Syncing live signals' : 'Ready'}
              </p>
              <h1 className="text-4xl md:text-5xl font-semibold text-black dark:text-white">Calibrating SwasthyaSense</h1>
              <p className="text-base text-gray-600 dark:text-gray-300">{weatherCopy}</p>
            </div>

            <div className="w-full space-y-2">
              <div className="h-3 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-amber-400 to-cyan-400"
                  style={{ width: progressPercentage }}
                />
              </div>
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-gray-500">
                <span>systems</span>
                <span>{progress}%</span>
              </div>
            </div>

            <motion.div
              className="w-full p-4 rounded-2xl border border-black/10 dark:border-white/10 flex items-center justify-between text-sm"
              style={{
                background: accent
                  ? `linear-gradient(120deg, ${accent.accentStops?.join(', ')})`
                  : 'rgba(255,255,255,0.15)',
              }}
            >
              <div className="text-left">
                <p className="text-xs uppercase tracking-[0.4em] text-gray-500">Live telemetry</p>
                <p className="text-black dark:text-white font-medium">{snapshot ? snapshot.alertMessage : 'Awaiting signal...'}</p>
              </div>
              {snapshot && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`https://openweathermap.org/img/wn/${snapshot.icon}@2x.png`} alt="Weather" className="h-12 w-12" />
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
