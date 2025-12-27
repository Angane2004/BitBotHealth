'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon, User, Bell, Shield } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-black dark:text-white">
                    Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Manage system preferences and configurations
                </p>
            </div>

            <Card className="border-2 border-black dark:border-white">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                            <SettingsIcon className="h-5 w-5 text-white" />
                        </div>
                        <span>System Settings</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                        Admin panel configuration options.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
