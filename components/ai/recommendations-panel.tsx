'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { mockActions } from '@/lib/mock-data';
import { CheckCircle2, XCircle, Clock, AlertTriangle, Users, Package, FileText } from 'lucide-react';
import { toast } from 'sonner';

const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'staffing':
            return Users;
        case 'supplies':
            return Package;
        case 'advisory':
            return FileText;
        default:
            return AlertTriangle;
    }
};

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'high':
            return 'destructive';
        case 'medium':
            return 'default';
        default:
            return 'secondary';
    }
};

export function RecommendationsPanel() {
    const handleApprove = (actionId: string, title: string) => {
        toast.success(`Approved: ${title}`, {
            description: 'Action has been scheduled for execution',
        });
    };

    const handleReject = (actionId: string, title: string) => {
        toast.error(`Rejected: ${title}`, {
            description: 'Action has been marked as rejected',
        });
    };

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">AI Recommendations</CardTitle>
                        <CardDescription>Prioritized action items based on predictions</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-sm">
                        {mockActions.filter(a => a.status === 'pending').length} Pending
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {mockActions.slice(0, 3).map((action, index) => {
                        const Icon = getCategoryIcon(action.category);
                        return (
                            <div key={action.id}>
                                {index > 0 && <Separator className="my-4" />}
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                <Icon className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-semibold text-sm">{action.title}</h4>
                                                    <Badge variant={getPriorityColor(action.priority)} className="text-xs">
                                                        {action.priority}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    {action.description}
                                                </p>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        Due: {action.dueDate?.toLocaleDateString()}
                                                    </span>
                                                    {action.estimatedCost && (
                                                        <span>Cost: ₹{action.estimatedCost.toLocaleString()}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-muted/50 p-3 rounded-lg">
                                        <p className="text-xs font-medium mb-1">AI Rationale:</p>
                                        <p className="text-xs text-muted-foreground">{action.rationale}</p>
                                    </div>

                                    {action.status === 'pending' && (
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                onClick={() => handleApprove(action.id, action.title)}
                                                className="flex-1"
                                            >
                                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleReject(action.id, action.title)}
                                                className="flex-1"
                                            >
                                                <XCircle className="h-4 w-4 mr-1" />
                                                Reject
                                            </Button>
                                        </div>
                                    )}

                                    {action.status === 'approved' && (
                                        <div className="flex items-center gap-2 text-sm text-green-600">
                                            <CheckCircle2 className="h-4 w-4" />
                                            <span>Approved and scheduled</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
