'use client';

import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Menu } from 'lucide-react';
import { NotificationBell } from '@/components/layout/notification-bell';

interface HeaderProps {
    onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    return (
        <header className="sticky top-0 z-30 border-b border-white/40 dark:border-white/10 bg-white/70 dark:bg-black/40 backdrop-blur-2xl">
            <div className="flex h-20 items-center px-6 gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-full border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                    <Menu className="h-6 w-6 text-black dark:text-white" />
                </button>

                {/* Logo */}
                <div className="flex-1">
                    <Logo size="small" />
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-3">
                    <NotificationBell />
                    <div className="hidden md:flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] text-gray-500 dark:text-gray-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live
                    </div>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
