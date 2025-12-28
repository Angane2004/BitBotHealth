'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, XCircle, Clock, Download, Filter, Trash2 } from 'lucide-react';
import { mockActions } from '@/lib/mock-data';
import { toast } from 'sonner';
import { useMemo, useState } from 'react';
import { updateDoc, doc, serverTimestamp, addDoc, deleteDoc } from 'firebase/firestore';
import { useActions } from '@/lib/firebase/hooks';
import { actionsCollection, ActionItem } from '@/lib/firebase/collections';

const statusTabs = [
    { value: 'all', label: 'All Actions' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'approved', label: 'Approved' },
    { value: 'completed', label: 'Completed' },
];

export default function ActionsPage() {
    const [activeTab, setActiveTab] = useState('all');
    const [showFilter, setShowFilter] = useState(false);
    const [filterPriority, setFilterPriority] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const { actions, loading } = useActions();
    const dataset = useMemo(
        () => (actions.length ? actions : mockActions.map(action => ({ ...action, id: `mock-${action.id}` }))),
        [actions]
    );

    const filteredActions = dataset.filter(action => {
        const matchesStatus = activeTab === 'all' || action.status === activeTab;
        const matchesPriority = filterPriority === 'all' || action.priority === filterPriority;
        const matchesCategory = filterCategory === 'all' || action.category === filterCategory;
        return matchesStatus && matchesPriority && matchesCategory;
    });

    const getStatusCount = (status: string) => {
        if (status === 'all') return dataset.length;
        return dataset.filter(a => a.status === status).length;
    };

    const persistMockAction = async (action: typeof dataset[number], status: 'approved' | 'rejected') => {
        const newAction: Omit<ActionItem, 'id'> = {
            hospitalId: action.hospitalId ?? 'demo-hospital',
            predictionId: action.predictionId ?? action.id ?? 'generated-mock',
            priority: action.priority ?? 'medium',
            category: action.category ?? 'staffing',
            title: action.title,
            description: action.description,
            rationale: action.rationale,
            estimatedCost: action.estimatedCost,
            status,
            dueDate: action.dueDate ?? new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await addDoc(actionsCollection, newAction as any);
    };

    const handleApprove = async (action: typeof dataset[number]) => {
        try {
            if (action.id.startsWith('mock')) {
                await persistMockAction(action, 'approved');
            } else {
                await updateDoc(doc(actionsCollection, action.id), {
                    status: 'approved',
                    approvedAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                });
            }

            toast.success('Action Approved', {
                description: `"${action.title}" has been approved and scheduled`,
            });
        } catch (error) {
            toast.error('Error', {
                description: (error as Error).message || 'Failed to approve action. Please try again.',
            });
        }
    };

    const handleReject = async (action: typeof dataset[number]) => {
        try {
            if (action.id.startsWith('mock')) {
                await persistMockAction(action, 'rejected');
            } else {
                await updateDoc(doc(actionsCollection, action.id), {
                    status: 'rejected',
                    rejectedAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                });
            }

            toast.error('Action Rejected', {
                description: `"${action.title}" has been rejected`,
            });
        } catch (error) {
            toast.error('Error', {
                description: (error as Error).message || 'Failed to reject action. Please try again.',
            });
        }
    };

    const handleDelete = async (action: typeof dataset[number]) => {
        try {
            if (action.id.startsWith('mock')) {
                toast.error('Cannot Delete', {
                    description: 'Mock actions cannot be deleted. Only real actions can be removed.',
                });
                return;
            }

            await deleteDoc(doc(actionsCollection, action.id));

            toast.success('Action Deleted', {
                description: `"${action.title}" has been permanently removed`,
            });
        } catch (error) {
            toast.error('Error', {
                description: (error as Error).message || 'Failed to delete action. Please try again.',
            });
        }
    };

    const handleExport = () => {
        // Create CSV content
        const headers = ['Title', 'Category', 'Priority', 'Status', 'Rationale', 'Cost', 'Due Date'];
        const rows = filteredActions.map(action => [
            action.title,
            action.category,
            action.priority,
            action.status,
            action.rationale,
            action.estimatedCost || 'N/A',
            action.dueDate || 'N/A'
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        // Create download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `actions-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast.success('Export Complete', {
            description: 'Actions data has been downloaded as CSV',
        });
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'destructive';
            case 'medium': return 'default';
            default: return 'secondary';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'staffing': return '👥';
            case 'supplies': return '📦';
            case 'advisory': return '📢';
            default: return '📋';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">
                        Action Items
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        AI-recommended actions for optimal hospital operations
                    </p>
                </div>
                <div className="flex gap-2">
                    <Dialog open={showFilter} onOpenChange={setShowFilter}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="gap-2 border-black dark:border-white text-black dark:text-white">
                                <Filter className="h-4 w-4" />
                                Filter
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white dark:bg-gray-900">
                            <DialogHeader>
                                <DialogTitle className="text-black dark:text-white">Filter Actions</DialogTitle>
                                <DialogDescription className="text-gray-600 dark:text-gray-400">
                                    Filter actions by priority and category
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="priority" className="text-black dark:text-white">Priority</Label>
                                    <Select value={filterPriority} onValueChange={setFilterPriority}>
                                        <SelectTrigger id="priority" className="border-black dark:border-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Priorities</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="low">Low</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category" className="text-black dark:text-white">Category</Label>
                                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                                        <SelectTrigger id="category" className="border-black dark:border-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Categories</SelectItem>
                                            <SelectItem value="staffing">Staffing</SelectItem>
                                            <SelectItem value="supplies">Supplies</SelectItem>
                                            <SelectItem value="advisory">Advisory</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setFilterPriority('all');
                                        setFilterCategory('all');
                                    }}
                                    className="border-black dark:border-white"
                                >
                                    Reset
                                </Button>
                                <Button onClick={() => setShowFilter(false)} className="bg-black dark:bg-white text-white dark:text-black">
                                    Apply
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Button onClick={handleExport} className="gap-2 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black">
                        <Download className="h-4 w-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Status Tabs with Smooth Indicator */}
            <div className="space-y-6">
                <div className="relative">
                    <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-lg relative overflow-x-auto">
                        {/* Sliding Indicator */}
                        <div
                            className="absolute top-1 bottom-1 bg-black dark:bg-white rounded-md transition-all duration-300 ease-in-out"
                            style={{
                                left: `${statusTabs.findIndex(t => t.value === activeTab) * (100 / statusTabs.length)}%`,
                                width: `calc(${100 / statusTabs.length}% - 8px)`,
                                marginLeft: '4px'
                            }}
                        />

                        {/* Tab Buttons */}
                        {statusTabs.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => setActiveTab(tab.value)}
                                className={`flex-1 relative z-10 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-colors duration-200 whitespace-nowrap ${activeTab === tab.value
                                    ? 'text-white dark:text-black'
                                    : 'text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white'
                                    }`}
                            >
                                <span className="font-medium">{tab.label}</span>
                                <Badge variant="secondary" className={`ml-1 ${activeTab === tab.value ? 'bg-white/20 dark:bg-black/20 text-white dark:text-black' : ''}`}>
                                    {getStatusCount(tab.value)}
                                </Badge>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Actions List */}
                <div className="space-y-4">
                    {loading && !actions.length && (
                        <Card className="border-2 bg-white dark:bg-gray-900">
                            <CardContent className="p-6 text-center text-gray-600 dark:text-gray-400">Loading real-time actions…</CardContent>
                        </Card>
                    )}
                    {filteredActions.length === 0 ? (
                        <Card className="border-2 bg-white dark:bg-gray-900">
                            <CardContent className="p-12 text-center">
                                <p className="text-gray-600 dark:text-gray-400">No actions match the current filters</p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredActions.map((action) => (
                            <Card key={action.id} className="border-2 hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-900">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-2xl">{getCategoryIcon(action.category)}</span>
                                                <Badge variant={getPriorityColor(action.priority)} className="border-black dark:border-white">
                                                    {action.priority} priority
                                                </Badge>
                                                <Badge variant="outline" className="border-black dark:border-white text-black dark:text-white">{action.category}</Badge>
                                            </div>
                                            <CardTitle className="text-xl mb-2 text-black dark:text-white">{action.title}</CardTitle>
                                            <CardDescription className="text-gray-600 dark:text-gray-400">{action.description}</CardDescription>
                                        </div>
                                        <div className="flex flex-col gap-2 items-end">
                                            {/* Delete Button - Always visible */}
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleDelete(action)}
                                                className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
                                                title="Delete action"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>

                                            {/* Status-specific buttons */}
                                            {action.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleApprove(action)}
                                                        className="bg-green-600 hover:bg-green-700 text-white"
                                                    >
                                                        <CheckCircle2 className="h-4 w-4 mr-1" />
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleReject(action)}
                                                        className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950 dark:hover:text-red-400"
                                                    >
                                                        <XCircle className="h-4 w-4 mr-1" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            )}
                                            {action.status === 'approved' && (
                                                <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-green-500">
                                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                                    Approved
                                                </Badge>
                                            )}
                                            {action.status === 'rejected' && (
                                                <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 border-red-500">
                                                    <XCircle className="h-3 w-3 mr-1" />
                                                    Rejected
                                                </Badge>
                                            )}
                                            {action.status === 'completed' && (
                                                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-blue-500">
                                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                                    Completed
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* AI Rationale */}
                                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                        <p className="text-sm font-medium text-black dark:text-white mb-1">
                                            AI Rationale
                                        </p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            {action.rationale}
                                        </p>
                                    </div>

                                    {/* Details */}
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-4">
                                            {action.estimatedCost && (
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    Est. Cost: <span className="font-semibold text-black dark:text-white">₹{action.estimatedCost.toLocaleString()}</span>
                                                </span>
                                            )}
                                            {action.dueDate && (
                                                <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                                    <Clock className="h-4 w-4" />
                                                    Due: <span className="font-semibold text-black dark:text-white">{new Date(action.dueDate).toLocaleDateString()}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
