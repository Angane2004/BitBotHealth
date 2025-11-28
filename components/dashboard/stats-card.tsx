import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
    title: string;
    value: string | number;
    change?: string;
    trend?: 'up' | 'down';
    icon: LucideIcon;
    iconColor?: string;
    className?: string;
    iconClassName?: string;
}

export function StatsCard({
    title,
    value,
    change,
    trend,
    icon: Icon,
    iconColor = 'bg-blue-600',
    className,
    iconClassName,
}: StatsCardProps) {
    return (
        <Card className={cn('hover:shadow-lg transition-all duration-200 border-2 bg-white dark:bg-gray-900', className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-black dark:text-white">{title}</CardTitle>
                <div className={cn('p-2 rounded-lg', iconColor)}>
                    <Icon className={cn('h-5 w-5 text-white', iconClassName)} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-black dark:text-white">{value}</div>
                {change && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-1">
                        {trend === 'up' && <span className="text-green-600">↑</span>}
                        {trend === 'down' && <span className="text-red-600">↓</span>}
                        {change}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
