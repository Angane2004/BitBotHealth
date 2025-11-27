'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export default function SettingsPage() {
    const handleSave = () => {
        toast.success('Settings saved', {
            description: 'Your preferences have been updated successfully',
        });
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your account and application preferences
                </p>
            </div>

            {/* Profile Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" defaultValue="Hospital Admin" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue="admin@hospital.com" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="hospital">Hospital</Label>
                        <Input id="hospital" defaultValue="Apollo Hospital Delhi" />
                    </div>
                </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Configure how you receive alerts and updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive email alerts for high-priority predictions
                            </p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>SMS Alerts</Label>
                            <p className="text-sm text-muted-foreground">
                                Get SMS notifications for critical surge alerts
                            </p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Daily Summary</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive daily prediction summary reports
                            </p>
                        </div>
                        <Switch />
                    </div>
                </CardContent>
            </Card>

            {/* Prediction Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Prediction Settings</CardTitle>
                    <CardDescription>Configure AI prediction parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="forecast-days">Forecast Horizon (days)</Label>
                        <Input id="forecast-days" type="number" defaultValue="7" min="1" max="21" />
                        <p className="text-xs text-muted-foreground">
                            Number of days to forecast ahead (1-21 days)
                        </p>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Auto-generate Recommendations</Label>
                            <p className="text-sm text-muted-foreground">
                                Automatically create action items from predictions
                            </p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Include Weather Data</Label>
                            <p className="text-sm text-muted-foreground">
                                Factor weather conditions into predictions
                            </p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button onClick={handleSave} size="lg">
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
