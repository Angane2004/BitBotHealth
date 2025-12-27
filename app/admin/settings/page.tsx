'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings as SettingsIcon, Save, Bell, Shield, Database, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        siteName: 'SwasthyaSense Admin',
        adminEmail: 'admin@swasthyasense.com',
        notificationsEnabled: true,
        autoBackup: true,
        twoFactorAuth: false,
        apiKey: 'sk_live_••••••••••••1234',
        maxHospitals: '100',
        sessionTimeout: '60',
    });

    const handleSave = () => {
        toast.success('Settings Saved', {
            description: 'Your configuration has been updated successfully.',
        });
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-black dark:text-white">
                    Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Manage system configuration and preferences
                </p>
            </div>

            {/* General Settings */}
            <Card className="border-2 border-black dark:border-white bg-white dark:bg-black">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                            <SettingsIcon className="h-5 w-5 text-white" />
                        </div>
                        <span>General Settings</span>
                    </CardTitle>
                    <CardDescription>Basic system configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="siteName" className="text-black dark:text-white">Site Name</Label>
                            <Input
                                id="siteName"
                                value={settings.siteName}
                                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                className="border-2 border-black dark:border-white bg-white dark:bg-black"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="adminEmail" className="text-black dark:text-white">Admin Email</Label>
                            <Input
                                id="adminEmail"
                                type="email"
                                value={settings.adminEmail}
                                onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                                className="border-2 border-black dark:border-white bg-white dark:bg-black"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="border-2 border-black dark:border-white bg-white dark:bg-black">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-pink-500">
                            <Shield className="h-5 w-5 text-white" />
                        </div>
                        <span>Security</span>
                    </CardTitle>
                    <CardDescription>Authentication and access control</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label className="text-black dark:text-white">Two-Factor Authentication</Label>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security</p>
                        </div>
                        <Switch
                            checked={settings.twoFactorAuth}
                            onCheckedChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="sessionTimeout" className="text-black dark:text-white">Session Timeout (minutes)</Label>
                        <Input
                            id="sessionTimeout"
                            type="number"
                            value={settings.sessionTimeout}
                            onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                            className="border-2 border-black dark:border-white bg-white dark:bg-black"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="apiKey" className="text-black dark:text-white">API Key</Label>
                        <Input
                            id="apiKey"
                            value={settings.apiKey}
                            readOnly
                            className="border-2 border-black dark:border-white bg-gray-100 dark:bg-gray-900"
                        />
                        <Button variant="outline" className="border-2 border-black dark:border-white">
                            Regenerate Key
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="border-2 border-black dark:border-white bg-white dark:bg-black">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500">
                            <Bell className="h-5 w-5 text-white" />
                        </div>
                        <span>Notifications</span>
                    </CardTitle>
                    <CardDescription>Manage alert preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label className="text-black dark:text-white">Enable Notifications</Label>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Receive system alerts and updates</p>
                        </div>
                        <Switch
                            checked={settings.notificationsEnabled}
                            onCheckedChange={(checked) => setSettings({ ...settings, notificationsEnabled: checked })}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Database Settings */}
            <Card className="border-2 border-black dark:border-white bg-white dark:bg-black">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                            <Database className="h-5 w-5 text-white" />
                        </div>
                        <span>Database</span>
                    </CardTitle>
                    <CardDescription>Data management and backup</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label className="text-black dark:text-white">Auto Backup</Label>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Daily automatic backups</p>
                        </div>
                        <Switch
                            checked={settings.autoBackup}
                            onCheckedChange={(checked) => setSettings({ ...settings, autoBackup: checked })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="maxHospitals" className="text-black dark:text-white">Max Hospitals</Label>
                        <Input
                            id="maxHospitals"
                            type="number"
                            value={settings.maxHospitals}
                            onChange={(e) => setSettings({ ...settings, maxHospitals: e.target.value })}
                            className="border-2 border-black dark:border-white bg-white dark:bg-black"
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="border-2 border-black dark:border-white">
                            Backup Now
                        </Button>
                        <Button variant="outline" className="border-2 border-black dark:border-white">
                            Restore from Backup
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button
                    onClick={handleSave}
                    className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 gap-2"
                >
                    <Save className="h-4 w-4" />
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
