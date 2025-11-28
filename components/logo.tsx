'use client';

import { useState } from 'react';

type LogoSize = 'small' | 'default' | 'large';

const sizeLookup: Record<LogoSize, string> = {
  small: 'h-10 w-10',
  default: 'h-12 w-12',
  large: 'h-14 w-14',
};

export function Logo({
  className = '',
  size = 'default',
  showWordmark = true,
}: {
  className?: string;
  size?: LogoSize;
  showWordmark?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      aria-label="SwasthyaSense"
      className={`group flex items-center gap-3 rounded-full transition-transform duration-500 ${hovered ? 'scale-105' : 'scale-100'} ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`relative flex items-center justify-center rounded-2xl border border-black/30 dark:border-white/15 bg-gradient-to-br from-[#05070a] via-[#0d111b] to-[#1b2333] shadow-[0_18px_35px_rgba(5,7,10,0.45)] ${sizeLookup[size]}`}
      >
        <span
          className="absolute inset-1 rounded-[18px] bg-gradient-to-br from-[#0f1219] via-[#111827] to-[#1f2a40]"
          aria-hidden
        />
        <span
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-300/12 via-cyan-300/12 to-slate-100/10 opacity-70 blur-xl"
          aria-hidden
        />
        <span
          className="relative z-10 h-full w-full flex items-center justify-center"
          aria-hidden
        >
          <span className="relative flex h-[60%] w-[60%] items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-white/15 animate-[orbital-glow_12s_linear_infinite]" />
            <span className="absolute inset-2 rounded-full border border-white/10 opacity-70" />
            <span className="relative h-2 w-8 rounded-full bg-gradient-to-r from-slate-50 to-slate-200/90 shadow-lg" />
            <span className="absolute h-8 w-2 rounded-full bg-gradient-to-b from-slate-50 to-slate-200/90 shadow-lg" />
            <span
              className={`absolute inset-1 rounded-full bg-gradient-to-br from-white/70 via-transparent to-transparent opacity-60 transition-opacity duration-700 ${hovered ? 'opacity-90' : 'opacity-45'}`}
            />
          </span>
        </span>
        <span
          className="absolute -bottom-3 h-6 w-[70%] rounded-full bg-black/10 dark:bg-white/10 blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500"
          aria-hidden
        />
      </div>
      {showWordmark && (
        <span className="flex flex-col leading-tight text-left">
          <span className="text-xs uppercase tracking-[0.45em] text-zinc-500">
            Swasthya
          </span>
          <span className="text-2xl font-semibold text-black dark:text-white tracking-tight">
            Sense
            <span className="ml-2 h-2 w-2 inline-flex rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 align-middle" />
          </span>
        </span>
      )}
    </button>
  );
}
