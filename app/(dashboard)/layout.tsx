'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const openSidebar = () => {
        setSidebarOpen(true);
    };

    return (
        <div className="min-h-screen bg-transparent relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 opacity-60">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/50 to-white/70 dark:from-black/70 dark:via-black/60 dark:to-black/70" />
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'url(/ambient-mask.svg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        mixBlendMode: 'soft-light',
                        opacity: 0.5,
                    }} />
                </div>
                <div className="absolute top-10 right-20 h-48 w-48 rounded-full border border-black/10 dark:border-white/10" style={{ animation: 'orbital-glow 20s linear infinite' }} />
                <div className="absolute bottom-16 left-20 h-32 w-32 rounded-full border border-black/10 dark:border-white/10" style={{ animation: 'orbital-glow 16s linear infinite reverse' }} />
            </div>

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-40 transition-transform duration-500 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                <Sidebar collapsed={sidebarCollapsed} onToggle={setSidebarCollapsed} />
            </div>

            {/* Main Content */}
            <div className={`transition-all duration-300 relative z-10 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
                {/* Header */}
                <Header onMenuClick={openSidebar} />

                {/* Page Content */}
                <main className="p-6 relative z-10">
                    {children}
                </main>
            </div>

            {/* Mobile Sidebar Backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
