'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminStore } from '@/lib/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, Building2, BarChart3, Settings } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-cyan-500' },
    { href: '/admin/hospitals', label: 'Hospitals', icon: Building2, color: 'from-green-500 to-emerald-500' },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3, color: 'from-purple-500 to-pink-500' },
    { href: '/admin/settings', label: 'Settings', icon: Settings, color: 'from-orange-500 to-red-500' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, logout } = useAdminStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isAuthenticated && pathname !== '/admin/login') {
            router.push('/admin/login');
        }
    }, [isAuthenticated, pathname, router]);

    if (!isAuthenticated) {
        return null;
    }

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            {/* Admin Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-black dark:bg-white border-r border-gray-800 dark:border-gray-200 z-50 flex flex-col">
                <div className="p-6 border-b border-gray-800 dark:border-gray-200">
                    <h1 className="text-2xl font-bold text-white dark:text-black">
                        Admin Panel
                    </h1>
                    <p className="text-sm text-gray-400 dark:text-gray-600 mt-1">
                        SwasthyaSense Control Center
                    </p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item, index) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link key={item.href} href={item.href}>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ x: 8 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        variant={isActive ? 'default' : 'ghost'}
                                        className={`w-full justify-start gap-3 h-12 transition-all duration-200 ${isActive
                                                ? 'bg-white dark:bg-black text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900'
                                                : 'text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-black hover:bg-gray-900 dark:hover:bg-gray-100'
                                            }`}
                                    >
                                        <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color} shadow-lg`}>
                                            <Icon className="h-4 w-4 text-white" />
                                        </div>
                                        <span className="font-medium">{item.label}</span>
                                    </Button>
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800 dark:border-gray-200">
                    <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full justify-start gap-3 text-red-400 hover:text-red-500 hover:bg-red-950/50 dark:hover:bg-red-50 transition-all duration-200"
                    >
                        <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 shadow-lg">
                            <LogOut className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium">Logout</span>
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 min-h-screen">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
