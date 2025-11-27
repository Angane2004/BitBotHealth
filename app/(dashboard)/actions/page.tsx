'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockActions } from '@/lib/mock-data';
import { CheckCircle2, XCircle, Clock, Download, Users, Package, FileText, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'staffing': return Users;
        case 'supplies': return Package;
        case 'advisory': return FileText;
        default: return AlertTriangle;
    }
};

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'high': return 'destructive';
        case 'medium': return 'default';
        default: return 'secondary';
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'approved': return 'text-green-600';
        case 'rejected': return 'text-red-600';
        case 'completed': return 'text-blue-600';
        default: return 'text-orange-600';
    }
};

export default function ActionsPage() {
    const handleExportCSV = () => {
        toast.success('CSV Export', {
            description: 'Action items exported successfully',
        });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Action Items</h1>
                    <p className="text-muted-foreground mt-1">
                        AI-recommended actions and their approval status
                    </p>
                </div>
                <Button onClick={handleExportCSV}>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                </Button>
            </div>

            {/* Status Tabs */}
            <Tabs defaultValue="all" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="all">All Actions</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                    {mockActions.map((action) => {
                        const Icon = getCategoryIcon(action.category);
                        return (
                            <Card key={action.id} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                <Icon className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <CardTitle className="text-lg">{action.title}</CardTitle>
                                                    <Badge variant={getPriorityColor(action.priority)}>
                                                        {action.priority}
                                                    </Badge>
                                                    <Badge variant="outline" className={getStatusColor(action.status)}>
                                                        {action.status}
                                                    </Badge>
                                                </div>
                                                <CardDescription>{action.description}</CardDescription>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="bg-muted/50 p-4 rounded-lg">
                                        <p className="text-sm font-medium mb-1">AI Rationale:</p>
                                        <p className="text-sm text-muted-foreground">{action.rationale}</p>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-4 text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                Due: {action.dueDate?.toLocaleDateString()}
                                            </span>
                                            {action.estimatedCost && (
                                                <span className="font-medium">
                                                    Cost: ₹{action.estimatedCost.toLocaleString()}
                                                </span>
                                            )}
                                        </div>

                                        {action.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="default">
                                                    <CheckCircle2 className="h-4 w-4 mr-1" />
                                                    Approve
                                                </Button>
                                                <Button size="sm" variant="outline">
                                                    <XCircle className="h-4 w-4 mr-1" />
                                                    Reject
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </TabsContent>

                <TabsContent value="pending">
                    <div className="text-center py-12 text-muted-foreground">
                        Filter: Pending actions only
                    </div>
                </TabsContent>

                <TabsContent value="approved">
                    <div className="text-center py-12 text-muted-foreground">
                        Filter: Approved actions only
                    </div>
                </TabsContent>

                <TabsContent value="completed">
                    <div className="text-center py-12 text-muted-foreground">
                        Filter: Completed actions only
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
