'use client';

import { Logo } from '@/components/logo';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

export default function LoadingPage() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'boot' | 'sync' | 'ready'>('boot');
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

  return (
    <div className="fixed inset-0 bg-white dark:bg-black flex items-center justify-center z-50 overflow-hidden">
      {/* Minimal animated background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-20 h-64 w-64 rounded-full bg-black/5 dark:bg-white/5 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-black/5 dark:bg-white/5 blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="rounded-[32px] p-10 border-2 border-black dark:border-white bg-white dark:bg-black shadow-2xl"
        >
          <div className="flex flex-col items-center gap-6 text-center">
            <Logo size="large" />
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.6em] text-gray-500 dark:text-gray-400">
                {phase === 'boot' ? 'Booting systems' : phase === 'sync' ? 'Syncing live signals' : 'Ready'}
              </p>
              <h1 className="text-4xl md:text-5xl font-semibold text-black dark:text-white">Calibrating SwasthyaSense</h1>
              <p className="text-base text-gray-600 dark:text-gray-400">Preparing your healthcare intelligence dashboard...</p>
            </div>

            <div className="w-full space-y-3">
              <div className="h-8 rounded-full bg-white dark:bg-black overflow-hidden border-4 border-black dark:border-white shadow-2xl">
                <motion.div
                  className="h-full bg-black dark:bg-white"
                  style={{ width: progressPercentage }}
                  initial={{ width: '0%' }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <div className="flex items-center justify-between text-sm font-bold uppercase tracking-[0.3em] text-black dark:text-white">
                <span>LOADING SYSTEMS</span>
                <span className="text-xl">{progress}%</span>
              </div>
            </div>

            <motion.div
              className="w-full p-4 rounded-2xl border-2 border-black dark:border-white flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-900"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="text-left">
                <p className="text-xs uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400">Live Status</p>
                <p className="text-black dark:text-white font-medium">All systems operational</p>
              </div>
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                <Activity className="h-5 w-5 text-white" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
