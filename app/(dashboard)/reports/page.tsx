'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, BarChart3, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function ReportsPage() {
    const handleExport = (type: string) => {
        toast.success(`${type} Export`, {
            description: `${type} report generated successfully`,
        });
    };

    const reports = [
        {
            title: 'Prediction Accuracy Report',
            description: 'Historical accuracy of AI predictions vs actual patient volumes',
            icon: BarChart3,
            type: 'PDF',
        },
        {
            title: 'Resource Utilization Report',
            description: 'Staff, bed, and inventory utilization across all hospitals',
            icon: FileText,
            type: 'CSV',
        },
        {
            title: 'Action Items Summary',
            description: 'Summary of all recommended actions and their outcomes',
            icon: FileText,
            type: 'PDF',
        },
        {
            title: 'Monthly Performance Report',
            description: 'Comprehensive monthly performance and impact analysis',
            icon: Calendar,
            type: 'PDF',
        },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
                <p className="text-muted-foreground mt-1">
                    Generate and export comprehensive reports and analytics
                </p>
            </div>

            {/* Reports Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {reports.map((report, index) => {
                    const Icon = report.icon;
                    return (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <Icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{report.title}</CardTitle>
                                            <CardDescription className="mt-1">
                                                {report.description}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2">
                                    <Button
                                        className="flex-1"
                                        onClick={() => handleExport(report.title)}
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Export {report.type}
                                    </Button>
                                    <Button variant="outline">
                                        Preview
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Audit Log */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Audit log of recent system actions and changes</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[
                            { action: 'Prediction generated', user: 'System', time: '2 hours ago' },
                            { action: 'Action approved: Increase Emergency Staff', user: 'Admin', time: '3 hours ago' },
                            { action: 'Report exported: Monthly Performance', user: 'Dr. Sharma', time: '5 hours ago' },
                            { action: 'Hospital added: Max Hospital', user: 'Admin', time: '1 day ago' },
                        ].map((log, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <div>
                                    <div className="font-medium text-sm">{log.action}</div>
                                    <div className="text-xs text-muted-foreground">by {log.user}</div>
                                </div>
                                <div className="text-xs text-muted-foreground">{log.time}</div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
