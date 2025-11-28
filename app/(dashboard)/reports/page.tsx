'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, BarChart3, TrendingUp, Clock } from 'lucide-react';
import { toast } from 'sonner';

const reports = [
    {
        id: 1,
        title: 'Prediction Accuracy Report',
        description: 'Historical accuracy metrics and model performance',
        icon: TrendingUp,
        formats: ['PDF', 'CSV'],
    },
    {
        id: 2,
        title: 'Resource Utilization Report',
        description: 'Bed occupancy, staff deployment, and inventory usage',
        icon: BarChart3,
        formats: ['PDF', 'Excel'],
    },
    {
        id: 3,
        title: 'Monthly Summary Report',
        description: 'Comprehensive overview of operations and predictions',
        icon: FileText,
        formats: ['PDF'],
    },
];

const auditLogs = [
    { id: 1, action: 'Action Approved', user: 'Dr. Sharma', details: 'Increased emergency staff by 5', time: '2 hours ago' },
    { id: 2, action: 'Report Generated', user: 'Admin', details: 'Monthly summary report created', time: '5 hours ago' },
    { id: 3, action: 'Prediction Updated', user: 'System', details: 'Emergency department forecast refreshed', time: '1 day ago' },
    { id: 4, action: 'Action Rejected', user: 'Dr. Patel', details: 'Supply order postponed', time: '2 days ago' },
    { id: 5, action: 'Settings Changed', user: 'Admin', details: 'Notification preferences updated', time: '3 days ago' },
];

export default function ReportsPage() {
    const handleDownload = async (title: string, format: string) => {
        const filename = `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}`;
        if (format === 'PDF') {
            const { jsPDF } = await import('jspdf');
            const doc = new jsPDF();
            doc.setFontSize(18);
            doc.text(title, 14, 20);
            doc.setFontSize(11);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
            doc.setFontSize(12);
            doc.text('Highlights', 14, 45);
            const lines = [
                '• Accuracy : 92%',
                '• Total Predictions : 1,234',
                '• Successful Forecasts : 1,136',
                '• Hospitals Monitored : 25',
            ];
            lines.forEach((line, idx) => doc.text(line, 14, 60 + idx * 8));
            doc.save(`${filename}.pdf`);
            toast.success('Download Started', { description: `Downloading ${title} as PDF...` });
            return;
        }

        if (format === 'Excel') {
            const table = `
                <table>
                    <tr><th>Metric</th><th>Value</th></tr>
                    <tr><td>Accuracy</td><td>92%</td></tr>
                    <tr><td>Total Predictions</td><td>1,234</td></tr>
                    <tr><td>Successful Forecasts</td><td>1,136</td></tr>
                    <tr><td>Hospitals Monitored</td><td>25</td></tr>
                </table>
            `;
            const blob = new Blob([table], { type: 'application/vnd.ms-excel' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filename}.xls`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            toast.success('Download Started', { description: `Downloading ${title} as Excel...` });
            return;
        }

        const csvContent = [
            'Metric,Value',
            'Accuracy,92%',
            'Total Predictions,1234',
            'Successful Forecasts,1136',
            'Hospitals Monitored,25',
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success('Download Started', {
            description: `Downloading ${title} as CSV...`,
        });
    };

    const handleExportLog = () => {
        const csvContent = [
            'Action,User,Details,Time',
            ...auditLogs.map(log => `"${log.action}","${log.user}","${log.details}","${log.time}"`)
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast.success('Export Complete', {
            description: 'Audit log has been downloaded as CSV',
        });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">
                    Reports & Analytics
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Generate and download comprehensive reports
                </p>
            </div>

            {/* Report Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {reports.map((report) => (
                    <Card key={report.id} className="border-2 hover:shadow-xl transition-all duration-300 hover:scale-105 group bg-white dark:bg-gray-900">
                        <CardHeader>
                            <div className="p-4 rounded-xl bg-black dark:bg-white w-fit mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <report.icon className="h-8 w-8 text-white dark:text-black" />
                            </div>
                            <CardTitle className="text-xl text-black dark:text-white">{report.title}</CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">{report.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                                {report.formats.map((format) => (
                                    <Button
                                        key={format}
                                        size="sm"
                                        onClick={() => handleDownload(report.title, format)}
                                        className="flex-1 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black transition-all duration-200 hover:scale-105"
                                    >
                                        <Download className="h-4 w-4 mr-1" />
                                        {format}
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Audit Log */}
            <Card className="border-2 bg-white dark:bg-gray-900">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl text-black dark:text-white">Audit Log</CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">Recent system activities and user actions</CardDescription>
                        </div>
                        <Button variant="outline" className="gap-2 border-black dark:border-white text-black dark:text-white" onClick={handleExportLog}>
                            <Download className="h-4 w-4" />
                            Export Log
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {auditLogs.map((log) => (
                            <div
                                key={log.id}
                                className="flex items-start justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="outline" className="border-black dark:border-white text-black dark:text-white">{log.action}</Badge>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">by {log.user}</span>
                                    </div>
                                    <p className="text-sm text-black dark:text-white">{log.details}</p>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                    <Clock className="h-4 w-4" />
                                    {log.time}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
