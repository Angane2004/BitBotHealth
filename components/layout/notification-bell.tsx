'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLiveWeather } from '@/lib/hooks/weather';

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { snapshot, accent } = useLiveWeather({ city: 'Delhi' });

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative rounded-full border border-black/10 dark:border-white/15 p-2 hover:bg-black/5 dark:hover:bg-white/10 transition"
        style={{
          boxShadow: accent ? `0 0 18px ${accent.accentStops?.[0]}33` : undefined,
        }}
        aria-label="Live weather notifications"
      >
        <Bell className="h-5 w-5 text-black dark:text-white" />
        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-3 w-72 rounded-2xl border border-black/10 dark:border-white/10 bg-white/95 dark:bg-gray-900/95 shadow-2xl p-4 text-sm z-50"
          >
            <p className="text-xs uppercase tracking-[0.4em] text-gray-500 mb-2">Live Weather</p>
            {snapshot ? (
              <>
                <p className="text-base font-semibold text-black dark:text-white">{snapshot.city}</p>
                <p className="text-gray-600 dark:text-gray-300">{snapshot.alertMessage}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full px-3 py-1 bg-black/5 dark:bg-white/10 text-black dark:text-white">
                    {snapshot.temperature}°C
                  </span>
                  <span className="rounded-full px-3 py-1 bg-black/5 dark:bg-white/10 text-black dark:text-white">
                    AQI {snapshot.aqi ?? '—'}
                  </span>
                  <span className="rounded-full px-3 py-1 bg-black/5 dark:bg-white/10 text-black dark:text-white">
                    Humidity {snapshot.humidity}%
                  </span>
                </div>
              </>
            ) : (
              <p className="text-gray-500">Syncing weather feed…</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

