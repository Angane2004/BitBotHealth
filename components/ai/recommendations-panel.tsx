'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { mockActions } from '@/lib/mock-data';
import { CheckCircle2, XCircle, Clock, AlertTriangle, Users, Package, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useActions } from '@/lib/firebase/hooks';
import { actionsCollection, ActionItem } from '@/lib/firebase/collections';
import { addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

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
    const { actions } = useActions();
    const displayActions = actions.length ? actions : mockActions;

    const persistDecision = async (action: Partial<ActionItem> & { id?: string }, status: ActionItem['status']) => {
        if (action.id && !action.id.startsWith('mock')) {
            await updateDoc(doc(actionsCollection, action.id), {
                status,
                updatedAt: serverTimestamp(),
            });
            return action.id;
        }

        const created = await addDoc(actionsCollection, {
            hospitalId: action.hospitalId ?? 'demo-hospital',
            predictionId: action.predictionId ?? action.id ?? 'generated-mock',
            priority: action.priority ?? 'medium',
            category: action.category ?? 'staffing',
            title: action.title ?? 'AI recommendation',
            description: action.description ?? '',
            rationale: action.rationale ?? '',
            estimatedCost: action.estimatedCost,
            status,
            dueDate: action.dueDate ?? new Date(),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return created.id;
    };

    const handleApprove = async (action: Partial<ActionItem> & { id?: string }) => {
        try {
            await persistDecision(action, 'approved');
            toast.success(`Approved: ${action.title}`, {
                description: 'Action has been scheduled for execution',
            });
        } catch (error) {
            toast.error('Failed to approve action', { description: (error as Error).message });
        }
    };

    const handleReject = async (action: Partial<ActionItem> & { id?: string }) => {
        try {
            await persistDecision(action, 'rejected');
            toast.error(`Rejected: ${action.title}`, {
                description: 'Action has been marked as rejected',
            });
        } catch (error) {
            toast.error('Failed to reject action', { description: (error as Error).message });
        }
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
                        {displayActions.filter(a => a.status === 'pending').length} Pending
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {displayActions.slice(0, 3).map((action, index) => {
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
                                                onClick={() => handleApprove(action)}
                                                className="flex-1"
                                            >
                                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleReject(action)}
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
