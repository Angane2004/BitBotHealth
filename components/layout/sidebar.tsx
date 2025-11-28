'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserButton, useUser } from '@clerk/nextjs';
import { useUserSettings } from '@/lib/firebase/hooks';
import {
    LayoutDashboard,
    TrendingUp,
    Building2,
    ListChecks,
    FileText,
    Settings,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Predictions', href: '/predictions', icon: TrendingUp },
    { name: 'Hospitals', href: '/hospitals', icon: Building2 },
    { name: 'Actions', href: '/actions', icon: ListChecks },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
    collapsed: boolean;
    onToggle: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
    const pathname = usePathname();
    const { user } = useUser();
    const { settings } = useUserSettings(user?.id);
    const handleToggle = () => onToggle(!collapsed);
    const displayName = settings?.fullName || user?.fullName?.toString() || 'Team Member';
    const displayHospital = settings?.hospital || 'Set hospital in Settings';

    return (
        <aside
            className={cn(
                'fixed left-0 top-0 z-40 h-screen border-r border-white/40 dark:border-white/10 bg-white/75 dark:bg-black/40 backdrop-blur-2xl shadow-[0_25px_45px_rgba(0,0,0,0.12)] transition-[width,transform] duration-500',
                collapsed ? 'w-20' : 'w-64'
            )}
        >
            <div className="flex flex-col h-full relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-60">
                    <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white/40 dark:from-white/5 to-transparent" />
                </div>
                {/* Logo */}
                <div className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5 relative z-10">
                    {!collapsed && <Logo size="small" />}
                    {collapsed && (
                        <div className="mx-auto">
                            <Logo size="small" showWordmark={false} />
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-2 relative z-10">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300 group',
                                    isActive
                                        ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg shadow-black/20 dark:shadow-white/10'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5'
                                )}
                            >
                                <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive ? 'text-white dark:text-black' : '')} />
                                {!collapsed && (
                                    <span className="font-medium">{item.name}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="border-t border-black/5 dark:border-white/5 p-4 space-y-3 relative z-10">
                    {!collapsed && (
                        <div className="flex items-center gap-3 px-3">
                            <UserButton afterSignOutUrl="/" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-black dark:text-white truncate">{displayName}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{displayHospital}</p>
                            </div>
                        </div>
                    )}
                    {collapsed && (
                        <div className="flex justify-center">
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    )}
                    <div className="flex items-center justify-between px-3 gap-2">
                        {!collapsed && <ThemeToggle />}
                        {!collapsed && (
                            <Link href="/settings" className="text-xs text-gray-600 dark:text-gray-300 underline">
                                Settings
                            </Link>
                        )}
                        <button
                            onClick={handleToggle}
                            className="p-2 rounded-full border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10 transition-colors ml-auto"
                            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            {collapsed ? (
                                <ChevronRight className="h-4 w-4 text-black dark:text-white" />
                            ) : (
                                <ChevronLeft className="h-4 w-4 text-black dark:text-white" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
