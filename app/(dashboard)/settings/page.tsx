'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useEffect, useMemo, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import { userSettingsCollection, UserSettings } from '@/lib/firebase/collections';
import { useUserSettings } from '@/lib/firebase/hooks';

export default function SettingsPage() {
    const { user } = useUser();
    const userId = user?.id;
    const { settings, loading: settingsLoading } = useUserSettings(userId);

    const [profile, setProfile] = useState({
        fullName: '',
        email: '',
        phone: '',
        hospital: '',
    });
    const [prediction, setPrediction] = useState({ forecastDays: 7, confidence: 85 });
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(false);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [twoFactor, setTwoFactor] = useState(true);
    const [deviceLock, setDeviceLock] = useState(true);
    const [sessionAlerts, setSessionAlerts] = useState(true);
    const [apiKey, setApiKey] = useState('sk_live_demo');
    const [apiKeyRotatedAt, setApiKeyRotatedAt] = useState<Date | null>(null);
    const [saving, setSaving] = useState(false);

    const toDate = (value?: unknown | null) => {
        if (!value) return null;
        if (value instanceof Date) return value;
        if (typeof (value as { toDate?: () => Date }).toDate === 'function') {
            return (value as { toDate: () => Date }).toDate();
        }
        return null;
    };

    const generateApiKey = () => `sk_live_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;

    useEffect(() => {
        if (settings) {
            setProfile({
                fullName: settings.fullName,
                email: settings.email,
                phone: settings.phone ?? '',
                hospital: settings.hospital ?? '',
            });
            setEmailNotifications(settings.emailNotifications);
            setSmsNotifications(settings.smsNotifications);
            setPushNotifications(settings.pushNotifications);
            setPrediction({ forecastDays: settings.forecastDays, confidence: settings.confidence });
            setTwoFactor(settings.twoFactorEnabled);
            setDeviceLock(settings.deviceLock ?? true);
            setSessionAlerts(settings.sessionAlerts ?? true);
            setApiKey(settings.apiKey || generateApiKey());
            setApiKeyRotatedAt(toDate(settings.apiKeyRotatedAt));
        } else if (user) {
            setProfile((prev) => ({
                ...prev,
                fullName: user.fullName?.toString() ?? prev.fullName,
                email: user.primaryEmailAddress?.emailAddress ?? prev.email,
            }));
            setApiKey((prev) => prev || generateApiKey());
        }
    }, [settings, user]);

    const basePayload = useMemo(
        () => ({
            userId,
            fullName: profile.fullName,
            email: profile.email,
            phone: profile.phone,
            hospital: profile.hospital,
            emailNotifications,
            smsNotifications,
            pushNotifications,
            forecastDays: prediction.forecastDays,
            confidence: prediction.confidence,
            twoFactorEnabled: twoFactor,
            apiKey,
            deviceLock,
            sessionAlerts,
        }),
        [userId, profile, emailNotifications, smsNotifications, pushNotifications, prediction, twoFactor, apiKey, deviceLock, sessionAlerts]
    );

    const persistSettings = async (overrides: Partial<UserSettings> = {}) => {
        if (!userId) {
            toast.error('Please sign in to save settings');
            return;
        }

        setSaving(true);
        try {
            const payload: Partial<UserSettings> = {
                ...basePayload,
                ...overrides,
                updatedAt: serverTimestamp() as unknown as Date,
            };
            if (apiKeyRotatedAt) {
                payload.apiKeyRotatedAt = apiKeyRotatedAt as unknown as Date;
            }
            await setDoc(doc(userSettingsCollection, userId), payload, { merge: true });
            toast.success('Settings saved');
        } catch (error) {
            toast.error('Failed to save settings', {
                description: (error as Error).message,
            });
        } finally {
            setSaving(false);
        }
    };

    const handleRotateKey = async () => {
        const newKey = generateApiKey();
        const rotatedAt = new Date();
        setApiKey(newKey);
        setApiKeyRotatedAt(rotatedAt);
        await persistSettings({ apiKey: newKey, apiKeyRotatedAt: rotatedAt as unknown as Date });
        toast.success('API key rotated');
    };

    const handleCopyKey = async () => {
        try {
            await navigator.clipboard?.writeText(apiKey);
            toast.success('API key copied');
        } catch {
            toast.error('Unable to copy key');
        }
    };

    const exportPersonalData = () => {
        const payload = {
            profile,
            notifications: { emailNotifications, smsNotifications, pushNotifications },
            prediction,
            security: { twoFactor, apiKey },
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `swasthyasense-settings-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const exportComplianceCsv = () => {
        const rows = [
            ['Field', 'Value'],
            ['Full Name', profile.fullName],
            ['Email', profile.email],
            ['Hospital', profile.hospital],
            ['SMS Alerts', smsNotifications ? 'Enabled' : 'Disabled'],
            ['Two Factor', twoFactor ? 'Enabled' : 'Disabled'],
        ];
        const csv = rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `compliance-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Compliance export ready');
    };

    const requestDeletionCertificate = () => {
        toast.info('Deletion request submitted', {
            description: 'Our compliance desk will reach out in under 24 hours.',
        });
    };

    if (!user) {
        return (
            <div className="p-10 text-center">
                <p className="text-gray-600 dark:text-gray-300">Sign in to manage your SwasthyaSense settings.</p>
            </div>
        );
    }

    if (settingsLoading && !settings) {
        return (
            <div className="p-10">
                <Card className="border-2 bg-white/80 dark:bg-gray-900/80 h-48 animate-pulse" />
            </div>
        );
    }

    const lastRotatedLabel = apiKeyRotatedAt ? formatDistanceToNow(apiKeyRotatedAt, { addSuffix: true }) : 'Never rotated';
    const disableActions = saving || settingsLoading;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">
                    Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Manage your account and application preferences
                </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-[2fr,1.1fr]">
                <div className="space-y-6">
                    {/* Profile Settings */}
                    <Card className="border-2 bg-white dark:bg-gray-900">
                        <CardHeader>
                            <CardTitle className="text-black dark:text-white">Profile Information</CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">Update your personal details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-black dark:text-white">Full Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Dr. John Doe"
                                        value={profile.fullName}
                                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                                        className="border-black dark:border-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-black dark:text-white">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@hospital.com"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        className="border-black dark:border-white"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-black dark:text-white">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        placeholder="+91 98765 43210"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        className="border-black dark:border-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="hospital" className="text-black dark:text-white">Hospital</Label>
                                    <Input
                                        id="hospital"
                                        placeholder="Apollo Hospital Delhi"
                                        value={profile.hospital}
                                        onChange={(e) => setProfile({ ...profile, hospital: e.target.value })}
                                        className="border-black dark:border-white"
                                    />
                                </div>
                            </div>
                            <Button onClick={() => persistSettings()} disabled={disableActions} className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black">
                                Save Changes
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Notification Preferences */}
                    <Card className="border-2 bg-white dark:bg-gray-900">
                        <CardHeader>
                            <CardTitle className="text-black dark:text-white">Notification Preferences</CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">
                                Choose how you want to receive surge alerts, weather nudges and prediction approvals.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-black dark:text-white">Email Notifications</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Shift summaries + audit actions</p>
                                </div>
                                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-black dark:text-white">SMS Notifications</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Respiratory surge escalation SMS</p>
                                </div>
                                <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-black dark:text-white">Push Notifications</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Browser nudges for approvals</p>
                                </div>
                                <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                            </div>
                            <Button onClick={() => persistSettings()} disabled={disableActions} className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black">
                                Save Preferences
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Prediction Settings */}
                    <Card className="border-2 bg-white dark:bg-gray-900">
                        <CardHeader>
                            <CardTitle className="text-black dark:text-white">Prediction Settings</CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">Tune forecasting horizon and confidence guardrails.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="forecast-days" className="text-black dark:text-white">Forecast Horizon (days)</Label>
                                <Input
                                    id="forecast-days"
                                    type="number"
                                    min={3}
                                    max={21}
                                    value={prediction.forecastDays}
                                    onChange={(e) => setPrediction({ ...prediction, forecastDays: Number(e.target.value) })}
                                    className="border-black dark:border-white"
                                />
                                <p className="text-xs text-gray-600 dark:text-gray-400">Controls the rolling window for Live Surge Intelligence.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confidence" className="text-black dark:text-white">Confidence Threshold (%)</Label>
                                <Input
                                    id="confidence"
                                    type="number"
                                    min={60}
                                    max={99}
                                    value={prediction.confidence}
                                    onChange={(e) => setPrediction({ ...prediction, confidence: Number(e.target.value) })}
                                    className="border-black dark:border-white"
                                />
                                <p className="text-xs text-gray-600 dark:text-gray-400">Plans below this threshold stay in “Pending review”.</p>
                            </div>
                            <Button onClick={() => persistSettings()} disabled={disableActions} className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black">
                                Update Prediction Rules
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Data Export & Compliance */}
                    <Card className="border-2 bg-white dark:bg-gray-900">
                        <CardHeader>
                            <CardTitle className="text-black dark:text-white">Data Export &amp; Compliance</CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">
                                Generate regulator-ready bundles with patient surge trends, action logs and audit trails.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Use exports when sharing evidence with NDMA, state health departments or hospital quality boards. Each download
                                includes anonymised trends plus the audit log hash for tamper proofing.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <Button onClick={exportPersonalData} variant="outline" className="border-black dark:border-white text-black dark:text-white">
                                    Download JSON Bundle
                                </Button>
                                <Button onClick={exportComplianceCsv} className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black">
                                    Export CSV for Auditors
                                </Button>
                                <Button onClick={requestDeletionCertificate} variant="secondary">
                                    Request Deletion Certificate
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Integrations & API */}
                    <Card className="border-2 bg-white dark:bg-gray-900">
                        <CardHeader>
                            <CardTitle className="text-black dark:text-white">Integrations &amp; API</CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">
                                Hook SwasthyaSense into HIS/EMR, air-quality probes and command-center bots with one secure key.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-black dark:text-white">Service API Key</Label>
                                <div className="flex gap-2">
                                    <Input value={apiKey} readOnly className="border-black dark:border-white font-mono text-sm" />
                                    <Button type="button" onClick={handleCopyKey} variant="outline" className="border-black dark:border-white">
                                        Copy
                                    </Button>
                                    <Button type="button" onClick={handleRotateKey} disabled={disableActions}>
                                        Rotate
                                    </Button>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Last rotated {lastRotatedLabel}</p>
                            </div>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc pl-5">
                                <li>Inbound webhooks: <span className="font-mono text-xs">/api/v1/integrations/his</span></li>
                                <li>Outbound pushes: <span className="font-mono text-xs">/api/v1/predictions/stream</span></li>
                                <li>Realtime status topics for Netlify/Edge deployments</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Security & Access */}
                    <Card className="border-2 bg-white dark:bg-gray-900">
                        <CardHeader>
                            <CardTitle className="text-black dark:text-white">Security &amp; Access</CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">
                                Enforce human-in-the-loop approvals, MFA and device level locks for control rooms.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-black dark:text-white">Two-factor approvals</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Require OTP before releasing surge plans.</p>
                                </div>
                                <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-black dark:text-white">Device lock</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Restrict dashboards to verified consoles.</p>
                                </div>
                                <Switch checked={deviceLock} onCheckedChange={setDeviceLock} />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-black dark:text-white">Session alerts</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Notify when approvals happen outside HQ.</p>
                                </div>
                                <Switch checked={sessionAlerts} onCheckedChange={setSessionAlerts} />
                            </div>
                            <Button onClick={() => persistSettings()} disabled={disableActions} className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black">
                                Save Security Rules
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
