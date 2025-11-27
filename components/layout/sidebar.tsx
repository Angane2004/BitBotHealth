'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { UserButton } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import {
    LayoutDashboard,
    TrendingUp,
    Building2,
    ListChecks,
    FileText,
    Settings,
    Moon,
    Sun,
    Activity,
    Bell,
} from 'lucide-react';

const navigation = [
    {
        name: 'Dashboard',
        href: '/',
        icon: LayoutDashboard,
    },
    {
        name: 'Predictions',
        href: '/predictions',
        icon: TrendingUp,
    },
    {
        name: 'Hospitals',
        href: '/hospitals',
        icon: Building2,
    },
    {
        name: 'Actions',
        href: '/actions',
        icon: ListChecks,
    },
    {
        name: 'Reports',
        href: '/reports',
        icon: FileText,
    },
    {
        name: 'Settings',
        href: '/settings',
        icon: Settings,
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex h-full w-64 flex-col border-r bg-card">
            {/* Logo */}
            <div className="flex h-16 items-center border-b px-6">
                <Activity className="h-6 w-6 text-primary mr-2" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    SwasthyaSense
                </span>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 px-3 py-4">
                <div className="space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.name} href={item.href}>
                                <Button
                                    variant={isActive ? 'secondary' : 'ghost'}
                                    className={cn(
                                        'w-full justify-start',
                                        isActive && 'bg-secondary font-medium'
                                    )}
                                >
                                    <item.icon className="mr-3 h-5 w-5" />
                                    {item.name}
                                </Button>
                            </Link>
                        );
                    })}
                </div>
            </ScrollArea>

            <Separator />

            {/* User Profile & Theme Toggle */}
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Theme</span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    >
                        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                    <UserButton
                        appearance={{
                            elements: {
                                avatarBox: "h-10 w-10"
                            }
                        }}
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">Hospital Admin</p>
                        <p className="text-xs text-muted-foreground truncate">admin@hospital.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
